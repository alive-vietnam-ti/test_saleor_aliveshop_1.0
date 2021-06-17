import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { FooterBranding } from '@/components/elements/FooterBranding';
import styles from '@/styles/page-styles/ProductDetail.module.scss';
import { client } from '@/utils/api-client';

interface IProductDetailProps {
  shoppingCart: Array<Record<string, unknown> | []>;
  cartVisible: boolean;
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductDetail = (): JSX.Element => {
  const router = useRouter();
  const { slug } = router.query;
  /* security for this slug? */
  const [state, setState] = useState({
    status: 'idle',
    response: null,
    error: null,
  });
  const { status, response, error } = state;

  useEffect(() => {
    setState({ status: 'pending', response: null, error: null });
    const productDetailQuery = `
      query {
        product(slug: "${slug}") {
          id
          name
          seoDescription
          images{
            url
          }
        }
      }
    `;
    const clientCongfig = {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        query: productDetailQuery,
      }),
    };
    const response = client('http://127.0.0.1:8000/graphql/', clientCongfig);
    response
      .then((responseObj: any) => {
        setState({ status: 'resolved', response: responseObj, error: null });
      })
      .catch((error: any) => {
        setState({ status: 'rejected', response: null, error: error });
      });
  }, [slug]);

  if (status === 'idle' || status === 'pending') {
    return (
      <div>
        <p>Loading...</p>;
      </div>
    );
  } else if (status === 'rejected') {
    console.error(`There was an error`, error);
    return (
      <div>
        <p>No products available</p>;
      </div>
    );
  } else if (status === 'resolved') {
    const { data, errors } = response;
    if (data.product) {
      const product = data.product;
      return (
        <div>
          <h1>{product.name}</h1>
          <img src={product.images[0].url} />
        </div>
      );
    } else {
      console.error(`There was an error`, errors);
      return (
        <div>
          <p>Sorry there was a problem, No product available</p>
        </div>
      );
    }
  }
};

const ProductDetailPage: React.FC<IProductDetailProps> = ({
  shoppingCart,
  cartVisible,
  setCartVisible,
}): JSX.Element => {
  return (
    <>
      <Head />
      <main>
        <ProductDetail />
      </main>
      <Footer>
        <FooterBranding />
      </Footer>
    </>
  );
};

export default ProductDetailPage;
