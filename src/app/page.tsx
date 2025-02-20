'use client';
import { useEffect, useState } from 'react';
import { getModelResponse } from '../lib/api';
import styles from './page.module.css';
import ChatBox from './components/ChatBox';

const Home: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string; think?: string }>
  >([]);
  const [modelName, setModelName] = useState<string>('');
  const [models, setModels] = useState<{ name: string }[]>([]);
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    setModelName('dolphin-llama3');
    event.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');

    try {
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: '' }]);

      // Get model response from the Ollama API with streaming
      await getModelResponse(input, modelName, (data) => {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          let parsedData = { response: '' };

          try {
            parsedData = JSON.parse(data);
          } catch {
            console.log('error', data);
          }

          if (lastMessage.role === 'assistant') {
            console.log(lastMessage.content);
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + parsedData.response }, // Append new data
            ];
          }

          return prevMessages;
        });
      });
    } catch (error) {
      console.log(error);
      setMessages([...messages, { role: 'assistant', content: 'Error fetching response.' }]);
    }
  };
  useEffect(() => {
    fetch("http://localhost:11434/api/tags")
      .then((res) => res.json())
      .then((data) => {
        setModels(data.models);
        setModelName(data.models[0] || ""); 
        console.log(data)
      })
      .catch((err) => console.error("Error fetching models:", err));
  }, []);
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>DeepShit</h1>
      </header>
      <main className={styles.main}>
      <label className="block mb-2">Select Model:</label>
      <select
        className="w-full p-2 mb-4 text-black"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
      >
        {models.map((model) => (
          <option key={model.name} value={model.name}>
            {model.name}
          </option>
        ))}
      </select>
        <ChatBox messages={messages} />
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            onKeyDown={onKeyDown}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default Home;
