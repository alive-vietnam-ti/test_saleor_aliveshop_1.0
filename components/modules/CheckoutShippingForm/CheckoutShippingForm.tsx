import * as React from 'react';
import styles from './CheckoutShippingForm.module.scss';
import { useRouter } from 'next/router';

const ShippingFormInput = ({ shippingMethodId, shippingMethodName }) => {
  return (
    <div key={shippingMethodId}>
      <input
        type="radio"
        id={`${shippingMethodName}-${shippingMethodId}`}
        name="shippingMethod"
        value={shippingMethodId}
      ></input>
      <label htmlFor={`${shippingMethodName}-${shippingMethodId}`}>
        {shippingMethodName}
      </label>
    </div>
  );
};

export const CheckoutShippingForm: React.FC = ({
  availableShippingMethods,
}): JSX.Element => {
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
  return (
    <div>
      <h2>Shipping Method</h2>
      <form noValidate ref={shippingMethodForm}>
        {availableShippingMethods.map((method) => {
          return (
            <ShippingFormInput
              key={method.id}
              shippingMethodId={method.id}
              shippingMethodName={method.name}
            />
          );
        })}
      </form>
      <button onClick={handleContinueToPayment}>Continue to Payment</button>
    </div>
  );
};
