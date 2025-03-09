import { useEffect, useState } from 'react';
import styles from './ThemeSwitcher.module.css';
import LightIcon from './LightIcon';
import MoonIcon from './MoonIcon';
export default function ThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    setIsDarkMode(document.body.classList.contains('dark-mode'));
    localStorage.setItem('dark-mode', isDarkMode ? 'true' : 'false');
  };
  useEffect(() => {
    setIsDarkMode(localStorage.getItem('dark-mode') === 'true');
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);
  return (
    <button className={styles.switcher} onClick={toggleTheme}>
      {isDarkMode ? <LightIcon /> : <MoonIcon />}
    </button>
  );
}
