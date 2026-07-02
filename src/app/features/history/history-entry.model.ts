export interface HistoryEntry {
  id: string;
  playerName: string;
  teamName: string | null;
  teamColorHex: string | null;
  price: number | null;
  wasUnsold: boolean;
  timestamp: number;
}
