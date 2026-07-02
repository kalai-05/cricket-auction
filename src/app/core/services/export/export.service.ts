import { Injectable } from '@angular/core';
import { PLAYER_ROLE_LABELS } from '../../models/enums/player-role.enum';
import { PLAYER_GENDER_LABELS } from '../../models/enums/player-gender.enum';
import { Player } from '../../models/player.model';
import { Team } from '../../models/team.model';
import { downloadTextFile, toCsv } from '../../../shared/utils/csv.util';
import { LocalStorageService } from '../storage/local-storage.service';
import { ALL_STORAGE_KEYS } from '../storage/storage-keys.const';

@Injectable({ providedIn: 'root' })
export class ExportService {
  constructor(private readonly storage: LocalStorageService) {}

  exportFullBackup(): void {
    const dump = this.storage.dumpAll(ALL_STORAGE_KEYS);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    downloadTextFile(
      `ipl-auction-backup-${stamp}.json`,
      JSON.stringify(dump, null, 2),
      'application/json',
    );
  }

  async importFullBackup(file: File): Promise<void> {
    const text = await file.text();
    const dump = JSON.parse(text) as Record<string, unknown>;
    this.storage.restoreAll(dump);
    window.location.reload();
  }

  exportTeamRostersCsv(teams: Team[], players: Player[]): void {
    const playerById = new Map(players.map((p) => [p.id, p]));

    const rows = teams.flatMap((team) =>
      team.playerIds.map((playerId) => {
        const player = playerById.get(playerId);
        return {
          Team: team.name,
          Player: player?.name ?? 'Unknown',
          Role: player ? PLAYER_ROLE_LABELS[player.role] : '',
          Gender: player ? PLAYER_GENDER_LABELS[player.gender] : '',
          'Price (Cr)': player?.soldPrice ?? '',
        };
      }),
    );

    downloadTextFile('ipl-auction-rosters.csv', toCsv(rows), 'text/csv');
  }

  exportHistoryCsv(rows: Record<string, unknown>[]): void {
    downloadTextFile('ipl-auction-history.csv', toCsv(rows), 'text/csv');
  }

  /**
   * Excel export without bundling a spreadsheet library: Excel opens an
   * HTML table saved as .xls natively, which keeps the app dependency-free.
   */
  exportTeamRostersExcel(teams: Team[], players: Player[]): void {
    const playerById = new Map(players.map((p) => [p.id, p]));
    const escapeHtml = (value: unknown): string =>
      String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const rows = teams.flatMap((team) =>
      team.playerIds.map((playerId) => {
        const player = playerById.get(playerId);
        return `<tr>
          <td>${escapeHtml(team.name)}</td>
          <td>${escapeHtml(player?.name ?? 'Unknown')}</td>
          <td>${escapeHtml(player ? PLAYER_ROLE_LABELS[player.role] : '')}</td>
          <td>${escapeHtml(player ? PLAYER_GENDER_LABELS[player.gender] : '')}</td>
          <td>${escapeHtml(player?.soldPrice ?? '')}</td>
        </tr>`;
      }),
    );

    const table = `<html><head><meta charset="utf-8" /></head><body>
      <table border="1">
        <tr><th>Team</th><th>Player</th><th>Role</th><th>Gender</th><th>Price (Cr)</th></tr>
        ${rows.join('\n')}
      </table>
    </body></html>`;

    downloadTextFile('ipl-auction-rosters.xls', table, 'application/vnd.ms-excel');
  }

  triggerPrint(): void {
    window.print();
  }
}
