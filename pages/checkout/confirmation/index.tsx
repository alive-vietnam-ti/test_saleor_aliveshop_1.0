import * as React from 'react';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { FooterBranding } from '@/components/elements/FooterBranding';
import styles from '@/styles/page-styles/Confirmation.module.scss';
import { CheckOutProcessTracker } from '@/components/elements/CheckOutProcessTracker';

interface IConfirmationPageProps {
  apiEndpoint: string;
  shoppingCart: Array<Record<string, unknown> | []>;
  cartVisible: boolean;
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (id: string) => void;
}

const ConfirmationPage: React.FC<
  React.PropsWithChildren<IConfirmationPageProps>
> = (pageProps): JSX.Element => {
  const checkoutPageName = 'confirmation';
  return (
    <>
      <Head />
      <main>
        <div className={`${styles.confirmationContainer} container`}>
          <h1>Confirmation Payment Page</h1>
          <CheckOutProcessTracker checkoutPageName={checkoutPageName} />
        </div>
      </main>
      <Footer>
        <FooterBranding />
      </Footer>
    </>
  );
};

export default ConfirmationPage;
