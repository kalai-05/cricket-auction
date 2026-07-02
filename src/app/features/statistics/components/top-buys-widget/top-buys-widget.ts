import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TopBuyStat } from '../../../../core/services/statistics/statistics.service';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-top-buys-widget',
  imports: [CreditPill, EmptyState],
  templateUrl: './top-buys-widget.html',
  styleUrl: './top-buys-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBuysWidget {
  readonly buys = input.required<TopBuyStat[]>();
}
