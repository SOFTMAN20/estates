/**
 * MODECONTEXT.TSX - MODE CONTEXT PROVIDER
 * =======================================
 * 
 * Global context for managing user mode (Guest/Host) across the entire app
 * Ensures all components share the same mode state
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserMode = 'guest' | 'host';

interface ModeContextType {
  currentMode: UserMode;
  toggleMode: () => void;
  setMode: (mode: UserMode) => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

interface ModeProviderProps {
  children: ReactNode;
}

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [currentMode, setCurrentMode] = useState<UserMode>('guest');

  // Load mode from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('userMode') as UserMode;
    if (savedMode && (savedMode === 'guest' || savedMode === 'host')) {
      setCurrentMode(savedMode);
    }
  }, []);

  // Save mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('userMode', currentMode);
    console.log('Mode changed to:', currentMode); // Debug log
  }, [currentMode]);

  const toggleMode = () => {
    setCurrentMode(prev => {
      const newMode = prev === 'guest' ? 'host' : 'guest';
      console.log('Toggling mode from', prev, 'to', newMode); // Debug log
      return newMode;
    });
  };

  const setMode = (mode: UserMode) => {
    console.log('Setting mode to:', mode); // Debug log
    setCurrentMode(mode);
  };

  return (
    <ModeContext.Provider value={{ currentMode, toggleMode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useModeToggle = (): ModeContextType => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useModeToggle must be used within a ModeProvider');
  }
  return context;
};

export default ModeContext;
