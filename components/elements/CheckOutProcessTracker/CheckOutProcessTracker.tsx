import * as React from 'react';
import styles from './CheckOutProcessTracker.module.scss';

type TCheckOutProcessTrackerProps = {
  checkoutPageName: 'address' | 'shipping' | 'payment' | 'confirmation';
};

export const CheckOutProcessTracker: React.FC<TCheckOutProcessTrackerProps> = ({
  checkoutPageName,
}: {
  checkoutPageName: string;
}): JSX.Element => {
  return (
    <div className={styles.checkoutProcessTracker}>
      <ul className={styles.timeline}>
        <li
          className={`${styles.point} ${
            checkoutPageName === 'address' ? styles.active : ''
          }`}
        >
          <span className={styles.text}>address</span>
        </li>
        <li
          className={`${styles.point} ${
            checkoutPageName === 'shipping' ? styles.active : ''
          }`}
        >
          <span className={styles.text}>shipping</span>
        </li>
        <li
          className={`${styles.point} ${
            checkoutPageName === 'payment' ? styles.active : ''
          }`}
        >
          <span className={styles.text}>payment</span>
        </li>
        <li
          className={`${styles.point} ${
            checkoutPageName === 'confirmation' ? styles.active : ''
          }`}
        >
          <span className={styles.text}>confirmation</span>
        </li>
      </ul>
    </div>
  );
};
