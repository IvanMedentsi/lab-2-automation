
import { describe, expect, it } from 'vitest';
import { estimateDelivery } from '../src/delivery';

describe('estimateDelivery', () => {
  it.each([
    ['local', false, 1],
    ['nearby', false, 2],
    ['regional', false, 3],
    ['remote', false, 5],
  ] as const)(
    'returns %i delivery days for region %s',
    (region, isExpress, expected) => {
      expect(estimateDelivery(region, isExpress)).toBe(expected);
    },
  );

  it.each([
    ['local', true, 1],
    ['nearby', true, 1],
    ['regional', true, 2],
    ['remote', true, 4],
  ] as const)(
    'returns the expected delivery time for region %s',
    (region, isExpress, expected) => {
      expect(estimateDelivery(region, isExpress)).toBe(expected);
    },
  );

  it('throws INVALID_REGION for an unknown region', () => {
    expect(() =>
      estimateDelivery('unknown' as 'local', false),
    ).toThrow('INVALID_REGION');
  });
});
