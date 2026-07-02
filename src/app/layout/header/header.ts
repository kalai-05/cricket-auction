import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AuctionFacade } from '../../core/facades/auction.facade';
import { PlayerFacade } from '../../core/facades/player.facade';
import { FullscreenService } from '../../core/services/fullscreen/fullscreen.service';
import { SoundEffectsService } from '../../core/services/audio/sound-effects.service';
import { ThemeService } from '../../core/services/theme/theme.service';
import { UiStore } from '../../core/state/ui.store';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly fullscreenService = inject(FullscreenService);
  private readonly themeService = inject(ThemeService);
  readonly uiStore = inject(UiStore);
  readonly soundEffects = inject(SoundEffectsService);
  readonly auctionFacade = inject(AuctionFacade);
  private readonly playerFacade = inject(PlayerFacade);

  readonly showProgress = computed(
    () => this.playerFacade.hasPlayers() && this.auctionFacade.soldLog().length > 0,
  );

  readonly progressLabel = computed(() => {
    const done = this.auctionFacade.soldLog().length;
    const total = this.playerFacade.players().length;
    return `${done}/${total} · ${this.auctionFacade.progressPercent()}%`;
  });

  toggleSidebar(): void {
    this.uiStore.toggleSidebar();
  }

  toggleFullscreen(): void {
    void this.fullscreenService.toggle();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleMute(): void {
    this.soundEffects.toggle();
  }
}
