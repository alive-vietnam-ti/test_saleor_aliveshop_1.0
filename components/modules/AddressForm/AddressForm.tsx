import * as React from 'react';
import styles from './AddressForm.module.scss';

const formTemplate = {
  formTitle: 'Shipping',
  fields: [
    {
      name: 'lastName',
      label: 'family name',
      required: true,
    },
    {
      name: 'firstName',
      label: 'given name',
      required: true,
    },
  ],
};

const Input = ({
  name,
  label,
  wasSubmitted,
  required,
}: {
  name: string;
  label: string;
  wasSubmitted: boolean;
  required: boolean;
}): JSX.Element => {
  const [value, setValue] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const errorMessage = 'to be implimented';
  const displayErrorMessage = (wasSubmitted || touched) && errorMessage;

  console.log(value);

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
    </div>
  );
};

export const AddressForm: React.FC = (): JSX.Element => {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(event.currentTarget);
  }
  return (
    <div>
      <h2>{formTemplate.formTitle}</h2>
      <form noValidate onSubmit={handleSubmit}>
        {formTemplate.fields.map((field) => {
          return (
            <Input
              key={field.name}
              name={field.name}
              label={field.label}
              required={field.required}
            />
          );
        })}
      </form>
    </div>
  );
};
