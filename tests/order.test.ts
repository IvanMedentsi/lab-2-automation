import { describe, expect, it } from 'vitest';
import { calcSubtotal } from '../src/order';
import { calcDiscountRate, calcShipping, calcOrderTotal } from '../src/order';
import type { Tier } from '../src/order';

describe('calcSubtotal', () => {
  it('calculates the sum of item prices multiplied by quantities', () => {
    expect(
      calcSubtotal([
        { sku: 'A1', price: 100, qty: 2 },
        { sku: 'B1', price: 50, qty: 3 },
      ]),
    ).toBe(350);
  });

  it('throws EMPTY_ORDER when the order is empty', () => {
    expect(() => calcSubtotal([])).toThrow('EMPTY_ORDER');
  });

  it('throws NEGATIVE_PRICE when an item has a negative price', () => {
    expect(() =>
      calcSubtotal([{ sku: 'A1', price: -10, qty: 1 }]),
    ).toThrow('NEGATIVE_PRICE');
  });

  it.each([0, -1, 1.5])(
    'throws INVALID_QTY when quantity is %s',
    (qty) => {
      expect(() =>
        calcSubtotal([{ sku: 'A1', price: 100, qty }]),
      ).toThrow('INVALID_QTY');
    },
  );
});


describe('calcDiscountRate', () => {
  it.each([
    ['basic', 1000, 0, 0],
    ['silver', 1000, 0, 0.05],
    ['gold', 1000, 0, 0.1],
    ['basic', 2000, 0, 0.05],
    ['gold', 2000, 0, 0.15],
  ] as [Tier, number, number, number][])(
    'calculates discount for tier %s and subtotal %s',
    (tier, subtotal, promoRate, expected) => {
      expect(calcDiscountRate(tier, subtotal, promoRate)).toBeCloseTo(expected, 10);
    },
  );

  it('does not exceed the maximum discount', () => {
    expect(calcDiscountRate('gold', 2000, 0.2)).toBe(0.25);
  });

  it('throws INVALID_PROMO for a negative promo rate', () => {
    expect(() => calcDiscountRate('basic', 1000, -0.01))
      .toThrow('INVALID_PROMO');
  });
});

describe('calcShipping', () => {
  it.each([
    [999, 60],
    [1000, 0],
    [1001, 0],
  ])('calculates shipping for amount %s', (amount, expected) => {
    expect(calcShipping(amount)).toBe(expected);
  });
});



describe('calcOrderTotal', () => {
  it('adds shipping when the discounted amount is below the free-shipping threshold', () => {
    expect(
      calcOrderTotal([{ sku: 'A1', price: 100, qty: 2 }], 'basic'),
    ).toBe(260);
  });

  it('applies free shipping when the discounted amount reaches the threshold', () => {
    expect(
      calcOrderTotal([{ sku: 'A1', price: 1000, qty: 1 }], 'basic'),
    ).toBe(1000);
  });

  it('adds shipping if a discount reduces the amount below the threshold', () => {
    expect(
      calcOrderTotal([{ sku: 'A1', price: 1050, qty: 1 }], 'gold'),
    ).toBe(1005);
  });

  it('throws EMPTY_ORDER for an empty order', () => {
    expect(() => calcOrderTotal([], 'basic')).toThrow('EMPTY_ORDER');
  });
});
