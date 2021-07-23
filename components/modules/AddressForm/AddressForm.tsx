import * as React from 'react';
import Select from 'react-select';
import styles from './AddressForm.module.scss';
import { countries } from '@/utils/countries';

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
  formTitle: 'Shipping',
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
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'select',
      name: 'country',
      label: 'county, prefecture, state or province',
      required: true,
      options: countries,
      validators: flowValidation(requiredValidator),
    },
  ],
};

/* Input Component */
const Input = ({
  type,
  name,
  label,
  wasSubmitted,
  required,
  options,
  validators,
}: {
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
    console.log('input use effect triggered');
  }, [errors]);

  switch (type) {
    case 'text':
      return (
        <div key={name}>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
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
        <div key={name}>
          <label htmlFor={name}>{label}</label>
          <select
            id={name}
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

export const AddressForm: React.FC = (): JSX.Element => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());
    console.log(fieldValues);
  }
  const [wasSubmitted, setWasSubmitted] = React.useState(false);
  return (
    <div>
      <h2>{shippingFormTemplate.formTitle}</h2>
      <form noValidate onSubmit={handleSubmit}>
        {shippingFormTemplate.fields.map((field) => {
          return (
            <Input
              key={field.name}
              type={field.type}
              name={field.name}
              label={field.label}
              validators={field.validators}
              options={field.options}
            />
          );
        })}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
