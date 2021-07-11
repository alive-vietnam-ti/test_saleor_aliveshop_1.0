import * as React from 'react';
import styles from './Cart.module.scss';
import * as sjcl from 'sjcl';

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
  const check = true;
  React.useEffect(() => {
    const string = JSON.stringify(shoppingCart);
    const encrypted = window.btoa(string);
    const size = encrypted.length * (3 / 4);
    console.log('Encrypted shoppingCart in CART', encrypted, 'size', size);
    const unencrypted = window.atob(encrypted);
    console.log('Unencrypted JSON string', unencrypted);
    console.log('Unencrypted data', JSON.parse(unencrypted));
  }, [shoppingCart]);
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
        {shoppingCart.length > 0 ? (
          <ul>
            {shoppingCart.map((item: any) => {
              return (
                <li key={item.productId}>
                  <p>{item.name}</p>
                  <img src={item.imageUrl} alt={item.imageAlt} />
                  <p>Quantity {item.quantity}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No Items in Cart</p>
        )}
      </div>
      <div
        className={styles.overlay}
        style={{ width: `${cartVisible ? '100%' : '0'}` }}
      ></div>
    </>
  );
};
