import * as React from 'react';
import styles from './TopNav.module.scss';

type TopNavProps = {
  children: any;
};
export const TopNav: React.FC<TopNavProps> = ({ children }): JSX.Element => {
  return <nav className={styles.nav}>{children}</nav>;
};
