// src/theme/theme.ts

export const applyTheme = (theme: "light" | "dark") => {
    const root = document.documentElement;
  
    const themes = {
      light: {
        "--background-color": "#ffffff",
        "--text-color": "#333333",
        "--primary-color": "#007bff",
        "--secondary-color": "#0056b3",
        "--navbar-bg": "#f8f9fa",
        "--button-bg": "#007bff",
        "--button-hover-bg": "#0056b3"
      },
      dark: {
        "--background-color": "#1a1a2e",
        "--text-color": "#e0e0e0",
        "--primary-color": "#0f52ba",
        "--secondary-color": "#5a5a5a",
        "--navbar-bg": "#16213e",
        "--button-bg": "#0f3460",
        "--button-hover-bg": "#1a1a2e"
      }
    };
  
    const selectedTheme = themes[theme];
  
    Object.entries(selectedTheme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  
    document.body.setAttribute("data-theme", theme);
  };
  