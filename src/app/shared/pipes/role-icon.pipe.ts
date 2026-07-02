import { Pipe, PipeTransform } from '@angular/core';
import { PlayerRole } from '../../core/models/enums/player-role.enum';

const ICONS: Record<PlayerRole, string> = {
  [PlayerRole.Batsman]: 'sports_cricket',
  [PlayerRole.Bowler]: 'sports_handball',
  [PlayerRole.AllRounder]: 'stars',
  [PlayerRole.WicketKeeper]: 'shield',
};

@Pipe({ name: 'appRoleIcon' })
export class RoleIconPipe implements PipeTransform {
  transform(role: PlayerRole): string {
    return ICONS[role];
  }
}
