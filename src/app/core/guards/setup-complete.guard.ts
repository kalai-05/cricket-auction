import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PlayerFacade } from '../facades/player.facade';
import { TeamFacade } from '../facades/team.facade';

export const setupCompleteGuard: CanActivateFn = () => {
  const teamFacade = inject(TeamFacade);
  const playerFacade = inject(PlayerFacade);
  const router = inject(Router);

  if (teamFacade.isSetupComplete() && playerFacade.hasPlayers()) {
    return true;
  }

  return router.createUrlTree(['/setup/teams']);
};
