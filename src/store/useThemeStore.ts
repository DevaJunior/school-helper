import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Tenta recuperar a preferência salva no navegador ou usa 'light'
  const savedTheme = (localStorage.getItem('schoolhelper-theme') as 'light' | 'dark') || 'light';

  return {
    theme: savedTheme,
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('schoolhelper-theme', newTheme);
        return { theme: newTheme };
      }),
  };
});