import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlayerFacade } from '../../../../core/facades/player.facade';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { SearchBar } from '../../components/search-bar/search-bar';
import { FilterPanel } from '../../components/filter-panel/filter-panel';
import { PlayerCard } from '../../components/player-card/player-card';

@Component({
  selector: 'app-player-list-page',
  imports: [EmptyState, SearchBar, FilterPanel, PlayerCard],
  templateUrl: './player-list-page.html',
  styleUrl: './player-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerListPage {
  readonly playerFacade = inject(PlayerFacade);
}
