/**
 * MODETOGGLE.TSX - MODE TOGGLE COMPONENT
 * =====================================
 * 
 * Toggle switch for switching between Guest and Host modes
 * Navigates to appropriate page when mode changes
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { User, Home } from 'lucide-react';
import { useModeToggle } from '@/hooks/useModeToggle';

interface ModeToggleProps {
  className?: string;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ className = '' }) => {
  const { currentMode, toggleMode } = useModeToggle();
  const navigate = useNavigate();
  const isHostMode = currentMode === 'host';

  const handleModeChange = () => {
    toggleMode();
    // Navigate based on new mode
    if (currentMode === 'guest') {
      // Switching to host mode
      navigate('/dashboard');
    } else {
      // Switching to guest mode
      navigate('/browse');
    }
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {/* Current Mode Label - Shows only active mode with color coding */}
      <div className="flex items-center gap-1.5">
        {isHostMode ? (
          <>
            <Home className="h-3.5 w-3.5 text-serengeti-600" />
            <span className="text-xs font-semibold text-serengeti-600">Host</span>
          </>
        ) : (
          <>
            <User className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-xs font-semibold text-slate-600">Guest</span>
          </>
        )}
      </div>
      
      {/* Toggle Switch with color coding */}
      <Switch
        checked={isHostMode}
        onCheckedChange={handleModeChange}
        className={`scale-90 ${
          isHostMode 
            ? 'data-[state=checked]:bg-serengeti-600' 
            : 'data-[state=unchecked]:bg-slate-600'
        }`}
      />
    </div>
  );
};

export default ModeToggle;
