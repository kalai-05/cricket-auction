import { Injectable } from '@angular/core';
import { PlayerGender, PLAYER_GENDER_LABELS } from '../../models/enums/player-gender.enum';
import { PlayerRole, PLAYER_ROLE_LABELS } from '../../models/enums/player-role.enum';
import { PlayerStatus } from '../../models/enums/player-status.enum';
import { Player } from '../../models/player.model';
import { Team } from '../../models/team.model';

export interface TeamSpendStat {
  teamId: string;
  teamName: string;
  colorHex: string;
  spent: number;
  remaining: number;
}

export interface CountStat {
  label: string;
  count: number;
}

export interface TopBuyStat {
  playerId: string;
  playerName: string;
  teamName: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  teamSpend(teams: Team[]): TeamSpendStat[] {
    return teams.map((team) => ({
      teamId: team.id,
      teamName: team.name,
      colorHex: team.colorHex,
      spent: Math.round(team.spentPurse * 100) / 100,
      remaining: Math.round((team.totalPurse - team.spentPurse) * 100) / 100,
    }));
  }

  genderSplit(soldPlayers: Player[]): CountStat[] {
    return Object.values(PlayerGender).map((gender) => ({
      label: PLAYER_GENDER_LABELS[gender],
      count: soldPlayers.filter((p) => p.gender === gender).length,
    }));
  }

  roleDistribution(soldPlayers: Player[]): CountStat[] {
    return Object.values(PlayerRole).map((role) => ({
      label: PLAYER_ROLE_LABELS[role],
      count: soldPlayers.filter((p) => p.role === role).length,
    }));
  }

  averagePricePerRole(soldPlayers: Player[]): CountStat[] {
    return Object.values(PlayerRole).map((role) => {
      const inRole = soldPlayers.filter((p) => p.role === role && p.soldPrice !== null);
      const total = inRole.reduce((sum, p) => sum + (p.soldPrice ?? 0), 0);
      return {
        label: PLAYER_ROLE_LABELS[role],
        count: inRole.length ? Math.round((total / inRole.length) * 100) / 100 : 0,
      };
    });
  }

  topBuys(soldPlayers: Player[], teams: Team[], limit = 10): TopBuyStat[] {
    const teamById = new Map(teams.map((t) => [t.id, t]));
    return [...soldPlayers]
      .filter((p) => p.soldPrice !== null)
      .sort((a, b) => (b.soldPrice ?? 0) - (a.soldPrice ?? 0))
      .slice(0, limit)
      .map((p) => ({
        playerId: p.id,
        playerName: p.name,
        teamName: p.soldToTeamId ? (teamById.get(p.soldToTeamId)?.name ?? 'Unknown') : 'Unknown',
        price: p.soldPrice ?? 0,
      }));
  }

  unsoldCount(players: Player[]): number {
    return players.filter((p) => p.status === PlayerStatus.Unsold).length;
  }

  lowestBuy(soldPlayers: Player[]): TopBuyStat | null {
    const sold = soldPlayers.filter((p) => p.soldPrice !== null);
    if (sold.length === 0) return null;
    const cheapest = sold.reduce((min, p) => ((p.soldPrice ?? 0) < (min.soldPrice ?? 0) ? p : min));
    return {
      playerId: cheapest.id,
      playerName: cheapest.name,
      teamName: '',
      price: cheapest.soldPrice ?? 0,
    };
  }

  averagePrice(soldPlayers: Player[]): number {
    const sold = soldPlayers.filter((p) => p.soldPrice !== null);
    if (sold.length === 0) return 0;
    const total = sold.reduce((sum, p) => sum + (p.soldPrice ?? 0), 0);
    return Math.round((total / sold.length) * 100) / 100;
  }

  mostExpensiveTeam(teams: Team[]): Team | null {
    if (teams.length === 0) return null;
    return teams.reduce((max, t) => (t.spentPurse > max.spentPurse ? t : max));
  }

  leastBudgetTeam(teams: Team[]): Team | null {
    if (teams.length === 0) return null;
    return teams.reduce((min, t) =>
      t.totalPurse - t.spentPurse < min.totalPurse - min.spentPurse ? t : min,
    );
  }

  genderPurchasedCount(soldPlayers: Player[], gender: PlayerGender): number {
    return soldPlayers.filter((p) => p.gender === gender).length;
  }
}
