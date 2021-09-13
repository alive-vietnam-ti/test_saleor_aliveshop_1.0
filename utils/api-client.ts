function client(endpoint: string, customConfig = {}): any {
  const config = {
    method: 'GET',
    ...customConfig,
  };

  return window
    .fetch(`${endpoint}`, config)
    .then((response) => response.json());
}

function constructLines(lines) {
  let returnLinesString = '[';
  lines.forEach((item) => {
    const itemString = `{quantity: ${item.quantity}, variantId: "${item.variantId}"},`;
    returnLinesString += itemString;
  });
  returnLinesString += ']';
  return returnLinesString;
}
//
// Checkout Api Call Functions
//

function checkoutCreate(url: string, preCheckoutValues: any): any {
  const lines = constructLines(preCheckoutValues.lines);
  const checkoutCreateMutation = `
  mutation {
    checkoutCreate(
      input: {
        email: "${preCheckoutValues.email}"
        lines: ${lines}
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
      query: checkoutCreateMutation,
    }),
  }; // clientConfig

  return window.fetch(url, clientConfig).then(async (response) => {
    const { data, errors } = await response.json();
    if (response.ok) {
      const responseObject = {
        data: null,
        errors: null,
      };
      const checkout = data?.checkoutCreate?.checkout;
      if (checkout) {
        responseObject.data = checkout;
        return responseObject;
      } else {
        const apiErrors = data?.checkoutCreate?.checkoutErrors;
        responseObject.errors = apiErrors;
        // calling function must check for field errors
        return responseObject;
      }
    } else {
      const error = new Error(
        `\nStatus Code: ${response.status}\nError Details: ` +
          errors?.map((e) => e.message).join('\n') ?? 'unknown'
      );
      return Promise.reject(error);
    }
  });
}

function apiCheckoutShippingMethodUpdate(
  url: string,
  checkoutId: string,
  shippingMethod: string
): any {
  const mutation = `
        mutation {
          checkoutShippingMethodUpdate(
            checkoutId: "${checkoutId}"
            shippingMethodId: "${shippingMethod}"
          ) {
            checkout {
              id
              shippingMethod {
                name
              }
              totalPrice {
                gross {
                  amount
                  currency
                }
              }
            }
            checkoutErrors {
              field
              message
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
      query: mutation,
    }),
  }; // clientConfig

  return window.fetch(url, clientConfig).then(async (response) => {
    const { data, errors } = await response.json();
    if (response.ok) {
      const responseObject = {
        data: null,
        errors: null,
      };
      const checkout = data?.checkoutShippingMethodUpdate?.checkout;
      if (checkout) {
        responseObject.data = checkout;
        return responseObject;
      } else {
        const apiErrors = data?.checkoutShippingMethodUpdate?.checkoutErrors;
        responseObject.errors = apiErrors;
        // calling function must check for field errors
        return responseObject;
      }
    } else {
      const error = new Error(
        `\nStatus Code: ${response.status}\nError Details: ` +
          errors?.map((e: any) => e.message).join('\n') ?? 'unknown'
      );
      return Promise.reject(error);
    }
  });
}

function fetchProductFromSlug(url: string, slug: string): any {
  const productDetailQuery = `query {
          product(slug: "${slug}") {
              id
              slug
              name
              seoDescription
              thumbnail {
                  url
                  alt
              }
              images {
                  url
                  alt
              }
              pricing {
                  priceRange {
                      start {
                          gross {
                              amount
                              currency
                          }
                      }
                  }
              }
              variants {
                  id
                  name
                  sku
                  images {
                    url
                    alt
                  }
                  attributes {
                      values {
                          slug
                          name
                          id
                      }
                      attribute {
                          name
                          id
                          inputType
                      }
                  }
                  pricing {
                      price {
                          gross {
                              amount
                          }
                          currency
                      }
                  }
              }
          }
      }`;
  const clientCongfig = {
    method: 'POST',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      query: productDetailQuery,
    }),
  }; // clientCongig

  return window.fetch(url, clientCongfig).then(async (response) => {
    const { data, errors } = await response.json();
    if (response.ok) {
      const product = data?.product;
      if (product) {
        return product;
      } else {
        return Promise.reject(new Error(`No product at ${slug}`));
      }
    } else {
      const graphQLErrors = new Error(
        `\nStatus Code: ${response.status}\nError Details: ` +
          errors?.map((e: any) => e.message).join('\n') ?? 'unknown'
      );
      return Promise.reject(graphQLErrors);
    }
  });
} // fetchProductFromString

export {
  client,
  fetchProductFromSlug,
  checkoutCreate,
  apiCheckoutShippingMethodUpdate,
};
