import { Routes } from '@angular/router';

export const STATISTICS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/statistics-dashboard-page/statistics-dashboard-page').then(
        (m) => m.StatisticsDashboardPage,
      ),
  },
];
