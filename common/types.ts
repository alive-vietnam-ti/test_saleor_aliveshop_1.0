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
export interface ITotalPrice {
  gross: {
    amount: number;
    currency: string;
  };
}

export interface ICheckoutCreate {
  id: string;
  token: string;
  totalPrice: ITotalPrice;
  isShippingRequired: boolean;
  availableShippingMethods: { id: string; name: string }[];
  availablePaymentGateways: {
    id: string;
    name: string;
    config: { field: string; value: string }[];
  }[];
}

export interface ICheckoutShippingMethodUpdate {
  id: string;
  shippingMethod: { name: string };
  totalPrice: ITotalPrice;
}
