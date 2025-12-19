import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useNotifications();
  const prevUnreadCount = useRef(unreadCount);

  // Detect new notifications
  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      setHasNewNotification(true);
      setTimeout(() => setHasNewNotification(false), 3000);
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 rounded-lg hover:bg-gray-100 transition-colors',
          isOpen && 'bg-gray-100'
        )}
        aria-label="Notifications"
      >
        <Bell className={cn(
          'w-5 h-5 text-gray-600',
          hasNewNotification && 'animate-pulse'
        )} />
        
        {unreadCount > 0 && (
          <span className={cn(
            'absolute -top-1 -right-1 flex items-center justify-center',
            'min-w-[20px] h-5 px-1.5 rounded-full',
            'bg-red-500 text-white text-xs font-semibold',
            hasNewNotification && 'animate-bounce'
          )}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
