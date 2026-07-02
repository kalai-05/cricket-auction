import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-budget-gauge',
  templateUrl: './budget-gauge.html',
  styleUrl: './budget-gauge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetGauge {
  readonly spent = input.required<number>();
  readonly total = input.required<number>();
  readonly sizePx = input(96);
  readonly colorHex = input('#d4af37');

  private readonly radius = 40;
  private readonly circumference = 2 * Math.PI * this.radius;

  readonly percentSpent = computed(() => {
    const total = this.total();
    return total > 0 ? Math.min(100, Math.round((this.spent() / total) * 100)) : 0;
  });

  readonly dashOffset = computed(
    () => this.circumference - (this.percentSpent() / 100) * this.circumference,
  );

  readonly circumferenceValue = this.circumference;
}
