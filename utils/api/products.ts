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
} // fetchProductFromSlug

export { fetchProductFromSlug };
