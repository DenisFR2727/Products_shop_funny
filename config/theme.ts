export const THEME_LIGHT = "light_theme" as const;
export const THEME_DARK = "dark_theme" as const;

export type ThemeClass = typeof THEME_LIGHT | typeof THEME_DARK;

export const THEME_FILTER_BTN = {
  [THEME_LIGHT]: "light_theme-btn",
  [THEME_DARK]: "dark_theme-btn",
} as const;

export const THEME_CLASSES: readonly ThemeClass[] = [THEME_LIGHT, THEME_DARK];

export const THEME_TRANSITION = {
  duration: 0.65,
  ease: "easeInOut",
} as const;
