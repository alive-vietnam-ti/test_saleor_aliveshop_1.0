import '../styles/global.scss';
import type { AppProps /*, AppContext */ } from 'next/app';
import { TopNav } from '@/components/modules/TopNav';
import { Logo } from '@/components/elements/Logo';
import { SearchBar } from '@/components/elements/SearchBar';
import { ShoppingBag } from '@/components/elements/ShoppingBag';
import { Favorite } from '@/components/elements/Favorite';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <TopNav>
        <Logo />
        <SearchBar />
        <ShoppingBag />
        <Favorite />
      </TopNav>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
