import * as React from 'react';
import styles from './CartSideBar.module.scss';
import Link from 'next/link';

/* types */

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
/* Cart Side Bar Item Component */

/* CartSide Bar Component */
export const CartSideBar: React.FC<CartProps> = ({
  cartVisible,
  setCartVisible,
  shoppingCart,
}): JSX.Element => {
  const subtotal = 0;
  const total = 0;
  return (
    <>
      <div
        className={styles.cart}
        style={{ width: `${cartVisible ? '300px' : '0'}` }}
      >
        <header className={styles.header}>
          <h2 className={styles.cartSideTitle}>my cart</h2>
          <p className={styles.close} onClick={() => setCartVisible(false)}>
            X
          </p>
        </header>
        <section className={styles.itemsWrapper}>
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
        </section>
        <footer className={styles.footer}>
          <div className={styles.finalPriceDetails}>
            <p className={styles.finalSubtotalLabel}>subtotal</p>
            <p className={styles.finalSubtotal}>{subtotal}</p>
            <p className={styles.finalTotalLabel}>total</p>
            <p className={styles.finalTotal}>{total}</p>
          </div>
          <div className={styles.actionButtons}>
            <button
              onClick={() => setCartVisible(false)}
              className={styles.goToCartBtn}
            >
              <Link href="/cart">
                <a className={styles.goToCartBtnLink}>go to cart</a>
              </Link>
            </button>
            <button
              onClick={() => setCartVisible(false)}
              className={styles.checkOutBtn}
            >
              <Link href="/checkout/address">
                <a className={styles.checkOutBtnLink}>go to checkout</a>
              </Link>
            </button>
          </div>
        </footer>
      </div>

      <div
        className={styles.overlay}
        style={{ width: `${cartVisible ? '100%' : '0'}` }}
      ></div>
    </>
  );
};
