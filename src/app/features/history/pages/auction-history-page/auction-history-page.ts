import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { AuctionFacade } from '../../../../core/facades/auction.facade';
import { PlayerFacade } from '../../../../core/facades/player.facade';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { ExportService } from '../../../../core/services/export/export.service';
import { HistoryEntry } from '../../history-entry.model';
import { HistoryTimeline } from '../../components/history-timeline/history-timeline';
import { HistoryTable } from '../../components/history-table/history-table';

@Component({
  selector: 'app-auction-history-page',
  imports: [MatButtonModule, MatButtonToggleModule, MatIconModule, HistoryTimeline, HistoryTable],
  templateUrl: './auction-history-page.html',
  styleUrl: './auction-history-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionHistoryPage {
  private readonly auctionFacade = inject(AuctionFacade);
  private readonly playerFacade = inject(PlayerFacade);
  private readonly teamFacade = inject(TeamFacade);
  private readonly exportService = inject(ExportService);

  readonly view = signal<'timeline' | 'table'>('timeline');

  readonly entries = computed<HistoryEntry[]>(() =>
    [...this.auctionFacade.soldLog()]
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((record) => {
        const team = record.teamId ? this.teamFacade.getById(record.teamId) : undefined;
        return {
          id: record.id,
          playerName: this.playerFacade.getById(record.playerId)?.name ?? 'Unknown Player',
          teamName: team?.name ?? null,
          teamColorHex: team?.colorHex ?? null,
          price: record.finalPrice,
          wasUnsold: record.wasUnsold,
          timestamp: record.timestamp,
        };
      }),
  );

  setView(view: 'timeline' | 'table'): void {
    this.view.set(view);
  }

  exportCsv(): void {
    this.exportService.exportHistoryCsv(
      this.entries().map((e) => ({
        Player: e.playerName,
        Team: e.teamName ?? '',
        'Price (Cr)': e.price ?? '',
        Result: e.wasUnsold ? 'Unsold' : 'Sold',
      })),
    );
  }
}
