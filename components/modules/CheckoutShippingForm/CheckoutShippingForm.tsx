import * as React from 'react';
import styles from './CheckoutShippingForm.module.scss';

import { useRouter } from 'next/router';

const ShippingFormInput = ({ shippingMethodId, shippingMethodName }) => {
  return (
    <div key={shippingMethodId} className={styles.formGroup}>
      <label
        className={styles.label}
        htmlFor={`${shippingMethodName}-${shippingMethodId}`}
      >
        <input
          className={styles.input}
          type="radio"
          id={`${shippingMethodName}-${shippingMethodId}`}
          name="shippingMethod"
          value={shippingMethodId}
        ></input>
        <span className={styles.pseudoLabel}>{shippingMethodName}</span>
      </label>
    </div>
  );
};

export const CheckoutShippingForm: React.FC = ({
  availableShippingMethods,
}): JSX.Element => {
  const [shippingMethods, setShippingMethods] =
    React.useState<{ name: string; id: string }[] | null>(null);
  const shippingMethodForm = React.useRef(null);

  const handleContinueToPayment = () => {
    const shippingMethodFormData = new FormData(shippingMethodForm.current);
    const shippingMethodFieldValues = Object.fromEntries(
      shippingMethodFormData.entries()
    );
    console.log(
      'handleContineToPayment Form Values',
      shippingMethodFieldValues
    );
  };

  React.useEffect(() => {
    if (!availableShippingMethods) {
      return;
    }
    setShippingMethods(availableShippingMethods);
  }, [availableShippingMethods]);

  return (
    <div>
      <h2 className={styles.formHeading}>Shipping Method</h2>
      <form noValidate ref={shippingMethodForm} className={styles.form}>
        {shippingMethods &&
          shippingMethods.map((method) => {
            return (
              <ShippingFormInput
                key={method.id}
                shippingMethodId={method.id}
                shippingMethodName={method.name}
              />
            );
          })}
      </form>
      <button className={styles.submitButton} onClick={handleContinueToPayment}>
        Continue to Payment
      </button>
    </div>
  );
};
