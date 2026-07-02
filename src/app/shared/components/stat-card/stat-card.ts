import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GlassPanelDirective } from '../../directives/glass-panel.directive';

@Component({
  selector: 'app-stat-card',
  imports: [GlassPanelDirective],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input<string | null>(null);
  readonly tint = input<'gold' | 'blue'>('gold');
}
