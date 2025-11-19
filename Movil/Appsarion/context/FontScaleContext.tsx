import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FontScaleContextType {
  fontScale: number;
  setFontScale: (scale: number) => Promise<void>;
}

const FontScaleContext = createContext<FontScaleContextType | undefined>(undefined);

export function FontScaleProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScaleState] = useState(1);

  useEffect(() => {
    loadFontScale();
  }, []);

  const loadFontScale = async () => {
    try {
      const saved = await AsyncStorage.getItem('appFontScale');
      if (saved) {
        setFontScaleState(parseFloat(saved));
      }
    } catch (error) {
      console.error('Error loading font scale:', error);
    }
  };

  const setFontScale = async (scale: number) => {
    try {
      await AsyncStorage.setItem('appFontScale', scale.toString());
      setFontScaleState(scale);
    } catch (error) {
      console.error('Error saving font scale:', error);
    }
  };

  return (
    <FontScaleContext.Provider value={{ fontScale, setFontScale }}>
      {children}
    </FontScaleContext.Provider>
  );
}

export function useFontScale() {
  const context = useContext(FontScaleContext);
  if (context === undefined) {
    throw new Error('useFontScale must be used within FontScaleProvider');
  }
  return context;
}
