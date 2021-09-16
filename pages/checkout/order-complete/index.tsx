import * as React from 'react';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { FooterBranding } from '@/components/elements/FooterBranding';
import styles from '@/styles/page-styles/OrderComplete.module.scss';
import { useRouter } from 'next/router';

const OrderCompletePage = ({ ...pageProps }): JSX.Element => {
  return (
    <>
      <Head />
      <main>
        <div>
          <h1>Order Complete</h1>
        </div>
      </main>
      <Footer>
        <FooterBranding />
      </Footer>
    </>
  );
};

export default OrderCompletePage;
