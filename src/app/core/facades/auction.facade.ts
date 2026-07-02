import { computed, inject, Injectable, signal } from '@angular/core';
import { AuctionPhase } from '../models/enums/auction-phase.enum';
import { PlayerStatus } from '../models/enums/player-status.enum';
import { Bid } from '../models/bid.model';
import { BidRulesService } from '../services/bid/bid-rules.service';
import { SoundEffectsService } from '../services/audio/sound-effects.service';
import { AuctionStore } from '../state/auction.store';
import { PlayerStore } from '../state/player.store';
import { SettingsStore } from '../state/settings.store';
import { TeamStore } from '../state/team.store';
import { UiStore } from '../state/ui.store';
import { generateId } from '../../shared/utils/id.util';

export type HammerPhase = 'idle' | 'going-once' | 'going-twice';

/**
 * Orchestrates the live auction: the only place that coordinates
 * AuctionStore + TeamStore + PlayerStore together with the bid business rules.
 * Components call these methods; they never mutate the stores directly.
 */
@Injectable({ providedIn: 'root' })
export class AuctionFacade {
  private readonly auctionStore = inject(AuctionStore);
  private readonly teamStore = inject(TeamStore);
  private readonly playerStore = inject(PlayerStore);
  private readonly settingsStore = inject(SettingsStore);
  private readonly bidRules = inject(BidRulesService);
  private readonly soundEffects = inject(SoundEffectsService);
  private readonly uiStore = inject(UiStore);

  readonly phase = this.auctionStore.phase;
  readonly isRunning = this.auctionStore.isRunning;

  readonly currentPlayer = computed(() => {
    const id = this.auctionStore.currentPlayerId();
    return id ? (this.playerStore.getById(id) ?? null) : null;
  });

  readonly currentBiddingTeam = computed(() => {
    const id = this.auctionStore.currentBiddingTeamId();
    return id ? (this.teamStore.getById(id) ?? null) : null;
  });

  readonly currentBidAmount = this.auctionStore.currentBidAmount;
  readonly currentBidTrail = this.auctionStore.currentBidTrail;

  // ---- Bid increments (auctioneer selects +1 / +5 / +10) ----
  readonly bidIncrements = computed(() => this.settingsStore.settings().bidIncrements);
  readonly selectedIncrement = signal(1);

  readonly nextBidAmount = computed(() => {
    const next = this.auctionStore.currentBidAmount() + this.selectedIncrement();
    return Math.round(next * 100) / 100;
  });

  // ---- Countdown timer ----
  readonly timerEnabled = computed(() => this.settingsStore.settings().timerEnabled);
  readonly timeLeft = signal(0);
  readonly hammerPhase = computed<HammerPhase>(() => {
    if (!this.timerEnabled() || !this.auctionStore.hasCurrentPlayer()) return 'idle';
    const t = this.timeLeft();
    if (t <= 0) return 'idle';
    if (t <= 2) return 'going-twice';
    if (t <= 4) return 'going-once';
    return 'idle';
  });

  private timerHandle: ReturnType<typeof setInterval> | null = null;

  readonly eligibleTeamIds = computed(() => {
    const player = this.currentPlayer();
    const eligible = new Set<string>();
    if (!player) return eligible;

    const settings = this.settingsStore.settings();
    const players = this.playerStore.players();
    const amount = this.nextBidAmount();
    const leadingTeamId = this.auctionStore.currentBiddingTeamId();

    for (const team of this.teamStore.teams()) {
      if (team.id === leadingTeamId) continue;
      if (this.bidRules.canPlaceBid(team, player, amount, players, settings).valid) {
        eligible.add(team.id);
      }
    }
    return eligible;
  });

  readonly canMarkSold = computed(
    () => this.auctionStore.hasCurrentPlayer() && this.auctionStore.currentBiddingTeamId() !== null,
  );
  readonly canMarkUnsold = computed(() => this.auctionStore.hasCurrentPlayer());
  readonly canUndo = computed(() => this.auctionStore.soldLog().length > 0);
  readonly queueCount = computed(() => this.auctionStore.queue().length);
  readonly soldLog = this.auctionStore.soldLog;

  readonly nextUpPlayers = computed(() =>
    this.auctionStore
      .queue()
      .map((id) => this.playerStore.getById(id))
      .filter((p): p is NonNullable<typeof p> => !!p),
  );

  readonly progressPercent = computed(() => {
    const total = this.playerStore.players().length;
    if (total === 0) return 0;
    return Math.round((this.auctionStore.soldLog().length / total) * 100);
  });

  startAuction(): void {
    const queue = this.playerStore.availablePlayers().map((p) => p.id);
    if (queue.length === 0) {
      this.uiStore.showToast('No available players to auction.', 'warning');
      return;
    }
    this.auctionStore.setQueue(queue);
    this.auctionStore.setPhase(AuctionPhase.InProgress);
    this.advanceToNextPlayer();
  }

  setIncrement(step: number): void {
    this.selectedIncrement.set(step);
  }

  cycleIncrement(direction: 1 | -1): void {
    const steps = this.bidIncrements();
    const index = steps.indexOf(this.selectedIncrement());
    const next = steps[(index + direction + steps.length) % steps.length];
    this.selectedIncrement.set(next);
  }

  placeBid(teamId: string): void {
    const player = this.currentPlayer();
    if (!player || !this.isRunning()) return;

    if (!this.eligibleTeamIds().has(teamId)) {
      const team = this.teamStore.getById(teamId);
      this.uiStore.showToast(`${team?.name ?? 'Team'} cannot place this bid.`, 'warning');
      return;
    }

    const bid: Bid = {
      id: generateId('bid'),
      playerId: player.id,
      teamId,
      amount: this.nextBidAmount(),
      timestamp: Date.now(),
    };
    this.auctionStore.pushBid(bid);
    this.soundEffects.play('bid');
    this.restartTimer();
  }

  /** Auctioneer override: raise the asking price without changing the leader. */
  increaseBid(): void {
    if (!this.auctionStore.hasCurrentPlayer() || !this.isRunning()) return;
    this.auctionStore.setCurrentBidAmount(this.nextBidAmount());
    this.restartTimer();
  }

  /** Auctioneer override: lower the asking price (never below base price). */
  decreaseBid(): void {
    const player = this.currentPlayer();
    if (!player || !this.isRunning()) return;
    const lowered = Math.round((this.auctionStore.currentBidAmount() - this.selectedIncrement()) * 100) / 100;
    this.auctionStore.setCurrentBidAmount(Math.max(player.basePrice, lowered));
  }

  resetBid(): void {
    const player = this.currentPlayer();
    if (!player) return;
    this.auctionStore.resetBid(player.basePrice);
    this.restartTimer();
  }

  /** Sends the current player to the back of the queue and moves on. */
  skipPlayer(): void {
    const player = this.currentPlayer();
    if (!player || !this.isRunning()) return;
    this.playerStore.updatePlayer(player.id, { status: PlayerStatus.Available });
    this.auctionStore.requeueEnd(player.id);
    this.auctionStore.clearCurrent();
    this.advanceToNextPlayer();
  }

  markSold(): void {
    const player = this.currentPlayer();
    const team = this.currentBiddingTeam();
    if (!player || !team) return;

    const price = this.auctionStore.currentBidAmount();
    this.teamStore.assignPlayer(team.id, player.id, price);
    this.playerStore.updatePlayer(player.id, {
      status: PlayerStatus.Sold,
      soldPrice: price,
      soldToTeamId: team.id,
    });
    this.auctionStore.pushSoldRecord({
      id: generateId('record'),
      playerId: player.id,
      teamId: team.id,
      finalPrice: price,
      wasUnsold: false,
      timestamp: Date.now(),
    });
    this.soundEffects.play('sold');
    this.auctionStore.clearCurrent();
    this.advanceToNextPlayer();
  }

  markUnsold(): void {
    const player = this.currentPlayer();
    if (!player) return;

    this.playerStore.updatePlayer(player.id, { status: PlayerStatus.Unsold });
    this.auctionStore.pushSoldRecord({
      id: generateId('record'),
      playerId: player.id,
      teamId: null,
      finalPrice: null,
      wasUnsold: true,
      timestamp: Date.now(),
    });
    this.soundEffects.play('unsold');
    this.auctionStore.clearCurrent();
    this.advanceToNextPlayer();
  }

  undoLastAction(): void {
    const record = this.auctionStore.popLastSoldRecord();
    if (!record) return;

    if (!record.wasUnsold && record.teamId && record.finalPrice !== null) {
      this.teamStore.unassignPlayer(record.teamId, record.playerId, record.finalPrice);
    }

    this.playerStore.updatePlayer(record.playerId, {
      status: PlayerStatus.InAuction,
      soldPrice: null,
      soldToTeamId: null,
    });

    const currentId = this.auctionStore.currentPlayerId();
    if (currentId) {
      this.playerStore.updatePlayer(currentId, { status: PlayerStatus.Available });
      this.auctionStore.requeueFront(currentId);
    }

    const player = this.playerStore.getById(record.playerId);
    this.auctionStore.setCurrentPlayer(record.playerId, player?.basePrice ?? 0);
    this.restartTimer();
    this.uiStore.showToast('Last action undone.', 'info');
  }

  pause(): void {
    this.auctionStore.setPhase(AuctionPhase.Paused);
    this.stopTimer();
  }

  resume(): void {
    this.auctionStore.setPhase(AuctionPhase.InProgress);
    this.restartTimer();
  }

  resetAuction(): void {
    for (const player of this.playerStore.players()) {
      this.playerStore.updatePlayer(player.id, {
        status: PlayerStatus.Available,
        soldPrice: null,
        soldToTeamId: null,
      });
    }
    this.teamStore.resetRosters();
    this.auctionStore.reset();
    this.stopTimer();
  }

  /** Full factory reset: wipes teams, players, settings and auction state. */
  resetEverything(): void {
    this.teamStore.resetAll();
    this.playerStore.resetAll();
    this.settingsStore.reset();
    this.auctionStore.reset();
    this.stopTimer();
  }

  private advanceToNextPlayer(): void {
    const nextId = this.auctionStore.popNextFromQueue();
    if (!nextId) {
      this.auctionStore.setPhase(AuctionPhase.Completed);
      this.auctionStore.clearCurrent();
      this.stopTimer();
      return;
    }
    const player = this.playerStore.getById(nextId);
    this.playerStore.updatePlayer(nextId, { status: PlayerStatus.InAuction });
    this.auctionStore.setCurrentPlayer(nextId, player?.basePrice ?? 0);
    this.restartTimer();
  }

  private restartTimer(): void {
    this.stopTimer();
    if (!this.timerEnabled() || !this.auctionStore.hasCurrentPlayer()) return;

    this.timeLeft.set(this.settingsStore.settings().bidTimerSeconds);
    this.timerHandle = setInterval(() => {
      const next = this.timeLeft() - 1;
      this.timeLeft.set(Math.max(0, next));
      if (next <= 0) {
        this.stopTimer();
        this.resolveOnTimeout();
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerHandle !== null) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
    this.timeLeft.set(0);
  }

  private resolveOnTimeout(): void {
    if (!this.isRunning() || !this.auctionStore.hasCurrentPlayer()) return;
    if (this.auctionStore.currentBiddingTeamId()) {
      this.markSold();
    } else {
      this.markUnsold();
    }
  }
}
