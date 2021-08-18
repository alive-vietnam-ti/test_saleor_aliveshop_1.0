import React from 'react';
import { render, fireEvent } from '../../utils/testUtils';
import { ShoppingBag } from '../elements/ShoppingBag';

describe('ShoppingBag', () => {
  test('Number of items in cart is rendered correctly', async () => {
    const mockShopCart = [{ quantity: 2 }];
    const { container } = render(<ShoppingBag shoppingCart={mockShopCart} />);
    const bagItemsCount = container.querySelector('p')?.innerHTML;
    expect(bagItemsCount).toBe('2');
  });
  test('Clicking care will setCartVisible to true', async () => {
    const mockShopCart = [{ quantity: 2 }];
    const setCartVisibleMock = jest.fn();
    const { container } = render(
      <ShoppingBag
        shoppingCart={mockShopCart}
        setCartVisible={setCartVisibleMock}
      />
    );
    const bag = container.querySelector('div');
    fireEvent.click(bag);
    expect(setCartVisibleMock.mock.calls.length).toBe(1);
    expect(setCartVisibleMock.mock.calls[0][0]).toBe(true);
  });
});
