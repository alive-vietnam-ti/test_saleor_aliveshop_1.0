import styles from './LoginModal.module.scss';
import { Dialog } from '@reach/dialog';
import {
  LoginRegistrationForm,
  IOnSubmit,
} from '@/components/modules/LoginRegistrationForm';
import { client } from '@/utils/api-client';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface LoginModalProps {
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginOrRegister: React.Dispatch<React.SetStateAction<string>>;
  showLoginModal: boolean;
  loginOrRegister: string;
  apiEndpoint: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  setShowLoginModal,
  setLoginOrRegister,
  showLoginModal,
  loginOrRegister,
  apiEndpoint,
}): JSX.Element => {
  const initStatusForm = {
    status: 'idle',
    buttonTextSignUp: "Sign Up",
    buttonTextSignIn: "Sign In",
    message: '',
  };
  const [statusForm, setStatusForm] = useState(initStatusForm);
  const router = useRouter();

  function login(formData: IOnSubmit): void {
    console.log(formData);
  }
  function register(formData: IOnSubmit): void {
    setStatusForm({
      status: '',
      message: '',
      buttonTextSignUp: "Loading",
      buttonTextSignIn: "",
    });
    const createUserQuery = `mutation AccountRegister {
      accountRegister(
        input: {
          email: "${formData.email}"
          password: "${formData.password}"
          redirectUrl: "http://localhost:3000/account-confirm"
        }
      ) {
        accountErrors {
          field
          code
          message
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
        query: createUserQuery,
      }),
    };
    client(apiEndpoint, clientCongfig)
      .then((responseObj: any) => {
        if (responseObj.data.accountRegister.accountErrors.length) {
          const messageErr = responseObj.data.accountRegister.accountErrors.reduce(function (result: any, item: any) {
            return result + `${item.field} is ${item.message}`;
          }, '')
          return setStatusForm({
            status: 'error',
            message: messageErr,
            buttonTextSignUp: "Sign Up",
            buttonTextSignIn: "",
          });
        }
        setStatusForm(initStatusForm);
        setTimeout(() => {
          setShowLoginModal(false);
          router.push({
            pathname: '/account-confirm',
            query: { email: responseObj.data.accountRegister.user.email }
          });
        }, 10)
      })
      .catch((error: any) => {
        setStatusForm({
          status: 'error',
          message: 'Internal server error ' + error.message,
          buttonTextSignUp: "Sign Up",
          buttonTextSignIn: "",
        });
      });
  }
  return (
    <Dialog className={styles.loginModal} aria-label="Login or Register Form" isOpen={showLoginModal}>
      <div>
        <div className={styles.modalClose}>
          <button
            className={styles.modalCloseBtn}
            onClick={() => setShowLoginModal(false)}
          >
            X
          </button>
        </div>
        {loginOrRegister === 'login' ? (
          <div>
            <LoginRegistrationForm
              onSubmit={login}
              buttonText="Login"
              formTitle="Login"
            />
            <p className={styles.callOut}>
              Don&lsquo;t have an account?
              <a
                className={styles.changeFormLink}
                onClick={() => setLoginOrRegister('register')}
              >
                Sign Up
              </a>
            </p>
          </div>
        ) : (
          <div>
            <LoginRegistrationForm
              onSubmit={register}
              buttonText={statusForm.buttonTextSignUp}
              formTitle="Sign Up"
            />
            <p className={styles.callOut}>
              Already have an account?
              <a
                className={styles.changeFormLink}
                onClick={() => setLoginOrRegister('login')}
              >
                Login
              </a>
            </p>
          </div>
        )}
        {statusForm && (
          <div style={{ marginTop: 10, marginLeft: 100, color: 'red' }}>{statusForm.message}</div>
        )}
      </div>
    </Dialog>
  );
};
