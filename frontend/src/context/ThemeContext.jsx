import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'smartprep-theme-mode';
const VALID_THEME_MODES = new Set(['light', 'dark', 'system']);

const ThemeContext = createContext(null);

const getSystemTheme = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getInitialThemeMode = () => {
    if (typeof window === 'undefined') return 'system';
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return VALID_THEME_MODES.has(stored) ? stored : 'system';
    } catch {
        return 'system';
    }
};

const applyTheme = (mode) => {
    const resolved = mode === 'system' ? getSystemTheme() : mode;
    document.documentElement.setAttribute('data-theme-mode', mode);
    document.documentElement.setAttribute('data-theme', resolved);
    return resolved;
};

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState(getInitialThemeMode);
    const [resolvedTheme, setResolvedTheme] = useState('light');

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const syncTheme = () => {
            const resolved = applyTheme(themeMode);
            setResolvedTheme(resolved);
        };

        syncTheme();
        try {
            window.localStorage.setItem(STORAGE_KEY, themeMode);
        } catch {
            // Ignore storage access errors.
        }

        if (themeMode !== 'system') return undefined;

        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => syncTheme();

        if (media.addEventListener) {
            media.addEventListener('change', handleChange);
            return () => media.removeEventListener('change', handleChange);
        }

        media.addListener(handleChange);
        return () => media.removeListener(handleChange);
    }, [themeMode]);

    const value = useMemo(
        () => ({
            themeMode,
            resolvedTheme,
            setThemeMode: (nextMode) => {
                if (VALID_THEME_MODES.has(nextMode)) {
                    setThemeMode(nextMode);
                }
            },
        }),
        [themeMode, resolvedTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
