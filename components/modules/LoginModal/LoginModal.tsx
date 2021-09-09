import styles from './LoginModal.module.scss';
import { Dialog } from '@reach/dialog';
import {
  LoginRegistrationForm,
  IOnSubmit,
} from '@/components/modules/LoginRegistrationForm';

interface LoginModalProps {
  setShowLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginOrRegister: React.Dispatch<React.SetStateAction<string>>;
  showLoginModal: boolean;
  loginOrRegister: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  setShowLoginModal,
  setLoginOrRegister,
  showLoginModal,
  loginOrRegister,
}): JSX.Element => {
  function login(formData: IOnSubmit): void {
    console.log(formData);
  }
  function register(formData: IOnSubmit): void {
    console.log(formData);
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
            <p className="mt15 ml100">
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
            <p className="mt15 ml100">
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
      </div>
    </Dialog>
  );
};
