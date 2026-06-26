const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'] as const;

export function getWindDirection(degrees?: number | null): string {
  if (typeof degrees !== 'number' || !Number.isFinite(degrees)) {
    return 'N';
  }

  const normalizedDegrees = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalizedDegrees / 45) % windDirections.length;

  return windDirections[index] ?? 'N';
}
