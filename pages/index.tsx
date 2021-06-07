import { Head } from '@/components/modules/Head';
import { Footer } from '@/components/modules/Footer';
import { FooterBranding } from '@/components/elements/FooterBranding';
import styles from '@/styles/page-styles/Home.module.scss';

export const Home = (): JSX.Element => (
  <>
    <Head />
    <main>
      <h1 className={styles.title}>
        Welcome to <a href="https://alive-web.vn/">Alive Shop</a>
      </h1>
    </main>
    <Footer>
      <FooterBranding />
    </Footer>
  </>
);

export default Home;
