import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Settings {
  tdsThreshold: number;
  samplingInterval: number;
  notifications: { tdsAlert: boolean; filterAlert: boolean; connectionAlert: boolean; };
  units: string;
  theme: string;
}

interface SettingsContextType {
  settings: Settings | null;
  updateSettings: (partialSettings: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    if (user?.settings) {
      setSettings(user.settings);
    }
  }, [user]);

  const updateSettings = async (partialSettings: Partial<Settings>) => {
    if (settings) {
      const newSettings = { ...settings, ...partialSettings };
      setSettings(newSettings);
      await updateProfile({ settings: newSettings });
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
