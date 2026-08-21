export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'theme';

export function getTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === 'dark' || stored === 'light') {
    return stored;
  }

  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return prefersDark ? 'dark' : 'light';
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function setTheme(theme: ThemeMode) {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

export function toggleTheme(): ThemeMode {
  const next: ThemeMode = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function initTheme() {
  applyTheme(getTheme());
}
