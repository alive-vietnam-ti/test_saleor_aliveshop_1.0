import * as React from 'react';
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
import { LoginModal } from '@/components/modules/LoginModal';
import { CartSideBar, ICartItem } from '@/components/modules/CartSideBar';
import { useBase64LocalStorage } from '@/utils/custom-hooks';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const cartLocalStorageKey = 'alive-cart';
  const [loginOrRegister, setLoginOrRegister] = React.useState('login');
  const [cartVisible, setCartVisible] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [shoppingCart, setShoppingCart] = useBase64LocalStorage(
    cartLocalStorageKey,
    []
  );

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

  React.useEffect(() => {
    window.localStorage.setItem(
      cartLocalStorageKey,
      window.btoa(JSON.stringify(shoppingCart))
    );
  }, [shoppingCart]);

  pageProps = {
    apiEndpoint: API_ENDPOINT,
    addToCart,
    deleteFromCart,
    shoppingCart,
    cartVisible,
    setCartVisible,
    ...pageProps,
  };

  return (
    <>
      <TopNav>
        <Logo />
        <SearchBar />
        <ShoppingBag
          setCartVisible={setCartVisible}
          shoppingCart={shoppingCart}
        />
        <Favorite />
        <UserIcon setShowLoginModal={setShowLoginModal} />
      </TopNav>
      <Component {...pageProps} />
      <CartSideBar
        cartVisible={cartVisible}
        setCartVisible={setCartVisible}
        shoppingCart={shoppingCart}
        deleteFromCart={deleteFromCart}
        incrementItemQuantity={incrementItemQuantity}
        decrementItemQuantity={decrementItemQuantity}
      />
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        loginOrRegister={loginOrRegister}
        setLoginOrRegister={setLoginOrRegister}
      />
    </>
  );
}

export default MyApp;
