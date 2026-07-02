import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CountStat } from '../../../../core/services/statistics/statistics.service';

@Component({
  selector: 'app-role-distribution-chart',
  templateUrl: './role-distribution-chart.html',
  styleUrl: './role-distribution-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleDistributionChart {
  readonly stats = input.required<CountStat[]>();

  readonly maxCount = computed(() => Math.max(1, ...this.stats().map((s) => s.count)));

  percentOf(count: number): number {
    return Math.round((count / this.maxCount()) * 100);
  }
}
