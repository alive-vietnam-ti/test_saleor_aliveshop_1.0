import * as React from 'react';
import styles from './Cart.module.scss';

type CartProps = {
  cartVisible: boolean; 
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>
};
export const Cart: React.FC<CartProps> = ({ cartVisible, setCartVisible }): JSX.Element => {
  const check = true 
  return (
    <>
  <div className={styles.cart}  style={{width: `${cartVisible? "300px": "0"}`}}>
    <p className={styles.close} onClick={() => setCartVisible(false)}>X close</p> 
    <h2>My Cart</h2>
    <hr />
  </div>
  <div className={styles.overlay}  style={{width: `${cartVisible? "100%": "0"}`}}>
  </div>

  </>
  )
};
