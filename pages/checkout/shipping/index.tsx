import * as React from 'react';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { CheckoutShippingForm } from '@/components/modules/CheckoutShippingForm';
import { FooterBranding } from '@/components/elements/FooterBranding';
import styles from '@/styles/page-styles/Shipping.module.scss';
import { CheckOutProcessTracker } from '@/components/elements/CheckOutProcessTracker';
import { useRouter } from 'next/router';

interface IShippingPageProps {
  apiEndpoint: string;
  shoppingCart: Array<Record<string, unknown> | []>;
  cartVisible: boolean;
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (id: string) => void;
}

const ShippingPage: React.FC<React.PropsWithChildren<IShippingPageProps>> = ({
  checkoutProcess,
  shoppingCart,
  setFlashMessages,
  ...pageProps
}): JSX.Element => {
  const checkoutPageName = 'shipping';
  const router = useRouter();
  let fragment;
  React.useEffect(() => {
    if (
      shoppingCart.length === 0 ||
      !checkoutProcess?.checkoutCreateResult?.availableShippingMethods
    ) {
      fragment = <p>loading</p>;
      setFlashMessages([
        'you have nothing in your cart, please consider buying something first',
      ]);
      if (typeof window !== 'undefined') {
        router.push('/');
      }
    } else {
      fragment = (
        <CheckoutShippingForm
          availableShippingMethods={
            checkoutProcess.checkoutCreateResult.availableShippingMethods
          }
        />
      );
    }
  }, [checkoutProcess, shoppingCart]);
  return (
    <>
      <Head />
      <main>
        <div className={`${styles.shippingContainer} container`}>
          <h1>Checkkout shipping page</h1>
          <CheckOutProcessTracker checkoutPageName={checkoutPageName} />
          {fragment}
        </div>
      </main>
      <Footer>
        <FooterBranding />
      </Footer>
    </>
  );
};

export default ShippingPage;
