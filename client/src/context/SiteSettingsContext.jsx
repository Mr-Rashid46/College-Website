import React, { createContext, useState, useEffect } from 'react';
import API from '../api/axios';

export const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const [settingsRes, menuRes] = await Promise.all([
        API.get('/settings'),
        API.get('/menu'),
      ]);
      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data);
      }
      if (menuRes.data.success) {
        setMenuItems(menuRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load site settings/menus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, menuItems, loading, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
