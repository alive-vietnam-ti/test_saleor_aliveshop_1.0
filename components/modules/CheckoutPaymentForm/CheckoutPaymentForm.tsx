import * as React from 'react';
import styles from './CheckoutPaymentForm.module.scss';
import { apiCheckoutPaymentCreate } from '@/utils/api/checkout';

import { useRouter } from 'next/router';

const PaymentFormInput = ({ paymentMethodId, paymentMethodName }) => {
  return (
    <div key={paymentMethodId} className={styles.formGroup}>
      <label
        className={styles.label}
        htmlFor={`${paymentMethodName}-${paymentMethodId}`}
      >
        <input
          className={styles.input}
          type="radio"
          id={`${paymentMethodName}-${paymentMethodId}`}
          name="paymentMethod"
          value={paymentMethodId}
        ></input>
        <span className={styles.pseudoLabel}>{paymentMethodName}</span>
      </label>
    </div>
  );
};

export const CheckoutPaymentForm: React.FC = ({
  availablePaymentMethods,
  apiEndpoint,
  checkoutId,
  appCheckoutUpdatePayment,
}): JSX.Element => {
  //state
  const [paymentMethods, setPaymentMethods] =
    React.useState<{ name: string; id: string }[] | null>(null);
  const [formErrors, setFormErrors] = React.useState<string[]>([]);
  //refs
  const paymentMethodForm = React.useRef(null);

  const router = useRouter();

  const handleContinueToConfirm = () => {
    const paymentMethodFormData = new FormData(paymentMethodForm.current);
    const paymentMethodFieldValues = Object.fromEntries(
      paymentMethodFormData.entries()
    );
    // Check user choose method
    // Perhaps put a formValid state here to disable the continue to payment button
    if (Object.keys(paymentMethodFieldValues).length === 0) {
      const formErrorsCpy = [...formErrors];
      formErrorsCpy.push('Please choose a payment method');
      setFormErrors(formErrorsCpy);
    } else {
      setFormErrors([]);
    }
    // use the id for the shipping method to make api call
    const dataCallResult = apiCheckoutPaymentCreate(
      apiEndpoint,
      checkoutId,
      paymentMethodFieldValues.shippingMethod
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
          appCheckoutUpdatePayment(data.data);
          setTimeout(() => {
            router.push('/checkout/confirm');
          }, 0);
        }
      })
      .catch((error) => console.error(error));
  };

  React.useEffect(() => {
    if (!availablePaymentMethods) {
      return;
    }
    setPaymentMethods(availablePaymentMethods);
  }, [availablePaymentMethods]);

  return (
    <div>
      <h2 className={styles.formHeading}>Shipping Method</h2>
      <form noValidate ref={paymentMethodForm} className={styles.form}>
        <div>
          <ul>
            {formErrors.length > 0 &&
              formErrors.map((err: string, i: number) => {
                return <li key={`${err.slice(0, 2)}-${i}`}>{err}</li>;
              })}
          </ul>
        </div>
        {paymentMethods &&
          paymentMethods.map((method) => {
            return (
              <PaymentFormInput
                key={method.id}
                paymentMethodId={method.id}
                paymentMethodName={method.name}
              />
            );
          })}
      </form>
      <button className={styles.submitButton} onClick={handleContinueToConfirm}>
        Continue to Confirm
      </button>
    </div>
  );
};
