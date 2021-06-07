import * as React from 'react';
import styles from './Footer.module.scss';

interface FooterProps {
  children: any;
}

export const Footer: React.FC<FooterProps> = ({ children }): JSX.Element => {
  return <footer className={styles.footer}>{children}</footer>;
};
