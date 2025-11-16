/**
 * USEMODETOGGLE.TSX - MODE TOGGLE HOOK
 * ===================================
 * 
 * Hook for managing user mode switching between Guest and Host modes
 */

import { useState, useEffect } from 'react';

type UserMode = 'guest' | 'host';

interface ModeToggleState {
  currentMode: UserMode;
  toggleMode: () => void;
  setMode: (mode: UserMode) => void;
}

export const useModeToggle = (): ModeToggleState => {
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
  }, [currentMode]);

  const toggleMode = () => {
    setCurrentMode(prev => prev === 'guest' ? 'host' : 'guest');
  };

  const setMode = (mode: UserMode) => {
    setCurrentMode(mode);
  };

  return {
    currentMode,
    toggleMode,
    setMode,
  };
};

export default useModeToggle;
