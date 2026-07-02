import { Injectable } from '@angular/core';
import { AuctionSettings } from '../../models/auction-settings.model';
import { Player } from '../../models/player.model';
import { PlayerGender } from '../../models/enums/player-gender.enum';
import { Team } from '../../models/team.model';

export interface BidEligibility {
  valid: boolean;
  reason?: string;
}

@Injectable({ providedIn: 'root' })
export class BidRulesService {
  remainingPurse(team: Team): number {
    return Math.round((team.totalPurse - team.spentPurse) * 100) / 100;
  }

  genderCount(team: Team, players: Player[], gender: PlayerGender): number {
    const ids = new Set(team.playerIds);
    return players.filter((p) => ids.has(p.id) && p.gender === gender).length;
  }

  hasSquadRoom(team: Team, players: Player[], gender: PlayerGender, settings: AuctionSettings): boolean {
    const count = this.genderCount(team, players, gender);
    const cap = gender === PlayerGender.Boy ? team.maxBoys : team.maxGirls;
    return count < cap;
  }

  canPlaceBid(
    team: Team,
    player: Player,
    amount: number,
    players: Player[],
    settings: AuctionSettings,
  ): BidEligibility {
    if (this.remainingPurse(team) < amount) {
      return { valid: false, reason: `${team.name} does not have enough remaining purse.` };
    }
    if (!this.hasSquadRoom(team, players, player.gender, settings)) {
      const label = player.gender === PlayerGender.Boy ? 'Boys' : 'Girls';
      return { valid: false, reason: `${team.name}'s ${label} squad is already full.` };
    }
    return { valid: true };
  }
}
