import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CreditsPipe } from '../../pipes/credits.pipe';

@Component({
  selector: 'app-credit-pill',
  imports: [CreditsPipe],
  templateUrl: './credit-pill.html',
  styleUrl: './credit-pill.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPill {
  readonly amount = input.required<number>();
  readonly variant = input<'gold' | 'blue' | 'danger'>('gold');
  readonly label = input<string | null>(null);
}
