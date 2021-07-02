import * as React from 'react';
import { useRouter } from 'next/router';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { FooterBranding } from '@/components/elements/FooterBranding';
import { Loading } from '@/components/elements/Loading';
import { ProductLoadErrorFallback } from '@/components/elements/ProductLoadErrorFallback';
import styles from '@/styles/page-styles/ProductDetail.module.scss';
import { fetchProductFromSlug } from '@/utils/api-client';
import { ICartItem } from '@/components/modules/Cart';
import image from 'next/image';

/* Variant Select Component */
const variants = [
  {
    id: 'UHJvZHVjdFZhcmlhbnQ6MjU2',
    name: 'S',
    sku: '29716755',
    attributes: [
      {
        values: [],
        attribute: {
          name: 'Color',
          id: 'QXR0cmlidXRlOjE0',
          inputType: 'DROPDOWN',
        },
      },
      {
        values: [
          {
            slug: 's',
            name: 'S',
            id: 'QXR0cmlidXRlVmFsdWU6MzY=',
          },
        ],
        attribute: {
          name: 'Size',
          id: 'QXR0cmlidXRlOjEz',
          inputType: 'DROPDOWN',
        },
      },
    ],
    pricing: {
      price: {
        gross: {
          amount: 3.5,
        },
        currency: 'USD',
      },
    },
  },
];
interface IProductPrice {
  gross: { amount: number };
  currency: string;
}
interface IProductVariantAttributeValue {
  slug: string;
  name: string;
  id: string;
}

interface IProductVariantAttributeValue {
  name: string;
  id: string;
  inputType: string;
}

interface IProductVariantAttribute {
  values: Array<IProductVariantAttributeValue>;
  attribute: IProductVariantAttributeValue;
}

interface IProductVariant {
  id: string;
  name: string;
  sku: string;
  attributes: Array<IProductVariantAttribute>;
  pricing: { price: IProductPrice };
}

interface IProductVariantSelectProps {
  variants: Array<IProductVariant>;
}

const ProductVariantSelect: React.FC<
  React.PropsWithChildren<IProductVariantSelectProps>
> = ({ variants }): JSX.Element => {
  const initialSelectedValue = {
    value: '0',
    name: '--select--',
  };
  const [selected, setSelected] = React.useState({
    value: '0',
    name: '--select--',
  });
  const options = [
    { value: '1', name: 'S' },
    { value: '2', name: 'M' },
    { value: '3', name: 'L' },
  ];
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue > 0) {
      const filteredOption = options.filter(
        (option) => option.value === selectedValue
      );
      setSelected(filteredOption[0]);
    } else {
      setSelected(initialSelectedValue);
    }
  };
  console.log('rendered selected', selected);
  return (
    <div>
      <select id="fruit" onChange={handleChange} value={selected.value}>
        <option value="0">--select--</option>
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

/* Image Component */
interface IProductImageProps {
  images: Array<{ url: string; alt: string }>;
}

const ProductImage: React.FC<React.PropsWithChildren<IProductImageProps>> = ({
  images,
}): JSX.Element => {
  return (
    <div style={{ padding: '20px' }}>
      <img src={images[0].url} alt={images[0].alt} />;
    </div>
  );
};

/* Async Reducer */

function asyncReducer(state, action) {
  switch (action.type) {
    case 'pending': {
      return { status: 'pending', data: null, error: null };
    }
    case 'resolved': {
      return { status: 'resolved', data: action.data, error: null };
    }
    case 'rejected': {
      return { status: 'rejected', data: null, error: action.error };
    }
    default:
      throw new Error(`Unhandled action type ${action.type}`);
  }
}

function useAsync(initialState?: any) {
  const [state, unsafeDispatch] = React.useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
    ...initialState,
  });

  const mountedRef = React.useRef(false);
  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const dispatch = React.useCallback((...args) => {
    if (mountedRef.current) {
      unsafeDispatch(...args);
    }
  }, []);

  const run = React.useCallback(
    (promise) => {
      dispatch({ type: 'pending' });
      promise.then(
        (data: any) => {
          dispatch({ type: 'resolved', data });
        },
        (error: any) => {
          dispatch({ type: 'rejected', error });
        }
      );
    },
    [dispatch]
  ); //not really needed as the dispatch function is stable and won't change

  return { ...state, run };
} //useAsync

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  render() {
    const { error } = this.state;
    if (error) {
      console.error('Error Boundary', this.state.error);
      return <ProductLoadErrorFallback error={error} />;
    }
    return this.props.children;
  }
}
interface IProductDetailProps {
  product: any;
  shoppingCart: Array<Record<string, unknown> | []>;
  cartVisible: boolean;
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (id: string) => void;
}

const ProductDetail: React.FC<React.PropsWithChildren<IProductDetailProps>> = ({
  product,
  handleAddToCart,
  ...pageProps
}): JSX.Element => {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <ProductImage images={product.images} />
        <div>
          <h1>{product.name}</h1>
          <p>{product.seoDescription}</p>
          {product.variants.length > 0 ? (
            <ProductVariantSelect variants={product.variants} />
          ) : null}
          <button onClick={() => handleAddToCart(product.id)}>
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

/* ProductDetail Wrapper */

interface IPageProps {
  apiEndpoint: string;
  slugValue: string | string[] | undefined;
  shoppingCart: Array<Record<string, unknown> | []>;
  cartVisible: boolean;
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (id: string) => void;
}

const ProductDetailWrapper: React.FC<React.PropsWithChildren<IPageProps>> = ({
  slugValue,
  apiEndpoint,
  ...pageProps
}): JSX.Element => {
  const { status, data, error, run } = useAsync({
    status: slugValue ? 'pending' : 'idle',
  });

  React.useEffect(() => {
    if (!slugValue) {
      return;
    }
    return run(fetchProductFromSlug(apiEndpoint, slugValue));
  }, [slugValue]);

  if (status === 'idle') {
    return <p>No Product </p>;
  } else if (status === 'pending') {
    return <Loading />;
  } else if (status === 'rejected') {
    return <ProductLoadErrorFallback error={error} />;
    return <p>Product Detail Rejected</p>;
  } else if (status == 'resolved') {
    return <ProductDetail {...pageProps} product={data} />;
  } else {
    return <p>Sorry, we are not sure what happened</p>;
  }
};

/* Page */

const ProductDetailPage: React.FC<React.PropsWithChildren<IPageProps>> = (
  pageProps
): JSX.Element => {
  const router = useRouter();
  const [slugValue, setSlugValue] =
    React.useState<string | string[] | undefined>(undefined);
  React.useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setSlugValue(router.query.slug);
  }, [router.isReady]);
  return (
    <>
      <Head />
      <main>
        <div className={`${styles.productDetailContainer} container`}>
          <ErrorBoundary>
            <ProductDetailWrapper {...pageProps} slugValue={slugValue} />
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
