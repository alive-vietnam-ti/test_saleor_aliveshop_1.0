import * as React from 'react';
import { useRouter } from 'next/router';
import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { FooterBranding } from '@/components/elements/FooterBranding';
import styles from '@/styles/page-styles/AccountConfirm.module.scss';
import { client } from '@/utils/api-client';

const CheckEmailMessage = ({ emailValue }): JSX.Element => {
  console.log(emailValue);

  return (
    <div>
      Your account is not active yet.<br />
      Please verify your email <strong>{emailValue}</strong>.<br />
      If you don't have it in your inbox (check spam/junk box), you can sign up with.<br />
      If you don't verify your email address within xx days we'll have to automatically delete your account (and nobody wants that).
    </div>
  )
}

const ConfirmSuccessMessage = ({ emailValue }): JSX.Element => {
  return (
    <div>
      <h2 className={styles.heading}>Thank you for verifying your email address.</h2>
      <p>
        Your new Upclick account has been activated and you can now login to the Merchant Area. All your account details have been already sent to the email registered on file. Please login with your email ({emailValue}) and password to get started.
      </p>
    </div>
  )
}

const AccountConfirm = ({
  setFlashMessages,
  apiEndpoint
}): JSX.Element => {
  const router = useRouter();
  const [emailValue, setEmailValue] = React.useState<string | string[] | undefined>(undefined);
  const [tokenValue, setTokenValue] = React.useState<string | string[] | undefined>(undefined);
  const [isActivated, setActivated] = React.useState<boolean | undefined>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!router.isReady) return;
    if (router.query.email) {
      setEmailValue(router.query.email);
      if (router.query.token) setTokenValue(router.query.token);
    } else {
      setFlashMessages([
        'you can\'t verify your account without email',
      ]);
      if (typeof window !== 'undefined') router.push('/');
    }
  }, [router.isReady]);

  if (tokenValue) {
    const confirmAccountQuery = `mutation {
                    confirmAccount(
                      email: "${emailValue}"
                      token: "${tokenValue}"
                    ) {
                      accountErrors {
                        field
                        code
                      }
                      user {
                        email
                        isActive
                      }
                    }
                  }`;
    const clientCongfig = {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({
        query: confirmAccountQuery,
      }),
    };
    client(apiEndpoint, clientCongfig)
      .then((responseObj: any) => {
        if (responseObj.data.confirmAccount.accountErrors.length) {
          const accountErrors = responseObj.data.confirmAccount.accountErrors;
          const the_errorMessage = accountErrors.reduce(function (result: any, item: any) {
            return result + `${item.field} is ${item.code}`;
          }, '')
          setErrorMessage(the_errorMessage);
        }
        if (responseObj.data.confirmAccount.user.isActive) {
          setActivated(true)
        }

      })
      .catch((error: any) => {
      });
  }

  return (
    <>
      <Head />
      <main className={styles.main}>
        <div className={styles.container}>
          {
            errorMessage ||
            <div>
              {emailValue && !tokenValue && <CheckEmailMessage emailValue={emailValue} />}
              {isActivated && <ConfirmSuccessMessage emailValue={emailValue} />}
            </div>
          }
        </div>
      </main>
      <Footer>
        <FooterBranding />
      </Footer>
    </>
  )
}

export default AccountConfirm;