import * as React from 'react';
import styles from './CartSideBar.module.scss';
import Link from 'next/link';
import { DeleteCartItem } from '@/components/elements/DeleteCartItem';
import { useRouter } from 'next/router';

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
  deleteFromCart: (variantId: string) => void;
  incrementItemQuantity: (variantId: string) => void;
  decrementItemQuantity: (variantId: string) => void;
};

/* Cart Side Bar Item Component */
interface ICartSideBarItemProps {
  item: any;
  deleteFromCart: (variantId: string) => void;
  incrementItemQuantity: (variantId: string) => void;
  decrementItemQuantity: (variantId: string) => void;
}
const CartSideBarItem: React.FC<ICartSideBarItemProps> = ({
  item,
  deleteFromCart,
  incrementItemQuantity,
  decrementItemQuantity,
}): JSX.Element => {
  /* This code is to deal with a problem with server side rendering in Nextjs
  Possibly not required once in production but needed during dev to get 
  correct rendering of the list */
  const mounted = React.useRef(false);
  React.useEffect(() => {
    mounted.current = true;
  }, [item]);
  return (
    <>
      {mounted.current && (
        <li className={styles.itemWrapper}>
          <div className={styles.imgAndDelete}>
            <img src={item.imageUrl} alt={item.imageAlt} />
            <DeleteCartItem
              variantId={item.variantId}
              deleteFromCart={deleteFromCart}
            />
          </div>
          <div className={styles.details}>
            <p>{item.name}</p>
            <p>sku: {item.sku}</p>
            <div className={styles.alterQuantity}>
              <p className={styles.alterQuantityLabel}>Quantity</p>
              <button
                onClick={() => decrementItemQuantity(item.variantId)}
                className={styles.changeQuantityBtn}
              >
                -
              </button>
              <p>{item.quantity}</p>
              <button
                onClick={() => incrementItemQuantity(item.variantId)}
                className={styles.changeQuantityBtn}
              >
                +
              </button>
            </div>
          </div>
        </li>
      )}
    </>
  );
};

/* CartSide Bar Component */
export const CartSideBar: React.FC<CartProps> = ({
  cartVisible,
  setCartVisible,
  shoppingCart,
  deleteFromCart,
  incrementItemQuantity,
  decrementItemQuantity,
}): JSX.Element => {
  const subtotal = 0;
  const total = 0;
  const router = useRouter();

  const handleClick = (url: string): void => {
    setCartVisible(false);
    router.push(url);
  };

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
                  <CartSideBarItem
                    key={index + item.productId}
                    item={item}
                    deleteFromCart={deleteFromCart}
                    incrementItemQuantity={incrementItemQuantity}
                    decrementItemQuantity={decrementItemQuantity}
                  />
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
              onClick={() => handleClick('/cart')}
              className={styles.goToCartBtn}
            >
              go to cart
            </button>
            <button
              onClick={() => handleClick('/checkout/address')}
              className={styles.checkOutBtn}
            >
              go to checkout
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
