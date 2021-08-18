import React from 'react';
import { render } from '../../utils/testUtils';
import { ShoppingBag } from '../elements/ShoppingBag';

describe('ShoppingBag', () => {
  test('Number of items in cart is correct', async () => {
    const mockShop = [{ quantity: 2 }];
    const { container } = render(<ShoppingBag shoppingCart={mockShop} />);
    const bagItemsCount = container.querySelector('p')?.innerHTML;
    expect(bagItemsCount).toBe('2');
  });
});
