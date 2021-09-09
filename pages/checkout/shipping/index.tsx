import * as React from 'react';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { CheckoutShippingForm } from '@/components/modules/CheckoutShippingForm';
import { FooterBranding } from '@/components/elements/FooterBranding';
import styles from '@/styles/page-styles/Shipping.module.scss';
import { CheckOutProcessTracker } from '@/components/elements/CheckOutProcessTracker';

interface IShippingPageProps {
  apiEndpoint: string;
  shoppingCart: Array<Record<string, unknown> | []>;
  cartVisible: boolean;
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (id: string) => void;
}

const ShippingPage: React.FC<React.PropsWithChildren<IShippingPageProps>> = ({
  checkoutProcess,
  ...pageProps
}): JSX.Element => {
  const checkoutPageName = 'shipping';
  console.log(
    'Shipping Page: checkoutProcess',
    checkoutProcess.checkoutCreateResult.availableShippingMethods
  );
  return (
    <>
      <Head />
      <main>
        <div className={`${styles.shippingContainer} container`}>
          <h1>Checkkout shipping page</h1>
          <CheckOutProcessTracker checkoutPageName={checkoutPageName} />
          <CheckoutShippingForm
            availableShippingMethods={
              checkoutProcess.checkoutCreateResult.availableShippingMethods
            }
          />
        </div>
      </main>
      <Footer>
        <FooterBranding />
      </Footer>
    </>
  );
};

export default ShippingPage;
