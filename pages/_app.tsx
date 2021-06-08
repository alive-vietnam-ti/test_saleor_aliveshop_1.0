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

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [loginOrRegister, setLoginOrRegister] = React.useState('login');

  return (
    <>
      <TopNav>
        <Logo />
        <SearchBar />
        <ShoppingBag />
        <Favorite />
        <UserIcon setShowLoginModal={setShowLoginModal} />
      </TopNav>
      <Component {...pageProps} />
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
