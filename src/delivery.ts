export type Region = 'local' | 'nearby' | 'regional' | 'remote';

const DELIVERY_DAYS: Record<Region, number> = {
  local: 1,
  nearby: 2,
  regional: 3,
  remote: 5,
};

export function estimateDelivery(
  region: Region,
  isExpress: boolean,
): number {
  if (!(region in DELIVERY_DAYS)) {
    throw new Error('INVALID_REGION');
  }

  const days = DELIVERY_DAYS[region];

  if (isExpress) {
    return Math.max(1, days - 1);
  }

  return days;
}
