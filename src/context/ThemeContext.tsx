import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { Colors } from '@/constants/colors';

export type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  error: string;
  info: string;
  success: string;
  warning: string;
};

function buildTheme(scheme: ColorSchemeName): ThemeColors {
  const dark = scheme === 'dark';
  return {
    background: dark ? Colors.backgroundDark : Colors.background,
    surface: dark ? Colors.surfaceDark : Colors.surface,
    text: dark ? Colors.textWhite : Colors.text,
    textSecondary: dark ? Colors.textLight : Colors.textSecondary,
    border: dark ? Colors.borderDark : Colors.border,
    primary: Colors.primary,
    error: Colors.error,
    info: Colors.info,
    success: Colors.success,
    warning: Colors.warning,
  };
}

type ThemeContextValue = {
  colors: ThemeColors;
  scheme: ColorSchemeName;
  setScheme: (s: ColorSchemeName | 'system') => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [pref, setPref] = useState<ColorSchemeName | 'system'>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() ?? 'light');

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme ?? 'light');
    });
    return () => sub.remove();
  }, []);

  const scheme: ColorSchemeName = pref === 'system' ? systemScheme : (pref as ColorSchemeName);
  const value = useMemo<ThemeContextValue>(() => ({
    colors: buildTheme(scheme),
    scheme,
    setScheme: setPref,
  }), [scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
