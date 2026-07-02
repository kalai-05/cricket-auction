import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Player } from '../../../core/models/player.model';
import { RoleIconPipe } from '../../pipes/role-icon.pipe';

@Component({
  selector: 'app-player-avatar',
  imports: [RoleIconPipe],
  templateUrl: './player-avatar.html',
  styleUrl: './player-avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerAvatar {
  readonly player = input.required<Player>();
  readonly sizePx = input(72);

  readonly initials = computed(() =>
    this.player()
      .name.split(' ')
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );
}
