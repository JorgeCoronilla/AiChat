'use client';
import { useState } from 'react';
import styles from './page.module.css';
import ChatBox from './components/ChatBox';
import ModelSelector from './components/ModelSelector';
import Header from './components/Header';
import Form from './components/Form';
import ThemeSwitcher from './components/ThemeSwitcher';
import PromptConsole from './components/PromptConsole';

const Home: React.FC = () => {
  const [modelName, setModelName] = useState<string>('');
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string; think?: string }>
  >([
    {
      role: 'model',
      content:
        'Hola, soy DeepShit, un modelo de lenguaje entrenado por Jorge. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  // const HeaderSlot = ({ children }: { children: React.ReactNode }) => {
  //   return <>{children}</>;
  // };
  // HeaderSlot.slotName = 'header';
  
  // const ContentSlot = ({ children }: { children: React.ReactNode }) => {
  //   return <>{children}</>;
  // };
  // ContentSlot.slotName = 'content';

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <ModelSelector modelName={modelName} setModelName={setModelName} />
        <ChatBox messages={messages} />
        {/* <Form
              modelName={modelName}
              setModelName={setModelName}
              messages={messages}
              setMessages={setMessages}
            /> */}
        <PromptConsole>
          <>
            <Form
              modelName={modelName}
              setModelName={setModelName}
              messages={messages}
              setMessages={setMessages}
            />
          </>
          <>
            <ThemeSwitcher />
          </>
        </PromptConsole>
      </main>
    </div>
  );
};

export default Home;
