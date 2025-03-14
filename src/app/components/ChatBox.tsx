import { ReactNode, useState } from 'react';
import { useEffect, useRef } from 'react';

import dynamic from 'next/dynamic';

import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.chatBox}>
      <div ref={chatRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
            {msg.role !== 'user' && <p className={` ${styles.model}`}>DS</p>}
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
                      <div>{match ? match[1] : 'javascript'}</div>
                      <SyntaxHighlighter
                        style={isDarkMode ? okaidia : coy}
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
