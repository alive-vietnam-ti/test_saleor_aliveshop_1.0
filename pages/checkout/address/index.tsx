import * as React from 'react';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { AddressForm } from '@/components/modules/AddressForm';
import { FooterBranding } from '@/components/elements/FooterBranding';
import styles from '@/styles/page-styles/Address.module.scss';

interface IAddressPageProps {
  apiEndpoint: string;
  shoppingCart: Array<Record<string, unknown> | []>;
  cartVisible: boolean;
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (id: string) => void;
}

const AddressPage: React.FC<React.PropsWithChildren<IAddressPageProps>> = (
  pageProps
): JSX.Element => {
  return (
    <>
      <Head />
      <main>
        <div className={`${styles.addressContainer} container`}>
          <h1>Checkout address </h1>
          <AddressForm />
        </div>
      </main>
      <Footer>
        <FooterBranding />
      </Footer>
    </>
  );
};

export default AddressPage;
