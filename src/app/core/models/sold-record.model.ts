export interface SoldRecord {
  id: string;
  playerId: string;
  teamId: string | null;
  finalPrice: number | null;
  wasUnsold: boolean;
  timestamp: number;
}
