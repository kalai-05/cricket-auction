import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HistoryEntry } from '../../history-entry.model';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-history-timeline',
  imports: [MatIconModule, CreditPill, EmptyState],
  templateUrl: './history-timeline.html',
  styleUrl: './history-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryTimeline {
  readonly entries = input.required<HistoryEntry[]>();
}
