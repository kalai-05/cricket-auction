import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLAYER_CATEGORY_SHORT_LABELS } from '../../../../core/models/enums/player-category.enum';
import { PLAYER_GENDER_LABELS } from '../../../../core/models/enums/player-gender.enum';
import { PLAYER_ROLE_LABELS } from '../../../../core/models/enums/player-role.enum';
import { PlayerStatus } from '../../../../core/models/enums/player-status.enum';
import { Player } from '../../../../core/models/player.model';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';
import { PlayerAvatar } from '../../../../shared/components/player-avatar/player-avatar';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';

@Component({
  selector: 'app-player-card',
  imports: [RouterLink, GlassPanelDirective, PlayerAvatar, CreditPill],
  templateUrl: './player-card.html',
  styleUrl: './player-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerCard {
  readonly player = input.required<Player>();

  readonly roleLabels = PLAYER_ROLE_LABELS;
  readonly genderLabels = PLAYER_GENDER_LABELS;
  readonly categoryLabels = PLAYER_CATEGORY_SHORT_LABELS;
  readonly PlayerStatus = PlayerStatus;
}
