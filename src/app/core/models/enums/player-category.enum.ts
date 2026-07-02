export enum PlayerCategory {
  Star = 'STAR',
  A = 'A',
  B = 'B',
  C = 'C',
}

export const PLAYER_CATEGORY_LABELS: Record<PlayerCategory, string> = {
  [PlayerCategory.Star]: 'Star',
  [PlayerCategory.A]: 'Category A',
  [PlayerCategory.B]: 'Category B',
  [PlayerCategory.C]: 'Category C',
};

export const PLAYER_CATEGORY_SHORT_LABELS: Record<PlayerCategory, string> = {
  [PlayerCategory.Star]: '★ Star',
  [PlayerCategory.A]: 'A',
  [PlayerCategory.B]: 'B',
  [PlayerCategory.C]: 'C',
};
