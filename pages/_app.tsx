import * as React from 'react';
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
import { Cart } from '@/components/modules/Cart';


function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [loginOrRegister, setLoginOrRegister] = React.useState('login');
  const [cartVisible, setCartVisible] = React.useState(false);
  const [shoppingCart, setShoppingCart] = React.useState([]);

  pageProps = {
    shoppingCart,
    cartVisible,
    setCartVisible,
    ...pageProps
  }

  return (
    <>
      <TopNav>
        <Logo />
        <SearchBar />
        <ShoppingBag  setCartVisible={setCartVisible}/>
        <Favorite />
        <UserIcon setShowLoginModal={setShowLoginModal} />
      </TopNav>
      <Component {...pageProps} />
      <Cart cartVisible={cartVisible} setCartVisible={setCartVisible}/>
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
