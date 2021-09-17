import * as React from 'react';
import Link from 'next/link';
import { API_ENDPOINT } from '../settings/dev_settings';
import '../styles/global.scss';
import '@reach/dialog/styles.css';
import type { AppProps /*, AppContext */ } from 'next/app';
import { TopNav } from '@/components/modules/TopNav';
import { Logo } from '@/components/elements/Logo';
import { SearchBar } from '@/components/elements/SearchBar';
import { ShoppingBag } from '@/components/elements/ShoppingBag';
import { UserIcon } from '@/components/elements/UserIcon';
import { Favorite } from '@/components/elements/Favorite';
import { FlashMessages } from '@/components/elements/FlashMessages';
import { LoginModal } from '@/components/modules/LoginModal';
import { CartSideBar, ICartItem } from '@/components/modules/CartSideBar';
import { FavSideBar, IFavItem } from '@/components/modules/FavSideBar';
import { useBase64LocalStorage } from '@/utils/custom-hooks';
//types
import { ICheckoutCreate, ICheckoutShippingMethodUpdate } from '@/common/types';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const cartLocalStorageKey = 'alive-cart';
  const checkoutProcessKey = 'checkout';
  const [flashMessages, setFlashMessages] = React.useState<string[]>([]);
  const [loginOrRegister, setLoginOrRegister] = React.useState('login');
  const [cartVisible, setCartVisible] = React.useState(false);
  const [favVisible, setFavVisible] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [shoppingCart, setShoppingCart] = useBase64LocalStorage(
    cartLocalStorageKey,
    []
  );
  const [productsFav, setProductsFav] = useBase64LocalStorage(
    'productsFav',
    []
  );
  const [checkoutProcess, setCheckoutProcess] = useBase64LocalStorage(
    checkoutProcessKey,
    {
      checkoutId: '',
      checkoutToken: '',
      totalPrice: null,
      isShippingRequired: false,
      availableShippingMethods: null,
      shippingMethod: null,
      availablePaymentGateways: null,
      paymentMethod: null,
      payment: null, // to store successful result of checkoutPaymentCreate
      checkoutCreateResult: null,
      checkoutShippingMethodUpdateResult: null,
      checkoutPaymentCreateResult: null,
      checkoutCompleteResult: null,
    }
  );

  /*
   * Checkout process logic
   */

  const appCheckoutCreate = (checkout: ICheckoutCreate): void => {
    const checkoutProcessCopy = JSON.parse(JSON.stringify(checkoutProcess));
    checkoutProcessCopy.checkoutId = checkout.id;
    checkoutProcessCopy.checkoutToken = checkout.token;
    checkoutProcessCopy.totalPrice = checkout.totalPrice;
    checkoutProcessCopy.isShippingRequired = checkout.isShippingRequired;
    checkoutProcessCopy.availableShippingMethods =
      checkout.availableShippingMethods;
    checkoutProcessCopy.availablePaymentGateways =
      checkout.availablePaymentGateways;
    checkoutProcessCopy.checkoutCreateResult = checkout;
    setCheckoutProcess(checkoutProcessCopy);
  };

  const appCheckoutUpdatePayment = (paymentData) => {
    console.log(paymentData);
  };

  const appCheckoutUpdateShipping = (
    checkout: ICheckoutShippingMethodUpdate
  ): void => {
    console.log('appCheckoutUpdateShippingMethod --> checkout', checkout);
    const checkoutProcessCopy = JSON.parse(JSON.stringify(checkoutProcess));
    checkoutProcessCopy.totalPrice = checkout.totalPrice;
    checkoutProcessCopy.shippingMethod = checkout.shippingMethod;
    checkoutProcessCopy.checkoutShippingMethodUpdateResult = checkout;
    console.log(
      'appCheckoutUpdateShippingMethod --> updated checkoutProcess',
      checkoutProcessCopy
    );
    setCheckoutProcess(checkoutProcessCopy);
  };

  /*
   * Cart Logic
   */
  const incrementItemQuantity = (variantId: string) => {
    if (!variantId) {
      console.error('No variantId provided');
      return;
    }
    const shoppingCartCopy = JSON.parse(JSON.stringify(shoppingCart));
    const incrementedQuantityCart = shoppingCartCopy.map((item: any) => {
      if (item.variantId === variantId) {
        item.quantity += 1;
      }
      return item;
    });
    setShoppingCart(incrementedQuantityCart);
  };

  const decrementItemQuantity = (variantId: string) => {
    if (!variantId) {
      console.error('No variantId provided');
      return;
    }
    const shoppingCartCopy = JSON.parse(JSON.stringify(shoppingCart));
    const decrementedQuantityCart = shoppingCartCopy.map((item: any) => {
      if (item.variantId === variantId) {
        item.quantity -= 1;
      }
      return item;
    });
    setShoppingCart(decrementedQuantityCart);
  };

  const deleteFromCart = (variantId: string) => {
    if (!variantId) {
      console.error('No variantId provided');
      return;
    }
    const shoppingCartCopy = JSON.parse(JSON.stringify(shoppingCart));
    const deletedVariantCart = shoppingCartCopy.filter(
      (item: any) => item.variantId !== variantId
    );
    setShoppingCart(deletedVariantCart);
  };

  const addToCart = (cartItem: ICartItem): void => {
    if (!cartItem.variantId) {
      return;
    }
    // check if variant in cart and if so increase quantity by quantity
    if (shoppingCart.length > 0) {
      let itemExistsInCart = false;
      const shoppingCartCopy = JSON.parse(JSON.stringify(shoppingCart));
      shoppingCartCopy.forEach((itemInCart: any) => {
        if (itemInCart.variantId === cartItem.variantId) {
          itemExistsInCart = true;
          itemInCart.quantity += cartItem.quantity;
        }
      });
      if (itemExistsInCart) {
        setShoppingCart(shoppingCartCopy);
      } else {
        shoppingCartCopy.push(cartItem);
        setShoppingCart(shoppingCartCopy);
      }
    } else {
      const shoppingCartCopy = JSON.parse(JSON.stringify(shoppingCart));
      shoppingCartCopy.push(cartItem);
      setShoppingCart(shoppingCartCopy);
    }
    /*make sure that cart has updated before displaying sidebar */
    window.setTimeout(() => setCartVisible(true), 0);
  }; // addtoCart

  const toggleProductInFav = (favItem: IFavItem) => {
    const productsFavCopy: any[] = [...productsFav];

    if (productsFavCopy.length === 0) {
      productsFavCopy.push(favItem);
    } else {
      const index: any = productsFavCopy.find((e, index) => {
        return e.id === favItem.id;
      });
      if (productsFavCopy.indexOf(index) > -1)
        productsFavCopy.splice(productsFavCopy.indexOf(index), 1);
      else productsFavCopy.push(favItem);
    }
    return setProductsFav(productsFavCopy);
  };

  React.useEffect(() => {
    window.localStorage.setItem(
      checkoutProcessKey,
      window.btoa(JSON.stringify(checkoutProcess))
    );
  }, [checkoutProcess]);

  React.useEffect(() => {
    window.localStorage.setItem(
      cartLocalStorageKey,
      window.btoa(JSON.stringify(shoppingCart))
    );
  }, [shoppingCart]);

  React.useEffect(() => {
    window.localStorage.setItem(
      'productsFav',
      window.btoa(JSON.stringify(productsFav))
    );
  }, [productsFav]);

  pageProps = {
    apiEndpoint: API_ENDPOINT,
    setFlashMessages,
    flashMessages,
    addToCart,
    toggleProductInFav,
    productsFav,
    deleteFromCart,
    shoppingCart,
    cartVisible,
    setCartVisible,
    favVisible,
    setFavVisible,
    appCheckoutCreate,
    appCheckoutUpdateShipping,
    appCheckoutUpdatePayment,
    checkoutProcess,
    ...pageProps,
  };

  return (
    <>
      <TopNav>
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
        <SearchBar />
        <ShoppingBag
          setCartVisible={setCartVisible}
          shoppingCart={shoppingCart}
        />
        <Favorite setFavVisible={setFavVisible} productsFav={productsFav} />
        <UserIcon setShowLoginModal={setShowLoginModal} />
      </TopNav>
      <FlashMessages
        flashMessages={flashMessages}
        setFlashMessages={setFlashMessages}
      />
      <Component {...pageProps} />
      <CartSideBar
        cartVisible={cartVisible}
        setCartVisible={setCartVisible}
        shoppingCart={shoppingCart}
        deleteFromCart={deleteFromCart}
        incrementItemQuantity={incrementItemQuantity}
        decrementItemQuantity={decrementItemQuantity}
      />
      <FavSideBar
        favVisible={favVisible}
        setFavVisible={setFavVisible}
        productsFav={productsFav}
      />
      <LoginModal
        apiEndpoint={API_ENDPOINT}
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        loginOrRegister={loginOrRegister}
        setLoginOrRegister={setLoginOrRegister}
      />
    </>
  );
}

export default MyApp;
