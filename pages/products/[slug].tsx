import * as React from 'react';
import { useRouter } from 'next/router';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { FooterBranding } from '@/components/elements/FooterBranding';
import { Loading } from '@/components/elements/Loading';
import { ProductLoadErrorFallback } from '@/components/elements/ProductLoadErrorFallback';
import styles from '@/styles/page-styles/ProductDetail.module.scss';
import { fetchProductFromSlug } from '@/utils/api-client';
import { useAsync } from '@/utils/custom-hooks';
import { ICartItem } from '@/components/modules/Cart';
import image from 'next/image';
import { relative } from 'path';

/* Select Component */
const Select = ({ attribute, handleSelectChange }) => {
  const [options, setOptions] = React.useState(() => {
    /*lazy --> called only on first page render */
    const attrsOptionsCopy = JSON.parse(
      JSON.stringify(attribute.attributeOptions)
    );
    attrsOptionsCopy.unshift({
      id: 'initial',
      name: '--select--',
      slug: 'initial',
    });
    return attrsOptionsCopy;
  });
  const [selected, setSelected] = React.useState(options[0]);

  const handleChangeLocal = (event) => {
    const newValue = event.target.value;
    if (!newValue) {
      console.log('Error with variants set up');
      return;
    }
    const selectedOptionArr = options.filter((option) => {
      return option.id === newValue;
    });
    setSelected(selectedOptionArr[0]);
  };
  return (
    <div id={attribute.attributeId} style={{ margin: '20px 0' }}>
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
> = ({
  productId,
  variants,
  handleSelectChange,
  handleVariantAttributeSet,
}) => {
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
    console.log('In Product Variant Select', attributesO);
    handleVariantAttributeSet(attributesO);
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
        <Select
          attribute={attribute}
          handleSelectChange={handleSelectChange}
          key={attribute.attributeId}
        />
      ) : null;
    }); //return
  }
}; // Select

/* Quantity Component */
interface IProductQuantity {
  handleQuantityChange: (event: any) => void;
  quantityState: { defaultQuanity: number; quantity: number; errors: string[] };
}

const ProductQuantity: React.FC<
  React.PropsWithChildren<IProductVariantSelectProps>
> = ({ handleQuantityChange, quantityState }) => {
  return (
    <>
      {quantityState.errors.length > 0 ? (
        <ul>
          {quantityState.errors.map((error: string) => (
            <li style={{ color: 'red' }} key={error}>
              {error}
            </li>
          ))}
        </ul>
      ) : null}
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
          style={{
            outline: 'none',
            border: 'medium transparent',
            width: '100%',
          }}
          defaultValue={quantityState.defaultQuantity}
          min="1"
        />
      </div>
    </>
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
  addToCart: (id: string) => void;
}

const ProductDetail: React.FC<React.PropsWithChildren<IProductDetailProps>> = ({
  product,
  addToCart,
  ...pageProps
}): JSX.Element => {
  const defaultQuantity = 1;
  const [customerSelected, setCustomerSelected] = React.useState({});
  const [quantityState, setQuantityState] = React.useState(() => {
    return {
      defaultQuantity: defaultQuantity,
      quantity: defaultQuantity,
      errors: [],
    };
  });
  const [numAttributeOptionsOnPage, setNumAttributeOptionsOnPage] =
    React.useState(null);
  const [addCartDisabled, setAddCartDisabled] = React.useState(true);
  const productAttributesLength = product
    ? product.variants[0].attributes.length
    : 'no product';

  /* types for reduceVariantsToValueIds */
  interface IVariantIdAndValues {
    varId: string;
    attrValueIds: string[];
  }

  function reduceVariantAttributesToValueIds(
    variants: any
  ): IVariantIdAndValues[] {
    /* Reduce variants array to simply variant id and it's attribute values ids for easy filtering */
    const variantAttrsArray: IVariantIdAndValues[] = [];
    variants.forEach((variant: any) => {
      const variantIdAndValues: IVariantIdAndValues = {
        varId: variant.id,
        attrValueIds: [],
      };
      variant.attributes.forEach((attribute: any) => {
        // copy obj at values[0] or if empty will be empty object
        const valObjCopy = { ...attribute.values[0] };
        if (Object.hasOwnProperty.call(valObjCopy, 'id')) {
          variantIdAndValues.attrValueIds.push(valObjCopy.id);
        }
      });
      variantAttrsArray.push(variantIdAndValues);
    });
    return variantAttrsArray;
  } // reduceVariantAttributesToValueIds

  function createFiterObject(customerSelected: any) {
    const filter: { selectedValueIds: string[] } = { selectedValueIds: [] };
    for (const attributeTypeId in customerSelected) {
      filter.selectedValueIds.push(
        customerSelected[attributeTypeId].selectedValueId
      );
    }
    return filter;
  }

  function findVariantFromOptionsSelected(reducedVariantsArray, filterObj) {
    /* filter function to reduce reducedVatiantArray to just one variant based on the selected values */
    let filteredArr = reducedVariantsArray.map((variant: any) => {
      const copyObj = {
        varId: variant.varId,
        attrValueIds: [...variant.attrValueIds],
      };
      return copyObj;
    });

    filterObj.selectedValueIds.forEach((selectedValId: any) => {
      const filteredCopy = filteredArr.filter((varsObj: any) =>
        varsObj.attrValueIds.includes(selectedValId)
      );
      filteredArr = filteredCopy;
    });

    return filteredArr;
  } //findVariantFromOptionsSelected

  function getVariantFromVariantId(variants, variantId) {
    const filtered = variants.filter((variant: any) => {
      return variant.id === variantId;
    });
    if (filtered.length === 1) {
      return filtered[0];
    } else {
      throw Error('Zero or more than one variant in getVariantFromVariantIds');
    }
  }

  const handleSelectChange = (e, attributeId, attributeName) => {
    const selectedValueId = e.target.value;
    if (selectedValueId === 'initial' || !selectedValueId) {
      return;
    }
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
  }; // handleSelectChange

  const handleQuantityChange = (event) => {
    const quantity = Number(event.target.value);
    const quantityStateCopy = JSON.parse(JSON.stringify(quantityState));
    if (quantity < 1) {
      const msg = 'Quantity must be a number greater than 0';
      if (quantityStateCopy.errors.includes(msg)) {
        return;
      }
      quantityStateCopy.errors.push(msg);
      setQuantityState(quantityStateCopy);
      return;
    }
    quantityStateCopy.quantity = quantity;
    quantityStateCopy.errors = [];
    setQuantityState(quantityStateCopy);
  };

  const handleAddToCart = () => {
    /* check if only one variant */
    const cartItem = {
      name: '',
      slug: product.slug,
      productId: product.id,
      sku: '',
      imageUrl: '',
      imageAlt: '',
      quantity: 0,
      variantId: '',
      grossPrice: null,
      currency: '',
    };

    function createCartItem(cartItem, variant, product) {
      cartItem.name = variant.name ? variant.name : product.name;
      cartItem.sku = variant.sku;
      if (variant.images.length > 0) {
        cartItem.imageUrl = variant.images[0].url;
        cartItem.imageAlt = variant.images[0].alt
          ? variant.images[0].alt
          : cartItem.name;
      } else {
        cartItem.imageUrl = product.images[0].url;
        cartItem.imageAlt = product.images[0].alt
          ? product.images[0].alt
          : cartItem.name;
      }
      cartItem.variantId = variant.id;
      cartItem.quantity = quantityState.quantity;
      cartItem.grossPrice = variant.pricing.price.gross.amount;
      cartItem.currency = variant.pricing.price.currency;
      return cartItem;
    }

    if (product.variants.length === 1) {
      /* No attribute selected as only one variant */
      const variant = product.variants[0];
      createCartItem(cartItem, variant, product);
    } else {
      // implement the get vartiant from attribute values selected logic here
      /* Need to make sure that customer has selected all attributes before this --> disable button */
      const filter = createFiterObject(customerSelected);
      const reducedVariantsArray = reduceVariantAttributesToValueIds(
        product.variants
      );
      const filtered = findVariantFromOptionsSelected(
        reducedVariantsArray,
        filter
      );
      const variant = getVariantFromVariantId(
        product.variants,
        filtered[0].varId
      );
      createCartItem(cartItem, variant, product);
    }
    addToCart(cartItem);
  }; //handleAddToCart

  const handleVariantAttributesSet = (attributesObjFromVariantSelect) => {
    const attributeOptionsOnPage = [];
    for (const attributeId in attributesObjFromVariantSelect) {
      const attribute = attributesObjFromVariantSelect[attributeId];
      const attributeOptionsFiltered = attribute.attributeOptions.filter(
        (option) => {
          return Object.keys(option).length > 0;
        }
      ); //end filter
      if (attributeOptionsFiltered.length > 0) {
        attributeOptionsOnPage.push(true);
      }
    }
    return setNumAttributeOptionsOnPage(attributeOptionsOnPage.length);
  };
  React.useLayoutEffect(() => {
    if (product.variants.length === 1) {
      setAddCartDisabled(false);
    } else {
      if (numAttributeOptionsOnPage === null) {
        return;
      }
      if (Object.keys(customerSelected).length < numAttributeOptionsOnPage) {
        return;
      }
      setAddCartDisabled(false);
    }
  }, [numAttributeOptionsOnPage, customerSelected]);

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
              handleVariantAttributeSet={handleVariantAttributesSet}
            />
          ) : null}
          <ProductQuantity
            handleQuantityChange={handleQuantityChange}
            quantityState={quantityState}
          />
          <button onClick={() => handleAddToCart()} disabled={addCartDisabled}>
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
  addToCart: () => void;
}

const ProductDetailWrapper: React.FC<React.PropsWithChildren<IPageProps>> = ({
  error,
  data,
  status,
  apiEndpoint,
  ...pageProps
}): JSX.Element => {
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

const ProductDetailPage: React.FC<React.PropsWithChildren<IPageProps>> = ({
  apiEndpoint,
  ...pageProps
}): JSX.Element => {
  const router = useRouter();
  const [slugValue, setSlugValue] =
    React.useState<string | string[] | undefined>(undefined);
  const { status, data, error, run } = useAsync({
    status: slugValue ? 'pending' : 'idle',
  });

  React.useEffect(() => {
    if (!slugValue) {
      return;
    }
    return run(fetchProductFromSlug(apiEndpoint, slugValue));
  }, [slugValue]);

  React.useEffect(() => {
    if (!router.isReady) {
      return;
    }
    setSlugValue(router.query.slug);
  }, [router.isReady]);
  return (
    <>
      {status === 'resolved' ? <Head title={data.name} /> : <Head />}
      <main>
        <div className={`${styles.productDetailContainer} container`}>
          <ErrorBoundary>
            <ProductDetailWrapper
              error={error}
              status={status}
              data={data}
              {...pageProps}
            />
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
