import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Player } from '../../../../core/models/player.model';
import { PLAYER_CATEGORY_SHORT_LABELS } from '../../../../core/models/enums/player-category.enum';
import { PLAYER_GENDER_LABELS } from '../../../../core/models/enums/player-gender.enum';
import { PLAYER_ROLE_LABELS } from '../../../../core/models/enums/player-role.enum';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';
import { PlayerAvatar } from '../../../../shared/components/player-avatar/player-avatar';
import { CreditPill } from '../../../../shared/components/credit-pill/credit-pill';

@Component({
  selector: 'app-current-player-card',
  imports: [MatIconModule, GlassPanelDirective, PlayerAvatar, CreditPill],
  templateUrl: './current-player-card.html',
  styleUrl: './current-player-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentPlayerCard {
  readonly player = input<Player | null>(null);

  readonly roleLabels = PLAYER_ROLE_LABELS;
  readonly genderLabels = PLAYER_GENDER_LABELS;
  readonly categoryLabels = PLAYER_CATEGORY_SHORT_LABELS;
  readonly stars = [1, 2, 3, 4, 5];
}
