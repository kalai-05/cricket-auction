import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TeamSpendStat } from '../../../../core/services/statistics/statistics.service';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';

@Component({
  selector: 'app-spend-chart',
  imports: [CreditPill],
  templateUrl: './spend-chart.html',
  styleUrl: './spend-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpendChart {
  readonly stats = input.required<TeamSpendStat[]>();

  readonly maxSpend = computed(() => Math.max(1, ...this.stats().map((s) => s.spent)));

  percentOf(spent: number): number {
    return Math.round((spent / this.maxSpend()) * 100);
  }
}
