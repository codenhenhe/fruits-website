'use client';

export default function ThemeToggle() {
  function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    const root = document.documentElement;

    if (newTheme === 'dark') {
      root.style.setProperty('--background', '#0a0a0a');
      root.style.setProperty('--foreground', '#ededed');
    } else {
      root.style.setProperty('--background', '#FFF5E6');
      root.style.setProperty('--foreground', '#171717');
    }

    localStorage.setItem('theme', newTheme);
  }

  return <button onClick={toggleTheme}>Chuyển chế độ</button>;
}