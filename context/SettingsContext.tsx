import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchSettings } from '../utils/api';

interface SettingsContextType {
  settings: Record<string, any>;
  loading: boolean;
  getSetting: <T>(key: string, defaultValue: T) => T;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchSettings().then(data => {
      if (isMounted) {
        setSettings(data);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const getSetting = <T extends unknown>(key: string, defaultValue: T): T => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, getSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};