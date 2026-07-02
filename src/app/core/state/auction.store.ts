import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuctionPhase } from '../models/enums/auction-phase.enum';
import { AuctionState, INITIAL_AUCTION_STATE } from '../models/auction-state.model';
import { Bid } from '../models/bid.model';
import { SoldRecord } from '../models/sold-record.model';
import { LocalStorageService } from '../services/storage/local-storage.service';
import { STORAGE_KEYS } from '../services/storage/storage-keys.const';

/**
 * Pure auction state container. Knows nothing about Team/Player business
 * rules (purse math, squad caps) — that orchestration lives in AuctionFacade.
 */
@Injectable({ providedIn: 'root' })
export class AuctionStore {
  private readonly storage = inject(LocalStorageService);

  private readonly _state = signal<AuctionState>(
    this.storage.load<AuctionState>(STORAGE_KEYS.auctionState) ?? INITIAL_AUCTION_STATE,
  );

  readonly state = this._state.asReadonly();

  readonly phase = computed(() => this._state().phase);
  readonly currentPlayerId = computed(() => this._state().currentPlayerId);
  readonly currentBidAmount = computed(() => this._state().currentBidAmount);
  readonly currentBiddingTeamId = computed(() => this._state().currentBiddingTeamId);
  readonly currentBidTrail = computed(() => this._state().currentBidTrail);
  readonly queue = computed(() => this._state().queue);
  readonly soldLog = computed(() => this._state().soldLog);
  readonly isRunning = computed(() => this._state().phase === AuctionPhase.InProgress);
  readonly hasCurrentPlayer = computed(() => this._state().currentPlayerId !== null);

  constructor() {
    effect(() => {
      this.storage.save(STORAGE_KEYS.auctionState, this._state());
    });
  }

  setQueue(ids: string[]): void {
    this._state.update((s) => ({ ...s, queue: ids }));
  }

  setPhase(phase: AuctionPhase): void {
    this._state.update((s) => ({
      ...s,
      phase,
      startedAt: s.startedAt ?? (phase === AuctionPhase.InProgress ? Date.now() : s.startedAt),
    }));
  }

  /** Pulls the next player id off the front of the queue without setting it as current. */
  peekNext(): string | null {
    return this._state().queue[0] ?? null;
  }

  popNextFromQueue(): string | null {
    const [next, ...rest] = this._state().queue;
    if (next === undefined) return null;
    this._state.update((s) => ({ ...s, queue: rest }));
    return next;
  }

  requeueFront(playerId: string): void {
    this._state.update((s) => ({ ...s, queue: [playerId, ...s.queue] }));
  }

  requeueEnd(playerId: string): void {
    this._state.update((s) => ({ ...s, queue: [...s.queue, playerId] }));
  }

  /** Auctioneer override: adjust the current amount without a team bid. */
  setCurrentBidAmount(amount: number): void {
    this._state.update((s) => ({ ...s, currentBidAmount: amount }));
  }

  /** Clears bids on the current player back to the base price. */
  resetBid(basePrice: number): void {
    this._state.update((s) => ({
      ...s,
      currentBidAmount: basePrice,
      currentBiddingTeamId: null,
      currentBidTrail: [],
    }));
  }

  setCurrentPlayer(playerId: string | null, basePrice: number): void {
    this._state.update((s) => ({
      ...s,
      currentPlayerId: playerId,
      currentBidAmount: basePrice,
      currentBiddingTeamId: null,
      currentBidTrail: [],
    }));
  }

  pushBid(bid: Bid): void {
    this._state.update((s) => ({
      ...s,
      currentBidAmount: bid.amount,
      currentBiddingTeamId: bid.teamId,
      currentBidTrail: [...s.currentBidTrail, bid],
    }));
  }

  pushSoldRecord(record: SoldRecord): void {
    this._state.update((s) => ({ ...s, soldLog: [...s.soldLog, record] }));
  }

  popLastSoldRecord(): SoldRecord | undefined {
    const log = this._state().soldLog;
    const last = log[log.length - 1];
    if (!last) return undefined;
    this._state.update((s) => ({ ...s, soldLog: s.soldLog.slice(0, -1) }));
    return last;
  }

  clearCurrent(): void {
    this._state.update((s) => ({
      ...s,
      currentPlayerId: null,
      currentBidAmount: 0,
      currentBiddingTeamId: null,
      currentBidTrail: [],
    }));
  }

  reset(): void {
    this._state.set(INITIAL_AUCTION_STATE);
  }
}
