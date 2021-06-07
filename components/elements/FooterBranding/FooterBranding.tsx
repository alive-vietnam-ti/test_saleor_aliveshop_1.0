import Image from 'next/image';

export const FooterBranding = (): JSX.Element => {
  return (
    <>
      <a href="https://alive-web.vn/" target="_blank" rel="noopener noreferrer">
        Powered by{'  '}
        <Image
          src="/img/logo_alive.svg"
          alt="Vercel Logo"
          height={'16'}
          width={'64'}
        />
      </a>
    </>
  );
};
