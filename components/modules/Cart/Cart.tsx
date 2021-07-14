import * as React from 'react';
import styles from './Cart.module.scss';

export interface ICartItem {
  id: string;
  variantId: string;
  sku: string;
  grossPrice: number;
  currency: string;
  quantity: number;
  thumbnailUrl: string;
  thumbnailAlt: string;
}

type CartProps = {
  cartVisible: boolean;
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
  shoppingCart: any;
};
export const Cart: React.FC<CartProps> = ({
  cartVisible,
  setCartVisible,
  shoppingCart,
}): JSX.Element => {
  return (
    <>
      <div
        className={styles.cart}
        style={{ width: `${cartVisible ? '300px' : '0'}` }}
      >
        <p className={styles.close} onClick={() => setCartVisible(false)}>
          X close
        </p>
        <h2>My Cart</h2>
        <hr />
        <ul>
          {shoppingCart.length > 0 ? (
            shoppingCart.map((item: any, index: number) => {
              return (
                <li key={index + item.productId}>
                  <p>{item.name}</p>
                  <img src={item.imageUrl} alt={item.imageAlt} />
                  <p>Quantity {item.quantity}</p>
                </li>
              );
            })
          ) : (
            <li>
              <p>No Items in Cart</p>
            </li>
          )}
        </ul>
      </div>
      <div
        className={styles.overlay}
        style={{ width: `${cartVisible ? '100%' : '0'}` }}
      ></div>
    </>
  );
};
