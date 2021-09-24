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

/* formTemplates  */
const shippingFormTemplate = {
  formTitle: 'Shipping Address',
  formId: 'shipping-address',
  fields: [
    {
      type: 'text',
      name: 'lastName',
      label: 'family name',
      submittedValue: '',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'firstName',
      label: 'given name',
      submittedValue: '',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'email',
      label: 'email',
      submittedValue: '',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'companyName',
      label: 'company name',
      submittedValue: '',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'phoneNumber',
      label: ' phone number',
      submittedValue: '',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'streetAddress1',
      label: 'street address 1',
      submittedValue: '',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'streetAddress2',
      label: 'street address 2',
      submittedValue: '',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'city',
      label: 'village, town or city',
      submittedValue: '',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'countryArea',
      label: 'county, prefecture, state or province',
      submittedValue: '',
      required: true,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'postalCode',
      label: 'postal code',
      submittedValue: '',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'select',
      name: 'country',
      label: 'country',
      submittedValue: '',
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
      submittedValue: '',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'firstName',
      label: 'given name',
      submittedValue: '',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'companyName',
      label: 'company name',
      submittedValue: '',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'phoneNumber',
      label: ' phone number',
      submittedValue: '',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'streetAddress1',
      label: 'street address 1',
      submittedValue: '',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'streetAddress2',
      label: 'street address 2',
      submittedValue: '',
      required: false,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'city',
      label: 'village, town or city',
      submittedValue: '',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'text',
      name: 'countryArea',
      label: 'county, prefecture, state or province',
      submittedValue: '',
      required: true,
      validators: flowValidation(noValidationValidator),
    },
    {
      type: 'text',
      name: 'postalCode',
      label: 'postal code',
      submittedValue: '',
      required: true,
      validators: flowValidation(requiredValidator),
    },
    {
      type: 'select',
      name: 'country',
      label: 'country',
      submittedValue: '',
      required: true,
      options: countries,
      validators: flowValidation(requiredValidator),
    },
  ],
};

export { shippingFormTemplate, billingFormTemplate };
