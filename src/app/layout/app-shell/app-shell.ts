import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiStore } from '../../core/state/ui.store';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { SidebarNav } from '../sidebar-nav/sidebar-nav';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Header, SidebarNav, Footer],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShell {
  readonly uiStore = inject(UiStore);

  dismissToast(id: string): void {
    this.uiStore.dismissToast(id);
  }
}
