/**
 * useProfileUtils.tsx - Profile Utility Functions Hook
 * ====================================================
 * 
 * Custom hook providing utility functions for profile operations.
 * Includes date formatting, validation, and helper functions.
 * 
 * FEATURES / VIPENGELE:
 * - Date formatting utilities
 * - Profile validation helpers
 * - Common utility functions
 * 
 * USAGE / MATUMIZI:
 * const { formatDate, getInitials, validatePhone } = useProfileUtils();
 */

/**
 * Hook return type interface
 * Muundo wa matokeo ya hook
 */
interface UseProfileUtilsReturn {
  formatDate: (date: string | null) => string;
  getInitials: (name: string) => string;
  validatePhone: (phone: string) => boolean;
  validateEmail: (email: string) => boolean;
}

/**
 * useProfileUtils Hook
 * ====================
 * 
 * Provides utility functions for profile operations.
 * Inatoa kazi za msaada kwa shughuli za wasifu.
 */
export const useProfileUtils = (): UseProfileUtilsReturn => {
  /**
   * Format date to Swahili locale
   * Panga tarehe kwa lugha ya Kiswahili
   * 
   * @param date - Date string to format
   * @returns Formatted date string or 'N/A' if null
   * 
   * @example
   * formatDate('2024-01-15') // Returns: '15 Januari 2024'
   */
  const formatDate = (date: string | null): string => {
    if (!date) return 'N/A';
    
    try {
      return new Date(date).toLocaleDateString('sw-TZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  /**
   * Get user initials from name
   * Pata herufi za kwanza za jina la mtumiaji
   * 
   * @param name - Full name to extract initials from
   * @returns Uppercase initials (max 2 characters)
   * 
   * @example
   * getInitials('John Doe') // Returns: 'JD'
   * getInitials('Mary') // Returns: 'M'
   */
  const getInitials = (name: string): string => {
    if (!name || name.trim().length === 0) return 'U';
    
    return name
      .trim()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Validate phone number format
   * Thibitisha muundo wa nambari ya simu
   * 
   * @param phone - Phone number to validate
   * @returns True if valid, false otherwise
   * 
   * @example
   * validatePhone('+255712345678') // Returns: true
   * validatePhone('0712345678') // Returns: true
   * validatePhone('123') // Returns: false
   */
  const validatePhone = (phone: string): boolean => {
    if (!phone || phone.trim().length === 0) return true; // Optional field
    
    // Remove spaces and dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Check if it's a valid Tanzanian phone number
    // Formats: +255XXXXXXXXX, 255XXXXXXXXX, 0XXXXXXXXX
    const phoneRegex = /^(\+?255|0)[67]\d{8}$/;
    
    return phoneRegex.test(cleanPhone);
  };

  /**
   * Validate email format
   * Thibitisha muundo wa barua pepe
   * 
   * @param email - Email address to validate
   * @returns True if valid, false otherwise
   * 
   * @example
   * validateEmail('user@example.com') // Returns: true
   * validateEmail('invalid-email') // Returns: false
   */
  const validateEmail = (email: string): boolean => {
    if (!email || email.trim().length === 0) return false;
    
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return emailRegex.test(email);
  };

  return {
    formatDate,
    getInitials,
    validatePhone,
    validateEmail
  };
};
