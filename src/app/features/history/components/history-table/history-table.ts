import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HistoryEntry } from '../../history-entry.model';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-history-table',
  imports: [CreditPill, EmptyState],
  templateUrl: './history-table.html',
  styleUrl: './history-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryTable {
  readonly entries = input.required<HistoryEntry[]>();
}
