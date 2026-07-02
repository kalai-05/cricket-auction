import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiStore } from '../../core/state/ui.store';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/auction', label: 'Live Auction', icon: 'gavel' },
  { path: '/teams', label: 'Teams', icon: 'groups' },
  { path: '/players', label: 'Players', icon: 'person_search' },
  { path: '/history', label: 'History', icon: 'history' },
  { path: '/statistics', label: 'Statistics', icon: 'bar_chart' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
];

@Component({
  selector: 'app-sidebar-nav',
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-nav.html',
  styleUrl: './sidebar-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNav {
  readonly uiStore = inject(UiStore);
  readonly navItems = NAV_ITEMS;
}
