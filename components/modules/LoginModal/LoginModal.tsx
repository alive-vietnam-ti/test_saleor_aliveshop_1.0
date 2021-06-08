import styles from './UserIcon.module.scss';
import { Dialog } from '@reach/dialog';

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
  return (
    <Dialog aria-label="Login or Register Form" isOpen={showLoginModal}>
      <div>
        <button onClick={() => setShowLoginModal(false)}>X</button>
        {loginOrRegister === 'login' ? (
          <div>
            <p>Login form</p>
            <button onClick={() => setLoginOrRegister('register')}>
              Register
            </button>
          </div>
        ) : (
          <div>
            <p>Registration Form</p>
            <button onClick={() => setLoginOrRegister('login')}>Login</button>
          </div>
        )}
      </div>
    </Dialog>
  );
};
