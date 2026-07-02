import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuctionFacade } from '../../../../core/facades/auction.facade';
import { PlayerFacade } from '../../../../core/facades/player.facade';
import { TeamFacade } from '../../../../core/facades/team.facade';
import { PlayerGender } from '../../../../core/models/enums/player-gender.enum';
import { StatisticsService } from '../../../../core/services/statistics/statistics.service';
import { GlassPanelDirective } from '../../../../shared/directives/glass-panel.directive';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { SpendChart } from '../../components/spend-chart/spend-chart';
import { GenderSplitChart } from '../../components/gender-split-chart/gender-split-chart';
import { RoleDistributionChart } from '../../components/role-distribution-chart/role-distribution-chart';
import { TopBuysWidget } from '../../components/top-buys-widget/top-buys-widget';

@Component({
  selector: 'app-statistics-dashboard-page',
  imports: [GlassPanelDirective, StatCard, SpendChart, GenderSplitChart, RoleDistributionChart, TopBuysWidget],
  templateUrl: './statistics-dashboard-page.html',
  styleUrl: './statistics-dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsDashboardPage {
  private readonly teamFacade = inject(TeamFacade);
  private readonly playerFacade = inject(PlayerFacade);
  private readonly statisticsService = inject(StatisticsService);
  readonly auctionFacade = inject(AuctionFacade);

  readonly teamSpend = computed(() => this.statisticsService.teamSpend(this.teamFacade.teams()));
  readonly genderSplit = computed(() =>
    this.statisticsService.genderSplit(this.playerFacade.soldPlayers()),
  );
  readonly roleDistribution = computed(() =>
    this.statisticsService.roleDistribution(this.playerFacade.soldPlayers()),
  );
  readonly topBuys = computed(() =>
    this.statisticsService.topBuys(this.playerFacade.soldPlayers(), this.teamFacade.teams()),
  );

  readonly totalSold = computed(() => this.playerFacade.soldPlayers().length);
  readonly totalUnsold = computed(() => this.playerFacade.unsoldPlayers().length);
  readonly totalPool = computed(() => this.playerFacade.players().length);
  readonly highestBuy = computed(() => this.topBuys()[0]?.price ?? 0);

  readonly averagePrice = computed(() =>
    this.statisticsService.averagePrice(this.playerFacade.soldPlayers()),
  );
  readonly lowestBuy = computed(() =>
    this.statisticsService.lowestBuy(this.playerFacade.soldPlayers()),
  );
  readonly mostExpensiveTeam = computed(() =>
    this.statisticsService.mostExpensiveTeam(this.teamFacade.teams()),
  );
  readonly leastBudgetTeam = computed(() =>
    this.statisticsService.leastBudgetTeam(this.teamFacade.teams()),
  );
  readonly boysPurchased = computed(() =>
    this.statisticsService.genderPurchasedCount(this.playerFacade.soldPlayers(), PlayerGender.Boy),
  );
  readonly girlsPurchased = computed(() =>
    this.statisticsService.genderPurchasedCount(this.playerFacade.soldPlayers(), PlayerGender.Girl),
  );
}
