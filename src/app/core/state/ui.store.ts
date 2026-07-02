import { Injectable, signal } from '@angular/core';
import { generateId } from '../../shared/utils/id.util';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}

export type AppTheme = 'dark' | 'projector';

@Injectable({ providedIn: 'root' })
export class UiStore {
  readonly isFullscreen = signal(false);
  readonly theme = signal<AppTheme>('dark');
  readonly sidebarCollapsed = signal(false);
  readonly toasts = signal<ToastMessage[]>([]);

  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  setFullscreen(value: boolean): void {
    this.isFullscreen.set(value);
  }

  setTheme(theme: AppTheme): void {
    this.theme.set(theme);
  }

  showToast(text: string, type: ToastType = 'info'): void {
    const toast: ToastMessage = { id: generateId('toast'), text, type };
    this.toasts.update((toasts) => [...toasts, toast]);
    setTimeout(() => this.dismissToast(toast.id), 4000);
  }

  dismissToast(id: string): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
