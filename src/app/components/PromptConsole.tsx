import React from 'react';
import styles from './Console.module.css'

interface PromptConsoleProps {
  children: React.ReactNode;
}
export default function PromptConsole({ children }: PromptConsoleProps) {
  // const headerSlot = React.Children.toArray(children).find(
  //   (child: any) => child?.type?.slotName === 'header'
  // );

  // const contentSlot = React.Children.toArray(children).find(
  //   (child: any) => child?.type?.slotName === 'content'
  // );
  const [form, buttons] = React.Children.toArray(children);
  return (
    <div className={styles.container}>
      <div className={styles.upper}>{form}</div>
      <div className={styles.below}>{buttons}</div>
    </div>
  );
}

