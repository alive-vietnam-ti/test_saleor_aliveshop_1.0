import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { FooterBranding } from '@/components/elements/FooterBranding';
import { Loading } from '@/components/elements/Loading';
import { ProductLoadErrorFallback } from '@/components/elements/ProductLoadErrorFallback';
import styles from '@/styles/page-styles/ProductDetail.module.scss';
import { client } from '@/utils/api-client';
import { getDefaultNormalizer } from '__test__/testUtils';

interface IPageProps {
  shoppingCart: Array<Record<string, unknown> | []>;
  cartVisible: boolean;
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (id: string) => void;
}

const useProductDetail = () => {
  const router = useRouter();
  /* security for this slug? */
  const [state, setState] = useState({
    status: 'idle',
    response: null,
    error: null,
  });

  useEffect(() => {
    if (router.isReady) {
      const { slug } = router.query;
      setState({ status: 'pending', response: null, error: null });
      const productDetailQuery = `
        query {
          product(slug: "${slug}") {
            id
            name
            seoDescription
            thumbnail{
              url,
              alt
            }
            images{
              url,
              alt
            }
            variants{
              id, 
              name
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
      const responsePromise = client(
        'http://127.0.0.1:8000/graphql/',
        clientCongfig
      );
      responsePromise
        .then((responseObj: any) => {
          setState({
            status: 'resolved',
            response: responseObj,
            error: null,
          });
        })
        .catch((error: any) => {
          setState({ status: 'rejected', response: null, error: error });
        });
    }
  }, [router.isReady]);
  return state;
};

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  render() {
    const { error } = this.state;
    if (error) {
      console.error('Error Boundary', this.state.error);
      return <ProductLoadErrorFallback />;
    }
    return this.props.children;
  }
}

interface IProductDetailProps {
  children: React.ReactNode;
}

const ProductDetail: React.FC<React.PropsWithChildren<IPageProps>> = ({
  handleAddToCart,
  ...pageProps
}): JSX.Element => {
  const state = useProductDetail();
  const { status, response, error } = state;
  if (status === 'idle' || status === 'pending') {
    return <Loading />;
  } else if (status === 'rejected') {
    return <ProductLoadErrorFallback error={error} />;
  } else if (status === 'resolved') {
    //@ts-ignore: Object is possibly 'null'
    const { data, errors } = response;
    if (errors) {
      return <ProductLoadErrorFallback error={errors} />;
    }
    if (data.product === null) {
      return <ProductLoadErrorFallback error={'product was null'} />;
    }
    const product = data.product;
    console.log(product);
    return (
      <>
        <h1>{product.name}</h1>
        <img src={product.images[0].url} />
        <p>{product.seoDescription}</p>
        <button onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
      </>
    );
  }
  return (
    <ProductLoadErrorFallback
      error={"End of ProductLoadErrorFallback component, shouldn't be here"}
    />
  );
};

const ProductDetailPage: React.FC<React.PropsWithChildren<IPageProps>> = (
  pageProps
): JSX.Element => {
  return (
    <>
      <Head />
      <main>
        <div className={`${styles.productDetailContainer} container`}>
          <ErrorBoundary>
            <ProductDetail {...pageProps} />
          </ErrorBoundary>
        </div>
      </main>
      <Footer>
        <FooterBranding />
      </Footer>
    </>
  );
};

export default ProductDetailPage;
