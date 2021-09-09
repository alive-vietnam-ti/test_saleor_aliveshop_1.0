import React from 'react';
import styles from './LoginRegistrationForm.module.scss';

export interface IOnSubmit {
  email: string;
  password: string;
}

interface LoginRegistrationFormProps {
  formTitle: string;
  buttonText: string;
  onSubmit: (data: IOnSubmit) => void;
}

export const LoginRegistrationForm: React.FC<LoginRegistrationFormProps> = ({
  formTitle,
  buttonText,
  onSubmit,
}): JSX.Element => {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value;
    const password = target.password.value;
    onSubmit({
      email,
      password,
    });
  }
  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.formTitle}>{formTitle}</h2>
      <div className={styles.formField}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </div>
      <div className={styles.formField}>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <div>
        <button className={styles.btnSubmit} onSubmit={handleSubmit}>{buttonText}</button>
      </div>
    </form>
  );
};
