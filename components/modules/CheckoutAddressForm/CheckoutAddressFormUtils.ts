const constructLines = (lines) => {
  let returnLinesString = '[';
  lines.forEach((item) => {
    const itemString = `{quantity: ${item.quantity}, variantId: "${item.variantId}"},`;
    returnLinesString += itemString;
  });
  returnLinesString += ']';
  return returnLinesString;
};

const makeCheckoutCreateMutation = (linesString, preCheckoutValues) => {
  return `
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
};

export { makeCheckoutCreateMutation, constructLines };
