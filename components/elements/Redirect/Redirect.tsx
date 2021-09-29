import { useRouter } from 'next/router';
import * as React from 'react';

export const Redirect = ({ to = '/' }: { to: string }): JSX.Element => {
  const router = useRouter();
  React.useEffect(() => {
    console.log('redirecting');
    router.push(to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  return <></>;
};
