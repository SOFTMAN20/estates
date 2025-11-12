# Form Components Library

A collection of modular, reusable, and maintainable form components built with shadcn/ui and Lucide React icons.

## 🎯 Design Principles

- **Modular**: Each component is self-contained and reusable
- **Accessible**: ARIA labels, keyboard navigation, and screen reader support
- **Responsive**: Mobile-first design with proper breakpoints
- **Type-Safe**: Full TypeScript support with proper interfaces
- **Customizable**: Props for styling, behavior, and content
- **Consistent**: Uses shadcn/ui components and Lucide icons throughout

## 📦 Components

### 1. PriceInput

A price input component with currency prefix and period selector.

**Features:**
- Currency prefix (TZS, USD, etc.)
- Period selector (per day, month, year)
- Validation feedback with checkmark
- Formatted price display
- Accessible and responsive

**Usage:**
```tsx
import PriceInput from '@/components/forms/PriceInput';

<PriceInput
  value={price}
  period={pricePeriod}
  onPriceChange={setPrice}
  onPeriodChange={setPricePeriod}
  label="Rent Price"
  currency="TZS"
  required
  showFeedback
/>
```

**Props:**
- `value: string` - Current price value
- `period: PricePeriod` - Current period ('per_day' | 'per_month' | 'per_year')
- `onPriceChange: (value: string) => void` - Price change callback
- `onPeriodChange: (period: PricePeriod) => void` - Period change callback
- `label?: string` - Label text (default: 'Bei ya Kodi')
- `placeholder?: string` - Placeholder text (default: '800000')
- `currency?: string` - Currency code (default: 'TZS')
- `required?: boolean` - Whether field is required
- `showFeedback?: boolean` - Show validation feedback
- `className?: string` - Custom CSS classes
- `disabled?: boolean` - Disable input

---

### 2. PropertyTypeSelector

A visual card-based selector for property types.

**Features:**
- Card-based selection with icons
- Hover and active states
- Customizable property types
- Accessible keyboard navigation
- Responsive grid layout

**Usage:**
```tsx
import PropertyTypeSelector from '@/components/forms/PropertyTypeSelector';

<PropertyTypeSelector
  value={propertyType}
  onChange={setPropertyType}
  label="Property Type"
  required
/>
```

**Props:**
- `value: string` - Currently selected property type
- `onChange: (value: PropertyType) => void` - Selection change callback
- `label?: string` - Label text (default: 'Aina ya Nyumba')
- `required?: boolean` - Whether field is required
- `options?: PropertyTypeOption[]` - Custom property type options
- `className?: string` - Custom CSS classes
- `disabled?: boolean` - Disable selector

**Default Property Types:**
- Apartment (Ghorofa au flat)
- House (Nyumba kamili)
- Shared Room (Chumba kimoja)
- Studio (Chumba kimoja chenye jiko)
- Bedsitter (Chumba na jiko ndani)

---

### 3. AmenitiesSelector

A multi-select component for property amenities with color-coded cards.

**Features:**
- Multi-select with visual feedback
- Color-coded categories
- Icon representation
- Selection count badge
- Maximum selection limit support

**Usage:**
```tsx
import AmenitiesSelector from '@/components/forms/AmenitiesSelector';

<AmenitiesSelector
  value={amenities}
  onChange={setAmenities}
  label="Property Amenities"
  maxSelections={5}
/>
```

**Props:**
- `value: string[]` - Currently selected amenities
- `onChange: (amenities: string[]) => void` - Selection change callback
- `label?: string` - Label text (default: 'Huduma za Msingi')
- `options?: AmenityOption[]` - Custom amenity options
- `className?: string` - Custom CSS classes
- `disabled?: boolean` - Disable selector
- `maxSelections?: number` - Maximum number of selections

**Default Amenities:**
- Electricity (Umeme) - Yellow
- Water (Maji) - Blue
- Furnished (Samani) - Purple
- Parking (Maegesho) - Green
- Security (Usalama) - Red
- WiFi - Indigo
- AC - Cyan
- TV - Pink

---

### 4. RoomCounter

A counter component for rooms with increment/decrement buttons.

**Features:**
- Increment/decrement buttons
- Direct input support
- Min/max validation
- Icon representation
- Accessible controls

**Usage:**
```tsx
import RoomCounter from '@/components/forms/RoomCounter';
import { Bed } from 'lucide-react';

<RoomCounter
  value={bedrooms}
  onChange={setBedrooms}
  label="Bedrooms"
  icon={Bed}
  min={0}
  max={10}
  helperText="Number of bedrooms"
/>
```

**Props:**
- `value: string | number` - Current count value
- `onChange: (value: string) => void` - Value change callback
- `label: string` - Label text
- `icon: LucideIcon` - Icon component from lucide-react
- `min?: number` - Minimum value (default: 0)
- `max?: number` - Maximum value (default: 20)
- `className?: string` - Custom CSS classes
- `disabled?: boolean` - Disable counter
- `helperText?: string` - Helper text below counter

---

### 5. ImageUpload

An image upload component with drag-and-drop support.

**Features:**
- Drag and drop support
- Multiple image upload
- Image preview
- Delete functionality
- Progress indication

**Usage:**
```tsx
import ImageUpload from '@/components/forms/ImageUpload';

<ImageUpload
  images={images}
  onImagesChange={setImages}
/>
```

---

### 6. AvatarUpload

A specialized component for uploading user avatars.

**Features:**
- Circular preview
- Crop support
- File size validation
- Format validation

**Usage:**
```tsx
import AvatarUpload from '@/components/forms/AvatarUpload';

<AvatarUpload
  currentAvatar={avatarUrl}
  onAvatarChange={setAvatarUrl}
/>
```

---

## 🎨 Styling

All components use:
- **Tailwind CSS** for styling
- **shadcn/ui** components as base
- **Lucide React** for icons
- **CSS transitions** for smooth animations

## ♿ Accessibility

All components include:
- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Screen reader support
- Semantic HTML

## 📱 Responsive Design

Components are mobile-first and include:
- Responsive grid layouts
- Touch-friendly tap targets (min 44x44px)
- Proper spacing on small screens
- Adaptive font sizes

## 🔧 Customization

Each component accepts:
- `className` prop for custom styling
- Custom options/configurations
- Disabled state
- Custom labels and helper text

## 🧪 Testing

Components are designed to be:
- Unit testable
- Integration testable
- E2E testable

## 📚 Best Practices

When using these components:

1. **Always provide labels** for accessibility
2. **Use TypeScript types** for type safety
3. **Handle errors gracefully** with validation
4. **Provide feedback** to users on actions
5. **Keep components controlled** with proper state management
6. **Test on mobile devices** for touch interactions

## 🔄 Updates

To update components:
1. Maintain backward compatibility
2. Update TypeScript interfaces
3. Update documentation
4. Test thoroughly
5. Version appropriately

## 📖 Examples

See `PropertyForm.tsx` for complete implementation examples of all components working together.

## 🤝 Contributing

When adding new form components:
1. Follow the same structure and patterns
2. Use shadcn/ui and Lucide icons
3. Include TypeScript types
4. Add accessibility features
5. Document props and usage
6. Add to this README

---

**Built with ❤️ using shadcn/ui and Lucide React**
