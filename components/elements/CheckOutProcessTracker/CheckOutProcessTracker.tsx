import * as React from 'react';
import styles from './CheckOutProcessTracker.module.scss';

function checkoutPageNameReducer(state, action) {
  switch (action.type) {
    case 'address':
      return {
        address: true,
        shipping: false,
        payment: false,
        confirmation: false,
      };
    case 'shipping':
      return {
        address: true,
        shipping: true,
        payment: false,
        confirmation: false,
      };
    case 'payment':
      return {
        address: true,
        shipping: true,
        payment: true,
        confirmation: false,
      };
    case 'confirmation':
      return {
        address: true,
        shipping: true,
        payment: true,
        confirmation: true,
      };
    default:
      throw new Error(`Incorrect type for checkoutPageName, ${action.type} `);
  }
}

export const CheckOutProcessTracker = ({ checkoutPageName }): JSX.Element => {
  const [checkoutStageState, checkoutStageStateDispatch] = React.useReducer(
    checkoutPageNameReducer,
    {
      address: false,
      shipping: false,
      payment: false,
      confirmation: false,
    }
  );
  const { address, shipping, payment, confirmation } = checkoutStageState;
  React.useState(() => {
    checkoutStageStateDispatch({ type: checkoutPageName });
  }, [checkoutPageName]);

  return (
    <div className={styles.checkoutProcessTracker}>
      <ul className={styles.timeline}>
        <li
          className={`${styles.point} ${
            address ? styles.active : styles.inactive
          }`}
        >
          <span className={styles.text}>address</span>
        </li>
        <li
          className={`${styles.point} ${
            shipping ? styles.active : styles.inactive
          }`}
        >
          <span className={styles.text}>shipping</span>
        </li>
        <li
          className={`${styles.point} ${
            payment ? styles.active : styles.inactive
          }`}
        >
          <span className={styles.text}>payment</span>
        </li>
        <li
          className={`${styles.point} ${
            confirmation ? styles.active : styles.inactive
          }`}
        >
          <span className={styles.text}>confirmation</span>
        </li>
      </ul>
    </div>
  );
};
