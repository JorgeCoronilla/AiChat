'use client';
import { useState } from 'react';
import styles from './page.module.css';
import ChatBox from './components/ChatBox';
import ModelSelector from './components/ModelSelector';
import Header from './components/Header';
import Form from './components/Form';
import ThemeSwitcher from './components/ThemeSwitcher';

const Home: React.FC = () => {
  const [modelName, setModelName] = useState<string>('');
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string; think?: string }>
  >([]);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <ModelSelector modelName={modelName} setModelName={setModelName} />
        <ThemeSwitcher />
        <ChatBox messages={messages} />
        <Form
          modelName={modelName}
          setModelName={setModelName}
          messages={messages}
          setMessages={setMessages}
        />
      </main>
    </div>
  );
};

export default Home;
