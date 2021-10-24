import styles from './styles.module.scss';
import io from 'socket.io-client';

import logoImg from '../../assets/logo.svg'
import { useCallback, useEffect } from 'react';
import { api } from '../../services/api';
import { useState } from 'react';

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', (newMessage: Message) => {
  console.log(newMessage);
  messagesQueue.push(newMessage);
});

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([]);

  const loadLastMessages = useCallback(async () => {
    const response = await api.get<Message[]>('messages/last3');
    setMessages(response.data);
  }, []);
  
  useEffect(() => {
    loadLastMessages();
  }, [loadLastMessages]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length) {
        setMessages((oldMessages) => [
          messagesQueue[0],
          oldMessages[0],
          oldMessages[1]
        ].filter(Boolean));
        messagesQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile 2021" />
      <ul className={styles.messageList}>
        {messages.map((message) => (
          <li key={message.id} className={styles.message}>
            <p className={styles.messageContent}>{message.text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name} />
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}