import styles from './CheckOutProcessTracker.module.scss';
export const CheckOutProcessTracker = (): JSX.Element => {
  return (
    <div className={styles.checkoutProcessTracker}>
      <ul className={styles.timeline}>
        <li className={styles.point}>
          <span className={styles.text}>address</span>
        </li>
        <li className={styles.point}>
          <span className={styles.text}>shipping</span>
        </li>
        <li className={styles.point}>
          <span className={styles.text}>payment</span>
        </li>
        <li className={styles.point}>
          <span className={styles.text}>confirmation</span>
        </li>
      </ul>
    </div>
  );
};
