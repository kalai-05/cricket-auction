import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CountStat } from '../../../../core/services/statistics/statistics.service';

@Component({
  selector: 'app-gender-split-chart',
  templateUrl: './gender-split-chart.html',
  styleUrl: './gender-split-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenderSplitChart {
  readonly stats = input.required<CountStat[]>();

  readonly total = computed(() => this.stats().reduce((sum, s) => sum + s.count, 0) || 1);

  percentOf(count: number): number {
    return Math.round((count / this.total()) * 100);
  }
}
