import NextHead from 'next/head';

interface HeadProps {
  title?: string;
}

export const Head: React.FC<HeadProps> = ({ title }): JSX.Element => {
  return (
    <>
      <NextHead>
        {title ? (
          <title>{title} | Alive Shop</title>
        ) : (
          <title>Alive Shop</title>
        )}
        <link rel="icon" href="/favicon.ico" />
      </NextHead>
    </>
  );
};
