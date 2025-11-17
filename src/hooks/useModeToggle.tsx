/**
 * USEMODETOGGLE.TSX - MODE TOGGLE HOOK
 * ===================================
 * 
 * Hook for managing user mode switching between Guest and Host modes
 * Now uses ModeContext for shared state across all components
 */

// Re-export the useModeToggle hook from ModeContext
// This maintains backward compatibility with existing code
export { useModeToggle, useModeToggle as default } from '@/contexts/ModeContext';
