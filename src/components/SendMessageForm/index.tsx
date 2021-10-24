import { FormEvent, useContext, useState } from 'react';
import { VscGithubInverted as GithubIcon, VscSignOut as SignOutIcon } from 'react-icons/vsc';
import { AuthContext } from '../../contexts/auth';
import { api } from '../../services/api';
import styles from './styles.module.scss';

export function SendMessageForm() {
  const [message, setMessage] = useState('');
  const { user, signOut } = useContext(AuthContext);

  const handleSendMessage = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    await api.post('messages', {message});
    setMessage('');
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button onClick={signOut} className={styles.signOutButton}>
        <SignOutIcon size={32} />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>
          {user?.name}
        </strong>
        <span className={styles.userGithub}>
          <GithubIcon size={16} />
          {user?.login}
        </span>
      </header>
      <form onSubmit={handleSendMessage}  className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          value={message}
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento?"
          onChange={event => setMessage(event.target.value)}
        />
        <button type="submit">Enviar Mensagem</button>
      </form>
    </div>
  )
} 