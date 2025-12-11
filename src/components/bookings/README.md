# Booking Components

## BookingForm Component

A comprehensive booking form component for property rentals with date selection and automatic price calculation.

### Features

- **Date Selection**: Check-in and check-out date pickers using react-day-picker
- **Smart Validation**: 
  - Prevents selecting past dates
  - Ensures check-out is after check-in
  - Minimum 1 month rental period
- **Automatic Calculations**:
  - Monthly rent × number of months
  - Service fee (10% platform commission)
  - Total amount with clear breakdown
- **Bilingual Support**: Full English and Swahili translations
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Sticky Positioning**: Stays visible while scrolling on desktop

### Usage

```tsx
import { BookingForm } from '@/components/bookings/BookingForm';

function PropertyDetail() {
  const handleBooking = (bookingData) => {
    console.log('Booking data:', bookingData);
    // Process booking (create in database, navigate to payment, etc.)
  };

  return (
    <BookingForm
      propertyId="property-id-123"
      pricePerMonth={500000}
      onBookNow={handleBooking}
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `propertyId` | `string` | Yes | Unique identifier for the property |
| `pricePerMonth` | `number` | Yes | Monthly rental price in TZS |
| `onBookNow` | `(data: BookingData) => void` | No | Callback when booking is submitted |
| `className` | `string` | No | Additional CSS classes |

### BookingData Interface

```typescript
interface BookingData {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  months: number;
  subtotal: number;
  serviceFee: number;
  totalAmount: number;
}
```

### Example Booking Flow

1. User selects check-in date
2. User selects check-out date (must be after check-in)
3. Component automatically calculates:
   - Number of months between dates
   - Subtotal (price × months)
   - Service fee (10% of subtotal)
   - Total amount
4. User clicks "Book Now" button
5. `onBookNow` callback is triggered with booking data
6. Parent component handles booking creation and navigation

### Styling

The component uses:
- ShadCN UI components (Card, Button, Calendar, Popover)
- Tailwind CSS for styling
- Sticky positioning on desktop (`sticky top-24`)
- Responsive grid layout

### Dependencies

- `react-day-picker` - Date picker component
- `date-fns` - Date manipulation and formatting
- `react-i18next` - Internationalization
- `lucide-react` - Icons
- ShadCN UI components

### Translations

The component uses the following translation keys:
- Check-in/Check-out labels
- Duration, Service fee, Total labels
- "Book Now" button text
- Helper text

All translations are available in both English and Swahili.
