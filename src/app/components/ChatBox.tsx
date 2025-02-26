import { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import dynamic from 'next/dynamic';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism'; // You can change the theme

import styles from '../page.module.css';
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

interface ChatBoxProps {
  messages: {
    role: string;
    content: string;
    think?: string;
  }[];
}

export default function ChatBox({ messages }: ChatBoxProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div className={styles.chatBox}>
      <div ref={chatRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${msg.role}`}>
            <p className={`${styles.name} ${msg.role === 'user' ? styles.you : styles.model}`}>
              {msg.role === 'user' ? 'You' : 'DeepShit'}:
            </p>
            <ReactMarkdown
              className={styles.markdown}
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({
                  inline,
                  className,
                  children,
                  ...props
                }: {
                  inline?: boolean;
                  className?: string;
                  children?: ReactNode;
                }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return inline ? (
                    <code className={`${styles.inlineCode} ${className || ''}`} {...props}>
                      {children}
                    </code>
                  ) : (
                    <div className={styles.codeContainer}>
                      <p>{match ? match[1] : 'javascript'}</p>
                      <SyntaxHighlighter
                        style={coy}
                        language={match ? match[1] : 'javascript'}
                        PreTag="div"
                        showLineNumbers
                        className={styles.codeBlock} 
                      >
                        {String(children).replace(/\n$/, '')} {}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
                strong({ children }) {
                  return <strong className={styles.bold}>{children}</strong>;
                },
                ul({ children }) {
                  return <ul className={styles.list}>{children}</ul>;
                },
                li({ children }) {
                  return <li className={styles.listItem}>{children}</li>;
                },
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
}
