import styles from '../page.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1><span className={styles.rotate}>D</span>eepShit</h1>
    </header>
  );
}
