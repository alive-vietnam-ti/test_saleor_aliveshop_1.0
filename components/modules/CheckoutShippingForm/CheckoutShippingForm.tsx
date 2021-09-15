import * as React from 'react';
import styles from './CheckoutShippingForm.module.scss';
import { apiCheckoutShippingMethodUpdate } from '@/utils/api-client';

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
  apiEndpoint,
  checkoutId,
  appCheckoutUpdateShipping,
}): JSX.Element => {
  //state
  const [shippingMethods, setShippingMethods] =
    React.useState<{ name: string; id: string }[] | null>(null);
  const [formErrors, setFormErrors] = React.useState<string[]>([]);
  //refs
  const shippingMethodForm = React.useRef(null);

  const router = useRouter();

  const handleContinueToPayment = () => {
    const shippingMethodFormData = new FormData(shippingMethodForm.current);
    const shippingMethodFieldValues = Object.fromEntries(
      shippingMethodFormData.entries()
    );
    // Check user choose method
    // Perhaps put a formValid state here to disable the continue to payment button
    if (Object.keys(shippingMethodFieldValues).length === 0) {
      const formErrorsCpy = [...formErrors];
      formErrorsCpy.push('Please choose a shipping method');
      setFormErrors(formErrorsCpy);
    } else {
      setFormErrors([]);
    }
    // use the id for the shipping method to make api call
    let dataCallResult = apiCheckoutShippingMethodUpdate(
      apiEndpoint,
      checkoutId,
      shippingMethodFieldValues.shippingMethod
    );
    dataCallResult
      .then((data) => {
        if (data.errors) {
          //Need to handle field errors here and change the
          const formErrorsCpy = [...formErrors];
          formErrorsCpy.push('There seems to be problem, please try again!');
          console.error(data.errors);
          setFormErrors(formErrorsCpy);
        } else {
          setFormErrors([]);
          // set app level checkout object here
          appCheckoutUpdateShipping(data.data);
          setTimeout(() => {
            router.push('/checkout/payment');
          }, 0);
        }
      })
      .catch((error) => console.error(error));
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
        <div>
          <ul>
            {formErrors.length > 0 &&
              formErrors.map((err: string, i: number) => {
                return <li key={`${err.slice(0, 2)}-${i}`}>{err}</li>;
              })}
          </ul>
        </div>
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
