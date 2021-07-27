import * as React from 'react';
import styles from '../CartSideBar/CartSideBar.module.scss';
import Link from 'next/link';

/* types */

export interface IFavItem {
  id: string;
  name: string;
  slug: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
}

type FavProps = {
  favVisible: boolean;
  setFavVisible: React.Dispatch<React.SetStateAction<boolean>>;
  productsFav: any;
};

interface IFavSideBarItemProps {
  item: any;
}
const FavSideBarItem: React.FC<IFavSideBarItemProps> = ({
  item,
}): JSX.Element => {
  const mounted = React.useRef(false);
  React.useEffect(() => {
    mounted.current = true;
  }, [item]);
  return (
    <>
      {mounted.current && (
        <li>
          <Link href={`/products/${encodeURIComponent(item.slug)}`}>
            <a className={styles.itemWrapper}>
              <div className={styles.imgAndDelete}>
                <img src={item.thumbnailUrl} alt={item.thumbnailAlt} />
              </div>
              <div className={styles.details}>
                <p>{item.name}</p>
              </div>
            </a>
          </Link>
        </li>
      )}
    </>
  );
};

export const FavSideBar: React.FC<FavProps> = ({
  favVisible,
  setFavVisible,
  productsFav,
}): JSX.Element => {
  return (
    <>
      <div
        className={styles.cart}
        style={{ width: `${favVisible ? '300px' : '0'}` }}
      >
        <header className={styles.header}>
          <h2 className={styles.cartSideTitle}>my favorite</h2>
          <p className={styles.close} onClick={() => setFavVisible(false)}>
            X
          </p>
        </header>
        <section className={styles.itemsWrapper}>
          <ul>
            {productsFav.length > 0 ? (
              productsFav.map((item: any, index: number) => {
                return (
                  <FavSideBarItem
                    key={index + item.id}
                    item={item}
                  />
                );
              })
            ) : (
              <li>
                <p>No Items in Favorite</p>
              </li>
            )}
          </ul>
        </section>
      </div>

      <div
        className={styles.overlay}
        style={{ width: `${favVisible ? '100%' : '0'}` }}
      ></div>
    </>
  );
};
