import styles from './ProductLoadErrorFallback.module.scss';
import Link from 'next/link';

interface IProps {
  error?: any;
}

export const ProductLoadErrorFallback = ({ error }: IProps): JSX.Element => {
  console.error('Error in ProductLoadErrorFallback', error);
  return (
    <>
      <div className={styles.errorDiv}>
        <p>Sorry there was a problem. No products available at this time.</p>
        <p>
          Go back to home page?{' '}
          <Link href="/">
            <a>Home</a>
          </Link>
        </p>
      </div>
    </>
  );
};
