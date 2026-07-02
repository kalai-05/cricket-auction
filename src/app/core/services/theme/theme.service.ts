import { effect, Injectable } from '@angular/core';
import { AppTheme, UiStore } from '../../state/ui.store';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor(private readonly uiStore: UiStore) {
    effect(() => {
      document.body.classList.toggle('theme-projector', this.uiStore.theme() === 'projector');
    });
  }

  setTheme(theme: AppTheme): void {
    this.uiStore.setTheme(theme);
  }

  toggle(): void {
    this.uiStore.setTheme(this.uiStore.theme() === 'dark' ? 'projector' : 'dark');
  }
}
