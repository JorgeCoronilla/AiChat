import { getModelResponse } from '@/lib/api';
import { useState } from 'react';
import styles from '../page.module.css';

interface FormProps {
    modelName: string;
    setModelName: (modelName: string) => void;
    messages: Array<{ role: string; content: string; think?: string }>;
    setMessages: (
      messages:
        | Array<{ role: string; content: string; think?: string }>
        | ((prevMessages: Array<{ role: string; content: string; think?: string }>) => Array<{ role: string; content: string; think?: string }>)
    ) => void;
  }

export default function Form({ modelName, setModelName, messages, setMessages }: FormProps) {
  const [input, setInput] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
  
    event.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');

    try {
      setMessages((prevMessages: Array<{ role: string; content: string; think?: string }>) => [
        ...prevMessages,
        { role: 'assistant', content: '' },
      ]);

      await getModelResponse(input, modelName, (data) => {
        setMessages((prevMessages: Array<{ role: string; content: string; think?: string }>) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          let parsedData = { response: '' };

          try {
            parsedData = JSON.parse(data);
            console.log(parsedData)
          } catch {
            console.log('error', data);
          }

          if (lastMessage.role === 'assistant') {
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, content: lastMessage.content + parsedData.response },
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

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
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
  );
}