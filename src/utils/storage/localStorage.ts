// LocalStorage wrapper for user settings
import type { UserSettings } from '../../types/storage.types';

const SETTINGS_KEY = 'pdf-tools-settings';
const RECENT_TOOLS_KEY = 'pdf-tools-recent-tools';
const MAX_RECENT_TOOLS = 10;

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  defaultQuality: 'medium',
  autoDownload: true,
  recentTools: [],
  maxFileSize: 100 * 1024 * 1024, // 100MB
};

/**
 * Get all user settings
 */
export const getSettings = (): UserSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Save user settings
 */
export const saveSettings = (settings: Partial<UserSettings>): void => {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

/**
 * Reset settings to default
 */
export const resetSettings = (): void => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Failed to reset settings:', error);
  }
};

/**
 * Get a specific setting
 */
export const getSetting = <K extends keyof UserSettings>(
  key: K
): UserSettings[K] => {
  const settings = getSettings();
  return settings[key];
};

/**
 * Update a specific setting
 */
export const updateSetting = <K extends keyof UserSettings>(
  key: K,
  value: UserSettings[K]
): void => {
  saveSettings({ [key]: value } as Partial<UserSettings>);
};

/**
 * Add a tool to recent tools
 */
export const addRecentTool = (toolId: string): void => {
  const settings = getSettings();
  const recent = settings.recentTools.filter((id) => id !== toolId);
  recent.unshift(toolId);
  
  if (recent.length > MAX_RECENT_TOOLS) {
    recent.splice(MAX_RECENT_TOOLS);
  }

  saveSettings({ recentTools: recent });
};

/**
 * Get recent tools
 */
export const getRecentTools = (): string[] => {
  return getSetting('recentTools');
};

/**
 * Clear recent tools
 */
export const clearRecentTools = (): void => {
  saveSettings({ recentTools: [] });
};

/**
 * Get theme setting
 */
export const getTheme = (): UserSettings['theme'] => {
  return getSetting('theme');
};

/**
 * Set theme
 */
export const setTheme = (theme: UserSettings['theme']): void => {
  updateSetting('theme', theme);
  applyTheme(theme);
};

/**
 * Apply theme to document
 */
export const applyTheme = (theme: UserSettings['theme']): void => {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
};

/**
 * Initialize theme on app load
 */
export const initializeTheme = (): void => {
  const theme = getTheme();
  applyTheme(theme);

  // Listen for system theme changes
  if (theme === 'system') {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        document.documentElement.classList.toggle('dark', e.matches);
      });
  }
};

/**
 * Export all settings as JSON
 */
export const exportSettings = (): string => {
  const settings = getSettings();
  return JSON.stringify(settings, null, 2);
};

/**
 * Import settings from JSON
 */
export const importSettings = (json: string): boolean => {
  try {
    const settings = JSON.parse(json);
    saveSettings(settings);
    return true;
  } catch (error) {
    console.error('Failed to import settings:', error);
    return false;
  }
};
