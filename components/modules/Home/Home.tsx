import * as React from 'react';
import styles from './Home.module.scss';

interface HomeProps {
  children: any;
}

export const Home: React.FC<HomeProps> = ({ children }): JSX.Element => {
  return <main className={styles.main}>{children}</main>;
};
