export interface Team {
  id: string;
  name: string;
  shortCode: string;
  colorHex: string;
  logoUrl: string | null;
  totalPurse: number;
  spentPurse: number;
  maxBoys: number;
  maxGirls: number;
  playerIds: string[];
}

export type TeamDraft = Pick<Team, 'name' | 'shortCode' | 'colorHex' | 'logoUrl'>;
