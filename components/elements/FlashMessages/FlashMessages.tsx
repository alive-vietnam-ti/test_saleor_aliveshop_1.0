import styles from './FlashMessages.module.scss';
import * as React from 'react';
import { IFlashMessagesProps } from '@/common/types';
import { useEffect } from 'react';

export const FlashMessages = ({
  flashMessages,
  setFlashMessages,
}: IFlashMessagesProps): JSX.Element => {
  let messages;
  let timer: number | undefined;

  if (flashMessages.length === 0) {
    messages = <></>;
  } else {
    messages = (
      <div className={styles.messagesContainer}>
        <ul>
          {flashMessages.map((message: string, i: number) => {
            return <li key={`${i}-${message.slice(0, 2)}`}>{message}</li>;
          })}
        </ul>
      </div>
    );
  }

  useEffect(() => {
    timer = window.setTimeout(() => {
      setFlashMessages([]);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [flashMessages]);

  return messages;
};
