import * as React from 'react';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { CheckoutAddressFormWrapper } from '@/components/modules/CheckoutAddressForm';
import { FooterBranding } from '@/components/elements/FooterBranding';
import { CheckOutProcessTracker } from '@/components/elements/CheckOutProcessTracker';
import styles from '@/styles/page-styles/Address.module.scss';
import { LoginRegistrationForm } from '@/components/modules/LoginRegistrationForm';

interface IAddressPageProps {
  apiEndpoint: string;
  shoppingCart: Array<Record<string, unknown> | []>;
  cartVisible: boolean;
  setCartVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (id: string) => void;
}

function customerStatusInit();

function customerStatusReducer(state, action) {
  switch (action.type) {
    case 'undecided':
      return { status: action.type, userEmail: '' };
    case 'anon':
      return { status: action.type, userEmail: '' };
    case 'loggedIn':
      return { status: action.type, userEmail: action.email.trim() };
    default:
      throw new Error(`Incorrect type for customer status, ${action.type} `);
  }
}

/* AnonOrLoggin */
const AnonOrLogin: React.FC<{ customerStatusDispatch: React.Dispatch<any> }> =
  ({ customerStatusDispatch }) => {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h2>Continue As Guest</h2>
          <button onClick={() => customerStatusDispatch({ type: 'anon' })}>
            continue as guest
          </button>
        </div>
        <div>
          <LoginRegistrationForm
            formTitle="Registered User"
            buttonText="Sign In"
          />
        </div>
      </div>
    );
  };

const AddressPage: React.FC<React.PropsWithChildren<IAddressPageProps>> = ({
  apiEndpoint,
  appCheckoutCreate,
  shoppingCart,
  appCheckoutShippingFormValueUpdate,
  loginStatus,
  checkoutProcess,
  ...pageProps
}): JSX.Element => {
  const checkoutPageName = 'address';
  const [customerStatus, customerStatusDispatch] = React.useReducer(
    customerStatusReducer,
    { status: 'undecided', userEmail: '' },
    (initialState: any) => {
      if (loginStatus.status === 'loggedIn') {
        return { status: loginStatus.status, email: loginStatus.email };
      }
      return initialState;
    }
  );
  const { status } = customerStatus;
  let addressPageContent: any;
  // check if checkoutProcess.shippingSubmitted is true and if true
  // render the form with submitted values mapped to a copy (lodash deep copy)
  // and input will have values mapped to
  if (checkoutProcess.shippingSubmitted && status === 'undecided') {
    addressPageContent = (
      <>
        <CheckOutProcessTracker checkoutPageName={checkoutPageName} />
        <CheckoutAddressFormWrapper
          apiEndpoint={apiEndpoint}
          shoppingCart={shoppingCart}
          appCheckoutCreate={appCheckoutCreate}
          appCheckoutShippingFormValueUpdate={
            appCheckoutShippingFormValueUpdate
          }
        />
      </>
    );
    /*
  /* NOTE --> Probably need and if else here to cheeck checkoutProcesss.shippingSubmitted && 'loggedIn'
  */
  } else {
    // new checkout process started
    switch (status) {
      case 'undecided':
        addressPageContent = (
          <AnonOrLogin customerStatusDispatch={customerStatusDispatch} />
        );
        break;
      case 'anon':
        addressPageContent = (
          <>
            <CheckOutProcessTracker checkoutPageName={checkoutPageName} />
            <CheckoutAddressFormWrapper
              apiEndpoint={apiEndpoint}
              shoppingCart={shoppingCart}
              appCheckoutCreate={appCheckoutCreate}
              appCheckoutShippingFormValueUpdate={
                appCheckoutShippingFormValueUpdate
              }
            />
          </>
        );
        break;
      case 'loggedIn':
        addressPageContent = (
          <>
            <CheckOutProcessTracker checkoutPageName={checkoutPageName} />
            <h1>Welcome Back Username here </h1>
            <p>Component for Logged in User Here</p>
          </>
        );
        break;

      default:
        addressPageContent = <p>Error</p>;
        break;
    } // switch
  } // else

  return (
    <>
      <Head />
      <main>
        <div className={`${styles.addressContainer} container`}>
          {addressPageContent}
        </div>
      </main>
      <Footer>
        <FooterBranding />
      </Footer>
    </>
  );
};

export default AddressPage;
