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
import { relative } from 'path';

/* Select Component */
const Select = ({ attribute, handleSelectChange }) => {
  const [options, setOptions] = React.useState(attribute.attributeOptions);
  const [selected, setSelected] = React.useState({
    id: 'initial',
    name: '--select--',
    slug: '',
  });

  const handleChangeLocal = (event) => {
    const newValue = event.target.value;
    const selectedOptionArr = options.filter((option) => {
      return option.id === newValue;
    });
    setSelected(selectedOptionArr[0]);
  };
  return (
    <div
      key={attribute.attributeId}
      id={attribute.attributeId}
      style={{ margin: '20px 0' }}
    >
      <label htmlFor={attribute.attributeId} style={{ display: 'block' }}>
        {attribute.name}
      </label>
      <select
        id={attribute.attributeId}
        onChange={(e: any) => {
          handleChangeLocal(e);
          handleSelectChange(e, attribute.attributeId, attribute.name);
        }}
        value={selected.id}
      >
        {options.map((option: any) => {
          return (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}; // Select

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
  productId: 'string';
  variants: Array<IProductVariant>;
  handleSelectChange: (
    event: any,
    attributeId: string,
    attributeName: string
  ) => void;
}

const ProductVariantSelect: React.FC<
  React.PropsWithChildren<IProductVariantSelectProps>
> = ({ productId, variants, handleSelectChange }) => {
  const [attributesObj, setAttributesObj] = React.useState({});

  function getVariantAttributeOptions(productVariants: Array<IProductVariant>) {
    /* function to build dropdown list for each product with each variant 
    -returns object 'attributes' with each attribute types id as key 
    */
    const attributesObj = {};
    productVariants.forEach((variant) => {
      variant.attributes.forEach((attribute) => {
        const attributeId = attribute.attribute.id;
        if (Object.hasOwnProperty.call(attributesObj, attributeId)) {
          //attributeId as key exists
          const attributeValuesCopy = { ...attribute.values[0] };
          attributesObj[attributeId].attributeOptions.push(attributeValuesCopy);
        } else {
          //attributeId as key doesnot exist
          const attributeValuesCopy = { ...attribute.values[0] };
          attributesObj[attributeId] = {
            attributeId: attributeId,
            name: attribute.attribute.name,
            inputType: attribute.attribute.inputType,
            attributeOptions: [attributeValuesCopy],
          };
        }
      });
    });
    return attributesObj;
  }

  React.useEffect(() => {
    const attributesO = getVariantAttributeOptions(variants);
    setAttributesObj(attributesO);
  }, [productId]);

  const emptyAttributesOptionsCheck = (attrsOptionArr) => {
    const filteredArr = attrsOptionArr.filter((optionObj) => {
      return Object.keys(optionObj).length > 0;
    });
    return filteredArr.length > 0;
  };

  if (Object.values(attributesObj).length === null) {
    return <></>;
  } else {
    return Object.values(attributesObj).map((attribute: any) => {
      return emptyAttributesOptionsCheck(attribute.attributeOptions) ? (
        <Select attribute={attribute} handleSelectChange={handleSelectChange} />
      ) : null;
    }); //return
  }
}; // Select

/* Quantity Component */
interface IProductQuantity {
  handleQuantityChange: (event: any) => void;
}

const ProductQuantity: React.FC<
  React.PropsWithChildren<IProductVariantSelectProps>
> = ({ handleQuantityChange }) => {
  return (
    <div
      style={{
        position: 'relative',
        padding: '10px 15px',
        margin: '10px 0',
        border: '1px grey solid',
      }}
    >
      <label
        style={{
          position: 'absolute',
          background: 'white',
          top: '-10px',
          padding: '0 5px',
        }}
        htmlFor="productQuantity"
      >
        Quantity
      </label>
      <input
        id="productQuantity"
        onChange={handleQuantityChange}
        type="number"
        style={{ outline: 'none', border: 'medium transparent', width: '100%' }}
        defaultValue="1"
        min="1"
      />
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
      <img src={images[0].url} alt={images[0].alt} />
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
  const [customerSelected, setCustomerSelected] = React.useState({});

  const handleSelectChange = (e, attributeId, attributeName) => {
    const selectedValueId = e.target.value;
    const customerSelectedCpy = JSON.parse(JSON.stringify(customerSelected));
    if (!Object.hasOwnProperty.call(customerSelectedCpy, attributeId)) {
      customerSelectedCpy[attributeId] = {
        attributeTypeId: attributeId,
        attributeTypeName: attributeName,
        selectedValueId: selectedValueId,
      };
    } else {
      customerSelectedCpy[attributeId].selectedValueId = selectedValueId;
    }
    setCustomerSelected(customerSelectedCpy);
  };

  const handleQuantityChange = (event) => {
    console.log(event.target.value);
  };
  return (
    <>
      <div style={{ display: 'flex' }}>
        <ProductImage images={product.images} />
        <div>
          <h1>{product.name}</h1>
          <p>{product.seoDescription}</p>
          {product.variants.length > 1 ? (
            <ProductVariantSelect
              productId={product.id}
              variants={product.variants}
              handleSelectChange={handleSelectChange}
            />
          ) : null}
          <ProductQuantity handleQuantityChange={handleQuantityChange} />
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
