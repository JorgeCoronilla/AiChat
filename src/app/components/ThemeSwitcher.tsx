import { useEffect } from "react";

export default function ThemeSwitcher() {
  const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark-mode', isDarkMode ? 'true' : 'false');
  };
  useEffect(() => {
    const isDarkMode = localStorage.getItem('dark-mode') === 'true';
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);
  return (
    <button onClick={toggleTheme}>
      Toggle Theme
    </button>
  );
}