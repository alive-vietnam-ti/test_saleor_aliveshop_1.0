import styles from './LoginModal.module.scss';
import { Dialog } from '@reach/dialog';
import {
  LoginRegistrationForm,
  IOnSubmit,
} from '@/components/modules/LoginRegistrationForm';
import { client } from '@/utils/api-client';
import { useState, setState } from 'react';

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
  const [errorForm, setErrorForm] = useState({
    status: 'idle',
    message: '',
  });

  function login(formData: IOnSubmit): void {
    console.log(formData);
  }
  function register(formData: IOnSubmit): void {
    setErrorForm({
      status: '',
      message: '',
    });
    const createUserQuery = `mutation AccountRegister {
      accountRegister(
        input: {
          email: "${formData.email}"
          password: "${formData.password}"
          redirectUrl: "http://localhost:3000/"
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
        if (responseObj.data.accountRegister.accountErrors) {
          const messageErr = responseObj.data.accountRegister.accountErrors.reduce(function (result: any, item: any) {
            return result + `${item.field} is ${item.message}`;
          }, '')
          setErrorForm({
            status: 'error',
            message: messageErr,
          });
        } else {
          setLoginOrRegister('login');
        }

      })
      .catch((error: any) => {
        setErrorForm({
          status: 'error',
          message: 'Internal server error ' + error.message,
        });
      });
  }
  return (
    <Dialog aria-label="Login or Register Form" isOpen={showLoginModal}>
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
              buttonText="Sign Up"
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
        {errorForm && (
          <div style={{ marginTop: 10, marginLeft: 100, color: 'red' }}>{errorForm.message}</div>
        )}
      </div>
    </Dialog>
  );
};
