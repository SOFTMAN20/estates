import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency in Tanzanian Shillings
 * @param amount - Amount to format
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "TZS 50,000/mwezi")
 */
export function formatCurrency(
  amount: number, 
  options?: { 
    showPerMonth?: boolean;
    language?: string;
  }
): string {
  const { showPerMonth = true, language = 'sw' } = options || {};
  const formatted = `TZS ${amount.toLocaleString('en-US')}`;
  
  if (!showPerMonth) return formatted;
  
  const perMonthText = language === 'en' ? '/month' : '/mwezi';
  return `${formatted}${perMonthText}`;
}
