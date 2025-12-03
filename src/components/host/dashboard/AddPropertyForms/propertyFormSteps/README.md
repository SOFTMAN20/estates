# Property Form Steps - Modular Components

A collection of modular, reusable components for the multi-step property form. Each component has a single responsibility and can be maintained independently.

## 🎯 Architecture

The PropertyForm has been refactored into smaller, focused components following the Single Responsibility Principle:

```
PropertyForm (Main Container)
├── StepNavigation (Progress & Step Indicators)
├── Step1BasicInfo (Property Name, Price, Location)
├── Step2PropertyDetails (Type, Rooms, Description, Amenities)
├── Step3ContactInfo (Phone Numbers, Address)
├── Step4PhotoUpload (Image Upload)
└── FormNavigationButtons (Previous, Next, Submit)
```

## 📦 Components

### 1. Step1BasicInfo

**Responsibility:** Handle basic property information input

**Props:**
```typescript
{
  formData: {
    title: string;
    price: string;
    price_period: string;
    location: string;
  };
  onInputChange: (field: string, value: unknown) => void;
  isValid: boolean;
}
```

**Features:**
- Property name input with validation
- Price input with period selector (using PriceInput component)
- Location input
- Real-time validation feedback
- Progress indicator

---

### 2. Step2PropertyDetails

**Responsibility:** Handle detailed property specifications

**Props:**
```typescript
{
  formData: {
    property_type: string;
    bedrooms: string;
    bathrooms: string;
    square_meters: string;
    description: string;
    amenities: string[];
    nearby_services: string[];
  };
  onInputChange: (field: string, value: unknown) => void;
  onAmenityToggle: (amenity: string) => void;
  onServiceToggle: (service: string) => void;
  isValid: boolean;
}
```

**Features:**
- Property type selector (Apartment, House, Studio, etc.)
- Room counters (bedrooms, bathrooms, square meters)
- Description textarea
- Amenities selector (Electricity, Water, WiFi, etc.)
- Nearby services selector
- Progress indicator

---

### 3. Step3ContactInfo

**Responsibility:** Handle contact details input

**Props:**
```typescript
{
  formData: {
    contact_phone: string;
    contact_whatsapp_phone: string;
    full_address: string;
  };
  onInputChange: (field: string, value: unknown) => void;
  isValid: boolean;
}
```

**Features:**
- Contact phone input (required)
- WhatsApp phone input (optional)
- Full address input (optional)
- Validation feedback
- Progress indicator

---

### 4. Step4PhotoUpload

**Responsibility:** Handle image upload and management

**Props:**
```typescript
{
  images: string[];
  onImagesChange: (images: string[]) => void;
  isValid: boolean;
}
```

**Features:**
- Image upload component integration
- Photo tips and guidelines
- Minimum 3 images validation
- Progress indicator

---

### 5. StepNavigation

**Responsibility:** Handle step navigation UI

**Props:**
```typescript
{
  currentStep: number;
  totalSteps: number;
  progress: number;
  steps: Step[];
  isStepValid: (step: number) => boolean;
  onStepClick: (step: number) => void;
}
```

**Features:**
- Desktop: Visual step indicators with icons
- Mobile: Compact progress bar
- Completed step indicators
- Clickable step navigation
- Responsive design

---

### 6. FormNavigationButtons

**Responsibility:** Handle form navigation actions

**Props:**
```typescript
{
  currentStep: number;
  totalSteps: number;
  progress: number;
  submitting: boolean;
  editingProperty: boolean;
  isStepValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}
```

**Features:**
- Previous/Cancel button
- Next/Submit button
- Loading states
- Progress indicator
- Responsive layout (mobile/desktop)

---

## 🔧 Usage

### Import Components

```typescript
import {
  Step1BasicInfo,
  Step2PropertyDetails,
  Step3ContactInfo,
  Step4PhotoUpload,
  StepNavigation,
  FormNavigationButtons
} from '@/components/forms/propertyFormSteps';
```

### Use in PropertyForm

```typescript
// Render current step
const renderCurrentStep = () => {
  switch (currentStep) {
    case 1:
      return (
        <Step1BasicInfo
          formData={formData}
          onInputChange={onInputChange}
          isValid={isStepValid(1)}
        />
      );
    case 2:
      return (
        <Step2PropertyDetails
          formData={formData}
          onInputChange={onInputChange}
          onAmenityToggle={onAmenityToggle}
          onServiceToggle={onServiceToggle}
          isValid={isStepValid(2)}
        />
      );
    // ... other steps
  }
};
```

---

## ✨ Benefits

### 1. **Modularity**
- Each step is a separate component
- Easy to add/remove/reorder steps
- Independent testing possible

### 2. **Maintainability**
- Single responsibility per component
- Clear separation of concerns
- Easy to locate and fix bugs

### 3. **Reusability**
- Components can be reused in other forms
- Consistent UI across the application
- Shared validation logic

### 4. **Scalability**
- Easy to add new steps
- Simple to extend functionality
- Clear component boundaries

### 5. **Testability**
- Each component can be tested independently
- Mock props easily
- Isolated unit tests

---

## 🎨 Styling

All components use:
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** icons
- Consistent color schemes
- Responsive design patterns

---

## 📱 Responsive Design

- **Mobile**: Stacked layout, compact navigation
- **Tablet**: Optimized spacing
- **Desktop**: Full step navigation, side-by-side layouts

---

## ♿ Accessibility

All components include:
- Proper ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support
- Semantic HTML

---

## 🔄 State Management

State is managed in the parent PropertyForm component and passed down as props:
- **Unidirectional data flow**
- **Props drilling** (can be optimized with Context if needed)
- **Clear data ownership**

---

## 🚀 Future Improvements

Potential enhancements:
1. Add React Context to avoid props drilling
2. Add form validation library (e.g., Zod, Yup)
3. Add animation transitions between steps
4. Add step-specific error handling
5. Add auto-save functionality

---

## 📝 Notes

- All components maintain the original UI and functionality
- No breaking changes to the form behavior
- Backward compatible with existing code
- Easy to migrate back if needed

---

**Built with ❤️ following SOLID principles**
