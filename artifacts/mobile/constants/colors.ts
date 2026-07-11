const colors = {
  light: {
    // ── AFRIQ Brand ──────────────────────────────────────────
    brand: '#059669',
    brandDark: '#047857',
    brandDeep: '#065f46',
    brandLight: '#d1fae5',
    brandBg: '#ecfdf5',

    gold: '#f59e0b',
    goldDark: '#d97706',
    goldDeep: '#b45309',
    goldLight: '#fef3c7',
    goldBg: '#fffbeb',

    navy: '#0284c7',
    navyDark: '#075985',
    navyLight: '#e0f2fe',
    navyBg: '#f0f9ff',

    // ── Surfaces ──────────────────────────────────────────────
    background: '#f3f4f6',
    foreground: '#111827',
    card: '#ffffff',
    cardForeground: '#111827',

    // ── Semantic ──────────────────────────────────────────────
    primary: '#059669',
    primaryForeground: '#ffffff',
    secondary: '#f9fafb',
    secondaryForeground: '#374151',
    muted: '#f3f4f6',
    mutedForeground: '#6b7280',
    accent: '#ecfdf5',
    accentForeground: '#047857',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    warning: '#f59e0b',
    warningForeground: '#ffffff',
    info: '#0284c7',
    infoForeground: '#ffffff',
    success: '#059669',
    successForeground: '#ffffff',

    // ── Borders & Inputs ─────────────────────────────────────
    border: '#e5e7eb',
    input: '#e5e7eb',
    ring: '#059669',

    // ── Text ─────────────────────────────────────────────────
    text: '#111827',
    textSecondary: '#4b5563',
    tint: '#059669',
  },
  dark: {
    brand: '#10b981',
    brandDark: '#059669',
    brandDeep: '#047857',
    brandLight: '#064e3b',
    brandBg: '#022c22',

    gold: '#fbbf24',
    goldDark: '#f59e0b',
    goldDeep: '#d97706',
    goldLight: '#451a03',
    goldBg: '#1c1009',

    navy: '#38bdf8',
    navyDark: '#0284c7',
    navyLight: '#0c4a6e',
    navyBg: '#082f49',

    background: '#0a0a0a',
    foreground: '#f9fafb',
    card: '#1a1a1a',
    cardForeground: '#f9fafb',

    primary: '#10b981',
    primaryForeground: '#022c22',
    secondary: '#1f2937',
    secondaryForeground: '#e5e7eb',
    muted: '#1f2937',
    mutedForeground: '#9ca3af',
    accent: '#064e3b',
    accentForeground: '#10b981',
    destructive: '#f87171',
    destructiveForeground: '#7f1d1d',
    warning: '#fbbf24',
    warningForeground: '#451a03',
    info: '#38bdf8',
    infoForeground: '#0c4a6e',
    success: '#10b981',
    successForeground: '#022c22',

    border: '#2d2d2d',
    input: '#2d2d2d',
    ring: '#10b981',

    text: '#f9fafb',
    textSecondary: '#9ca3af',
    tint: '#10b981',
  },
  radius: 12,
} as const;

export default colors;
