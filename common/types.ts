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
