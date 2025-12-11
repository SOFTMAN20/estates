# BookingModal Component

## Overview
A comprehensive modal dialog for confirming property bookings before submission. This modal provides a complete review of the booking details and collects additional information from the guest.

## Features

### ✅ Property Summary
- Property image thumbnail
- Property title and location
- Property type badge
- Monthly rent display

### ✅ Booking Period
- Check-in date display
- Check-out date display
- Duration calculation (months)

### ✅ Payment Summary
- Subtotal calculation (monthly rent × months)
- Service fee (10%)
- Total amount (bold, highlighted)

### ✅ Guest Information
- Pre-filled from user profile
- Name display
- Email display
- Phone display

### ✅ Special Requests
- Textarea for guest to add special requests
- Optional field
- Examples: early check-in, parking space, etc.

### ✅ Terms and Conditions
- Checkbox for agreement
- Link to terms page
- Warning message if not agreed
- Prevents booking without agreement

### ✅ Action Buttons
- Cancel button (closes modal)
- Confirm Booking button (disabled until terms agreed)
- Loading state during submission

## Props

```typescript
interface BookingModalProps {
  open: boolean;                    // Modal open state
  onOpenChange: (open: boolean) => void;  // Handler for modal state
  property: {                       // Property information
    id: string;
    title: string;
    location: string;
    images: string[];
    property_type: string;
    price: number;
  };
  bookingData: {                    // Booking details
    checkIn: Date;
    checkOut: Date;
    months: number;
    subtotal: number;
    serviceFee: number;
    totalAmount: number;
  };
  guestInfo: {                      // Guest information
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  onConfirm: (specialRequests: string) => void;  // Confirmation handler
  isLoading?: boolean;              // Loading state
}
```

## Usage

### Basic Usage

```tsx
import { BookingModal } from '@/components/bookings';

function PropertyDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = (specialRequests: string) => {
    // Create booking with special requests
    console.log('Special requests:', specialRequests);
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Book Now
      </Button>

      <BookingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        property={{
          id: 'property-123',
          title: 'Modern Apartment',
          location: 'Dar es Salaam',
          images: ['image1.jpg'],
          property_type: 'apartment',
          price: 500000
        }}
        bookingData={{
          checkIn: new Date('2025-01-01'),
          checkOut: new Date('2025-02-01'),
          months: 1,
          subtotal: 500000,
          serviceFee: 50000,
          totalAmount: 550000
        }}
        guestInfo={{
          id: 'user-123',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+255123456789'
        }}
        onConfirm={handleConfirm}
        isLoading={false}
      />
    </>
  );
}
```

### With BookingForm Integration

```tsx
import { BookingForm } from '@/components/bookings';

function PropertyDetail() {
  const handleConfirmBooking = (bookingData, specialRequests) => {
    // Create booking in database
    createBooking({
      ...bookingData,
      special_requests: specialRequests
    });
  };

  return (
    <BookingForm
      propertyId={property.id}
      pricePerMonth={property.price}
      property={{
        id: property.id,
        title: property.title,
        location: property.location,
        images: property.images,
        property_type: property.property_type,
        price: property.price
      }}
      guestInfo={{
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone
      }}
      onConfirmBooking={handleConfirmBooking}
      isLoading={isCreatingBooking}
    />
  );
}
```

## Validation

### Terms Agreement
- User must check the terms and conditions checkbox
- "Confirm Booking" button is disabled until checked
- Warning message displayed if not checked

### Required Fields
- All booking data must be present
- Guest information is pre-filled (cannot be empty)
- Special requests are optional

## Styling

### Design Features
- Gradient backgrounds for visual hierarchy
- Icons for each section
- Color-coded information (primary, blue, yellow, red)
- Responsive layout
- Smooth animations
- Accessible focus states

### Responsive Behavior
- Max width: 2xl (672px)
- Max height: 90vh with scroll
- Mobile-friendly layout
- Touch-friendly buttons

## Bilingual Support

Fully supports English and Swahili:
- All labels and text
- Date formatting
- Currency formatting
- Error messages
- Button text

## Accessibility

- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels
- Semantic HTML
- Color contrast compliance

## State Management

### Internal State
- `specialRequests` - Textarea content
- `agreedToTerms` - Checkbox state

### External State
- `open` - Modal visibility (controlled by parent)
- `isLoading` - Loading state during submission

## Events

### onConfirm
Called when user clicks "Confirm Booking" button:
- Passes `specialRequests` string to parent
- Only called if terms are agreed
- Parent handles actual booking creation

### onOpenChange
Called when modal should open/close:
- User clicks Cancel button
- User clicks outside modal
- User presses Escape key

## Error Handling

### Validation Errors
- Terms not agreed: Shows warning message
- Missing data: Button disabled

### Loading State
- Disables all buttons
- Shows loading spinner
- Prevents double submission

## Best Practices

1. **Always validate data** before opening modal
2. **Pre-fill guest information** from user profile
3. **Handle loading states** properly
4. **Show success message** after booking creation
5. **Close modal** after successful booking
6. **Handle errors** gracefully
7. **Provide feedback** to user

## Example Flow

1. User selects dates in BookingForm
2. User clicks "Book Now" button
3. BookingModal opens with all details
4. User reviews information
5. User adds special requests (optional)
6. User agrees to terms
7. User clicks "Confirm Booking"
8. Parent component creates booking
9. Modal closes on success
10. User sees success message

## Testing

### Test Cases
- [ ] Modal opens when triggered
- [ ] All property details display correctly
- [ ] Booking dates display correctly
- [ ] Price calculations are accurate
- [ ] Guest information displays correctly
- [ ] Special requests textarea works
- [ ] Terms checkbox works
- [ ] Confirm button disabled without terms
- [ ] Cancel button closes modal
- [ ] Loading state works
- [ ] Bilingual support works
- [ ] Responsive on mobile
- [ ] Keyboard navigation works

## Future Enhancements

- [ ] Add payment method selection
- [ ] Add coupon code input
- [ ] Add booking insurance option
- [ ] Add cancellation policy display
- [ ] Add host response time
- [ ] Add instant booking badge
- [ ] Add similar properties suggestion
