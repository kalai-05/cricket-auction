import { Injectable, OnDestroy } from '@angular/core';
import { UiStore } from '../../state/ui.store';

@Injectable({ providedIn: 'root' })
export class FullscreenService implements OnDestroy {
  private readonly onChange = () => {
    this.uiStore.setFullscreen(document.fullscreenElement !== null);
  };

  constructor(private readonly uiStore: UiStore) {
    document.addEventListener('fullscreenchange', this.onChange);
  }

  async toggle(): Promise<void> {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }

  async enter(): Promise<void> {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  }

  async exit(): Promise<void> {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('fullscreenchange', this.onChange);
  }
}
