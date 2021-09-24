import styles from './FlashMessages.module.scss';
import * as React from 'react';
import { IFlashMessagesProps } from '@/common/types';

export const FlashMessages = ({
  flashMessages,
  setFlashMessages,
}: IFlashMessagesProps): JSX.Element => {
  let messages;

  setTimeout(() => {
    setFlashMessages([]);
  }, 3000);

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

  return messages;
};