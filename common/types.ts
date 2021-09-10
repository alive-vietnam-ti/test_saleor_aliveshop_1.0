import * as React from 'react';
// Flash Messages
export type TFlashMessages = string[];
export type TSetFlashMessages = React.Dispatch<
  React.SetStateAction<TFlashMessages>
>;

export interface IFlashMessagesProps {
  flashMessages: TFlashMessages;
  setFlashMessages: TSetFlashMessages;
}

// Checkout Process Types

export interface ICheckoutCreate {
  id: string;
  totalPrice: {
    gross: {
      amount: number;
      currency: string;
    };
  };
  isShippingRequired: boolean;
  availableShippingMethods: { id: string; name: string }[];
  availablePaymentGateways: {
    id: 'mirumee.payments.braintree';
    name: 'Braintree';
    config: { field: string; value: string }[];
  }[];
}
