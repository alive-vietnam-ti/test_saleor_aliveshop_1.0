import * as React from 'react';
import styles from './ShoppingBag.module.scss';
import { ICartItem } from '@/components/modules/Cart';

interface IShoppingBagProps {
  shoppingCart: ICartItem[];
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShoppingBag: React.FC<IShoppingBagProps> = ({
  setCartVisible,
  shoppingCart,
}): JSX.Element => {
  /* This needs to change to array.reduce(....)*/
  const [numberItems, setNumberItems] = React.useState(0);
  const getNumItemsInCart = (cart: any) => {
    return cart.reduce(
      (acc: number, currVal: any) => acc + currVal.quantity,
      0
    );
  };

  React.useEffect(() => {
    setNumberItems(getNumItemsInCart(shoppingCart));
  }, [shoppingCart]);

  return (
    <div className={styles.bagDiv} onClick={() => setCartVisible(true)}>
      {numberItems > 0 ? (
        <p className={styles.bagNumItems}>{numberItems}</p>
      ) : null}
      <svg
        className={styles.bagSvg}
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Cart"
        role="img"
        focusable="false"
      >
        <path d="M18.163 5.188h-2.906C15.165 2.312 12.846 0 10 0 7.155 0 4.835 2.312 4.743 5.188H1.837A1.35 1.35 0 00.5 6.549v8.46C.5 17.76 2.699 20 5.4 20h9.197c2.703 0 4.902-2.24 4.902-4.992V6.55c0-.75-.6-1.361-1.337-1.361zM10 .908c2.353 0 4.265 1.906 4.357 4.28H5.643C5.736 2.814 7.647.908 10 .908zm8.609 14.1c0 2.252-1.8 4.084-4.01 4.084H5.4c-2.211 0-4.01-1.832-4.01-4.084V6.55c0-.25.2-.454.446-.454h16.326a.45.45 0 01.446.454v8.46z"></path>
      </svg>
    </div>
  );
};
