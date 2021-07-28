import * as React from 'react';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { FooterBranding } from '@/components/elements/FooterBranding';
import styles from '@/styles/page-styles/Payment.module.scss';
import { CheckOutProcessTracker } from '@/components/elements/CheckOutProcessTracker';

interface IPaymentPageProps {
  apiEndpoint: string;
  shoppingCart: Array<Record<string, unknown> | []>;
  cartVisible: boolean;
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (id: string) => void;
}

const PaymentPage: React.FC<React.PropsWithChildren<IPaymentPageProps>> = (
  pageProps
): JSX.Element => {
  const checkoutPageName = 'payment';
  return (
    <>
      <Head />
      <main>
        <div className={`${styles.paymentContainer} container`}>
          <h1>Checkout Payment Page</h1>
          <CheckOutProcessTracker checkoutPageName={checkoutPageName} />
        </div>
      </main>
      <Footer>
        <FooterBranding />
      </Footer>
    </>
  );
};

export default PaymentPage;
