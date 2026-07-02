export function formatCredits(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const hasFraction = rounded % 1 !== 0;
  return `${hasFraction ? rounded.toFixed(1) : rounded.toString()} Cr`;
}
