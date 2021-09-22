import * as React from 'react';
import styles from './CheckoutAddressForm.module.scss';
import { countries } from '@/utils/countries';
import { useRouter } from 'next/router';
// REFACTOR -->  client and useAsync imports
import { useAsync } from '@/utils/custom-hooks';
import { client } from '@/utils/api/api-client';
import { Loading } from '@/components/elements/Loading';

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

const CheckoutAddressForm: React.FC = ({
  apiEndpoint,
  shoppingCart,
  appCheckoutCreate,
  serverFieldErrors,
  run,
  data,
  setSubmittedFormValues,
  submittedFormValues,
}): JSX.Element => {
  const [billingSameAsShipping, setBillingSameAsShipping] =
    React.useState(false);
  const [formErrors, setFormErrors] = React.useState({
    hasErrors: false,
    errorMsg: '',
  });

  const shippingForm = React.useRef(undefined);
  const billingForm = React.useRef(undefined);

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
    const submittedFormValuesCopy = JSON.parse(
      JSON.stringify(submittedFormValues)
    );
    submittedFormValuesCopy.shippingFormValues = shippingFieldValues;

    let billingFieldValues: any;
    if (billingSameAsShipping) {
      billingFieldValues = { ...shippingFieldValues };
      delete billingFieldValues['email'];
    } else {
      const billingFormData = new FormData(billingForm.current);
      billingFieldValues = Object.fromEntries(billingFormData.entries());
    }
    submittedFormValuesCopy.billingFormValues = billingFieldValues;
    setSubmittedFormValues(submittedFormValuesCopy);
    // set Wrapper state for field values here

    /* Notes 
    - Need to handle validation here as well as in Input 
    - Need to build checkout object and submiti it to the server
    - Checkout obect  state should be held in _app.tsx
    - Need to handle backend server errros
    - Need to store form values in global and LocalStorage so:
    1. user can use back buttons in proccees
    2. confirmation step works 
    */
    const lines = makeLinesArray(shoppingCart);

    const preCheckoutValues = {
      email: customerEmail,
      lines: lines,
      shippingAddress: shippingFieldValues,
      billingAddress: billingFieldValues,
    };
    console.log('chkAddressForm: preCheckoutValues', preCheckoutValues);

    // REFACTOR --> construct mutation here instead

    // construct Config for client
    function constructLines(lines) {
      let returnLinesString = '[';
      lines.forEach((item) => {
        const itemString = `{quantity: ${item.quantity}, variantId: "${item.variantId}"},`;
        returnLinesString += itemString;
      });
      returnLinesString += ']';
      return returnLinesString;
    }

    const linesString = constructLines(preCheckoutValues.lines);

    const gqlMutation = `
      mutation {
        checkoutCreate(
          input: {
            email: "${preCheckoutValues.email}"
            lines: ${linesString}
            shippingAddress: {
              firstName: "${preCheckoutValues.shippingAddress.firstName}"
              phone: "${preCheckoutValues.shippingAddress.phoneNumber}"
              lastName: "${preCheckoutValues.shippingAddress.lastName}"
              streetAddress1: "${preCheckoutValues.shippingAddress.streetAddress1}"
              streetAddress2: "${preCheckoutValues.shippingAddress.streetAddress2}"
              city: "${preCheckoutValues.shippingAddress.city}"
              countryArea: "${preCheckoutValues.shippingAddress.countryArea}"
              postalCode: "${preCheckoutValues.shippingAddress.postalCode}"
              country: ${preCheckoutValues.shippingAddress.country}
            }
            billingAddress: {
              firstName: "${preCheckoutValues.billingAddress.firstName}"
              lastName: "${preCheckoutValues.billingAddress.lastName}"
              streetAddress1: "${preCheckoutValues.billingAddress.streetAddress1}"
              streetAddress2: "${preCheckoutValues.billingAddress.streetAddress2}"
              city: "${preCheckoutValues.billingAddress.city}"
              countryArea: "${preCheckoutValues.billingAddress.countryArea}"
              postalCode: "${preCheckoutValues.billingAddress.postalCode}"
              country: ${preCheckoutValues.billingAddress.country}
            }
          }
        ) {
          checkout {
            id
            token
            totalPrice {
              gross {
                amount
                currency
              }
            }
            isShippingRequired
            availableShippingMethods {
              id
              name
            }
            availablePaymentGateways {
              id
              name
              config {
                field
                value
              }
            }
          }
          checkoutErrors {
            field
            code
          }
        }
      }
    `;

    const clientConfig = {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        query: gqlMutation,
      }),
    }; // clientConfig

    console.log('chkAddressForm: clientConfig', clientConfig);
    run(client(apiEndpoint, clientConfig));
  } // handleContinueToShipping

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

export const CheckoutAddressFormWrapper: React.FC = ({
  apiEndpoint,
  shoppingCart,
  appCheckoutCreate,
  checkoutProcess,
  appCheckoutShippingFormValueUpdate,
}): JSX.Element => {
  const { status, data, error, run } = useAsync();
  const [wasSubmittedSuccess, setWasSubmittedSuccess] = React.useState(false);
  const [submittedFormValues, setSubmittedFormValues] = React.useState({
    shippingFormValues: null,
    billingFormValues: null,
  });
  const router = useRouter();

  if (wasSubmittedSuccess) {
    console.log('In wasSubmitted');
    return <Loading />;
  }

  switch (status) {
    case 'idle':
      // Check for submitted on checkoutProcess (need shippingSubmitted: false, shippingAddressData: {})
      console.log('In idle');
      return (
        <CheckoutAddressForm
          apiEndpoint={apiEndpoint}
          shoppingCart={shoppingCart}
          appCheckoutCreate={appCheckoutCreate}
          setSubmittedFormValues={setSubmittedFormValues}
          submittedFormValues={submittedFormValues}
          data={data}
          run={run}
        />
      );
    case 'pending':
      console.log('In pending');
      return <Loading />;
    case 'rejected':
      console.log('In error');
      console.error(error);
      return <p>Errors</p>;
    case 'resolved':
      console.log('In resolved', data);
      if (data.data.checkoutCreate.checkoutErrors.length > 0) {
        console.log('In resolved > checkoutErrors.length', data);
        return (
          <CheckoutAddressForm
            apiEndpoint={apiEndpoint}
            shoppingCart={shoppingCart}
            appCheckoutCreate={appCheckoutCreate}
            data={data}
            run={run}
          />
        );
      } else {
        //call next page with timeout and router.push or replace
        // store data in global and probably local storage
        appCheckoutCreate(data.data.checkoutCreate.checkout);
        setWasSubmittedSuccess(true);
        appCheckoutShippingFormValueUpdate(submittedFormValues);
        console.log('In resolved > no checkoutErrors', data);
        setTimeout(() => {
          router.replace('/checkout/shipping');
        }, 10);
        return <Loading />;
      }
    default:
      return <p>Sorry, we are not sure what happened</p>;
  } // end switch
}; // CheckoutAddress Form Wrapper
