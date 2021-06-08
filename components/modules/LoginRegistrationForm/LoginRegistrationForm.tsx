import React from 'react';
import styles from './LoginRegistrationForm.module.scss';

interface IOnSubmit {
  email: string;
  password: string;
}

interface LoginRegistrationFormProps {
  buttonText: string;
  onSubmit: (data: IOnSubmit) => void;
}

export const LoginRegistrationForm: React.FC<LoginRegistrationFormProps> = ({
  buttonText,
  onSubmit,
}): JSX.Element => {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const {
      email,
      password,
    }: { email: HTMLInputElement; password: HTMLInputElement } =
      event.target.elements;
    onSubmit({
      email: email.value,
      password: password.value,
    });
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" />
      </div>
      <div>
        <button onSubmit={handleSubmit}>{buttonText}</button>
      </div>
    </form>
  );
};
