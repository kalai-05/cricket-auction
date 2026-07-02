import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PLAYER_GENDER_LABELS } from '../../../../core/models/enums/player-gender.enum';
import { PLAYER_ROLE_LABELS } from '../../../../core/models/enums/player-role.enum';
import { Player } from '../../../../core/models/player.model';
import { PlayerAvatar } from '../../../../shared/components/player-avatar/player-avatar';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-roster-table',
  imports: [PlayerAvatar, CreditPill, EmptyState],
  templateUrl: './roster-table.html',
  styleUrl: './roster-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RosterTable {
  readonly players = input.required<Player[]>();

  readonly roleLabels = PLAYER_ROLE_LABELS;
  readonly genderLabels = PLAYER_GENDER_LABELS;
}
