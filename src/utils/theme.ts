export type Theme = "dark" | "light" | "system";

export const storageKey = "vite-ui-theme";
export const defaultTheme: Theme = "system";

export function setupTheme(theme?: Theme) {
  if (!theme) {
    theme = (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  }

  const root = window.document.documentElement;

  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    root.classList.add(systemTheme);
    return;
  }

  root.classList.add(theme);
}
