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
import { Cart, ICartItem } from '@/components/modules/Cart';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  function parseShoppingCart(localStorageKey) {
    let cart = [];
    if (typeof window !== 'undefined') {
      if (window.localStorage.getItem(localStorageKey)) {
        cart = JSON.parse(
          window.atob(window.localStorage.getItem(localStorageKey))
        );
      }
    }
    return cart;
  }

  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [loginOrRegister, setLoginOrRegister] = React.useState('login');
  const [cartVisible, setCartVisible] = React.useState(false);
  const [shoppingCart, setShoppingCart] = React.useState<ICartItem[]>(() =>
    parseShoppingCart('alive-cart')
  );

  // Cart Logic
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
    setCartVisible(true);
  }; // addtoCart

  React.useEffect(() => {
    window.localStorage.setItem(
      'alive-cart',
      window.btoa(JSON.stringify(shoppingCart))
    );
  }, [shoppingCart]);

  pageProps = {
    apiEndpoint: API_ENDPOINT,
    addToCart,
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
      <Cart
        cartVisible={cartVisible}
        setCartVisible={setCartVisible}
        shoppingCart={shoppingCart}
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
