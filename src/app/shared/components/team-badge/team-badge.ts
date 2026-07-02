import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Team } from '../../../core/models/team.model';

@Component({
  selector: 'app-team-badge',
  templateUrl: './team-badge.html',
  styleUrl: './team-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamBadge {
  readonly team = input.required<Team>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly showName = input(true);

  readonly initial = computed(() => this.team().shortCode.slice(0, 2).toUpperCase());
}
