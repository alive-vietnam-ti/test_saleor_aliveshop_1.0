import * as React from 'react';
import styles from './CheckoutAddressForm.module.scss';
import { countries } from '@/utils/countries';
import { apiCheckoutCreate } from '@/utils/api/checkout';
import { useRouter } from 'next/router';

/* Validators and Validator flow builder */

const requiredValidator = (valErrsObj: { value: string; errors: string[] }) => {
  const valErrsObjCopy = JSON.parse(JSON.stringify(valErrsObj));
  if (!valErrsObjCopy.value) {
    const error = 'This field is required';
    valErrsObjCopy.errors.push(error);
  }

  return valErrsObjCopy;
};

const noValidationValidator = (valErrsObj: {
  value: string;
  errors: string[];
}) => {
  const valErrsObjCopy = JSON.parse(JSON.stringify(valErrsObj));
  return valErrsObjCopy;
};

const flow = (func1: any, func2: any) => (x: any) => func2(func1(x));
const flowValidation = (...args: any[]) => args.reduce(flow, (x: any) => x);

/* formTemplate Object */

const shippingFormTemplate = {
  formTitle: 'Shipping Address',
  formId: 'shipping-address',
  fields: [
    {
      type: 'text',
      name: 'lastName',
      label: 'family name',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'firstName',
      label: 'given name',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'email',
      label: 'email',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'companyName',
      label: 'company name',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'phoneNumber',
      label: ' phone number',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'streetAddress1',
      label: 'street address 1',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'streetAddress2',
      label: 'street address 2',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'city',
      label: 'village, town or city',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'countryArea',
      label: 'county, prefecture, state or province',
      required: true,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'postalCode',
      label: 'postal code',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'select',
      name: 'country',
      label: 'country',
      required: true,
      options: countries,
      validators: flowValidation(requiredValidator),
    },
  ],
};

const billingFormTemplate = {
  formTitle: 'Billing Address',
  formId: 'billing-address',
  fields: [
    {
      type: 'text',
      name: 'lastName',
      label: 'family name',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'firstName',
      label: 'given name',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'companyName',
      label: 'company name',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'phoneNumber',
      label: ' phone number',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'streetAddress1',
      label: 'street address 1',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'streetAddress2',
      label: 'street address 2',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'city',
      label: 'village, town or city',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'countryArea',
      label: 'county, prefecture, state or province',
      required: true,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'postalCode',
      label: 'postal code',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'select',
      name: 'country',
      label: 'country',
      required: true,
      options: countries,
      validators: flowValidation(requiredValidator),
    },
  ],
};

/* Input Component */
const Input = ({
  formId,
  type,
  name,
  label,
  wasSubmitted,
  required,
  options,
  validators,
}: {
  formId: string;
  type: string;
  name: string;
  label: string;
  wasSubmitted: boolean;
  required: boolean;
  options?: any;
  validators?: any;
}): JSX.Element => {
  const [value, setValue] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const { errors } = validators({ value: value, errors: [] });
  const displayErrorMessage = (wasSubmitted || touched) && errors.length > 0;

  React.useEffect(() => {
    console.log(`input use effect triggered for ${name}`);
  }, [errors]);

  switch (type) {
    case 'text':
      return (
        <div key={name} className={styles.formGroup}>
          <label className={styles.label} htmlFor={`${formId}-${name}`}>
            {label}
          </label>
          <input
            className={styles.input}
            id={`${formId}-${name}`}
            name={name}
            type="text"
            onChange={(event) => setValue(event.currentTarget.value)}
            onBlur={() => setTouched(true)}
            required={required}
          />
          {displayErrorMessage ? (
            <ul>
              {errors.map((error: string, index: number) => {
                return (
                  <li
                    key={error}
                    role="alert"
                    id={`${index}-${name}-error`}
                    className="error-message"
                  >
                    {error}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      );
    case 'select':
      return (
        <div key={name} className={styles.formGroup}>
          <label className={styles.label} htmlFor={`${formId}-${name}`}>
            {label}
          </label>
          <select
            className={styles.input}
            id={`${formId}-${name}`}
            name={name}
            onChange={(event) => setValue(event.currentTarget.value)}
            onBlur={() => setTouched(true)}
            required={required}
          >
            {options.map((option: any) => {
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
          {displayErrorMessage ? (
            <ul>
              {errors.map((error: string, index: number) => {
                return (
                  <li
                    key={error}
                    role="alert"
                    id={`${index}-${name}-error`}
                    className="error-message"
                  >
                    {error}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      );
    default:
      throw new Error('invalid type provided to Input component');
  }
};

export const CheckoutAddressForm: React.FC = ({
  apiEndpoint,
  shoppingCart,
  appCheckoutCreate,
}): JSX.Element => {
  const [wasSubmitted, setWasSubmitted] = React.useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] =
    React.useState(false);
  const [formErrors, setFormErrors] = React.useState({
    hasErrors: false,
    errorMsg: '',
  });
  const shippingForm = React.useRef(null);
  const billingForm = React.useRef(null);
  const router = useRouter();

  function makeLinesArray(shoppingCart) {
    const lines = [];
    shoppingCart.forEach((item) => {
      const itemObj = {};
      itemObj.quantity = item.quantity;
      itemObj.variantId = item.variantId;
      lines.push(itemObj);
    });
    return lines;
  }
  function mapBackFieldErrorsToLabels(errorsArray, template) {
    let errorMessage = 'Sorry your form has errors in the following fields. ';
    errorsArray.forEach((error, i) => {
      template.fields.forEach((field) => {
        if (error.field === field.name) {
          const msg = `${i + 1}. ${field.label}  `;
          errorMessage += msg;
        }
      });
    });
    errorMessage += '.Please check and resubmit.';
    return errorMessage;
  }

  function handleContinueToShipping(event: any) {
    const shippingFormData = new FormData(shippingForm.current);
    const shippingFieldValues = Object.fromEntries(shippingFormData.entries());
    const customerEmail = shippingFieldValues.email;
    delete shippingFieldValues['email'];

    let billingFieldValues: any;
    if (billingSameAsShipping) {
      billingFieldValues = { ...shippingFieldValues };
    } else {
      const billingFormData = new FormData(billingForm.current);
      billingFieldValues = Object.fromEntries(billingFormData.entries());
    }

    /* Notes 
    - Need to handle validation here as well as in Input 
    - Need to build checkout object and submiti it to the server
    - Checkout obect  state should be held in _app.tsx
    - Need to handle backend server errros
    */
    const lines = makeLinesArray(shoppingCart);

    const preCheckoutCreateValues = {
      email: customerEmail,
      lines: lines,
      shippingAddress: shippingFieldValues,
      billingAddress: billingFieldValues,
    };
    console.log('preCheckoutCreateValues', preCheckoutCreateValues);
    let dataCallResult = apiCheckoutCreate(
      apiEndpoint,
      preCheckoutCreateValues
    );
    dataCallResult
      .then((data) => {
        if (data.errors) {
          //Need to handle field errors here and change the
          const errorMessage = mapBackFieldErrorsToLabels(
            data.errors,
            shippingFormTemplate
          );
          setFormErrors({ hasErrors: true, errorMsg: errorMessage });
        } else {
          setFormErrors({ hasErrors: false, errorMsg: '' });
          // no field errors so update _app.tsx state with checkout info
          // move onto the next shipping page.
          appCheckoutCreate(data.data);
          setTimeout(() => {
            router.push('/checkout/shipping');
          }, 0);
        }
      })
      .catch((error) => console.error(error));
  }

  function handleSameAsShipping() {
    setBillingSameAsShipping(!billingSameAsShipping);
  }

  return (
    <div>
      {formErrors.hasErrors && <p>{formErrors.errorMsg}</p>}
      <h2>{shippingFormTemplate.formTitle}</h2>
      <form className={styles.form} noValidate ref={shippingForm}>
        {shippingFormTemplate.fields.map((field) => {
          return (
            <Input
              key={field.name}
              formId={shippingFormTemplate.formId}
              type={field.type}
              name={field.name}
              label={field.label}
              validators={field.validators}
              options={field.options}
            />
          );
        })}
      </form>
      <hr />
      <h2>{billingFormTemplate.formTitle}</h2>
      <div>
        <input
          onChange={handleSameAsShipping}
          type="checkbox"
          checked={billingSameAsShipping}
          id="billing-same-as-shipping"
        />
        <label htmlFor="billing-same-as-shipping">
          Billing Address Same as Shipping?
        </label>
      </div>
      <div>
        {billingSameAsShipping ? null : (
          <form className={styles.form} noValidate ref={billingForm}>
            {billingFormTemplate.fields.map((field) => {
              return (
                <Input
                  key={field.name}
                  formId={billingFormTemplate.formId}
                  type={field.type}
                  name={field.name}
                  label={field.label}
                  validators={field.validators}
                  options={field.options}
                />
              );
            })}
          </form>
        )}
      </div>
      <button onClick={handleContinueToShipping}>Continue to Shipping</button>
    </div>
  );
};
