---
inclusion: manual
---

# i18n Translation Management Guide

## Overview
This guide helps you manage translations for the NyumbaLink application. Translation files are located in `src/data/i18n/locales/`.

## Translation Files Structure
- **English**: `src/data/i18n/locales/en.json`
- **Swahili**: `src/data/i18n/locales/sw.json`

## When Adding New Translations

### Step 1: Identify Hardcoded Text
Look for hardcoded text in components that should be translated:
```tsx
// ❌ Bad - Hardcoded text
<h1>Nyumba Zangu</h1>

// ✅ Good - Using translation
<h1>{t('dashboard.myProperties')}</h1>
```

### Step 2: Choose Appropriate Translation Key
Use a hierarchical naming convention:
- `section.subsection.key`
- Examples:
  - `dashboard.myProperties`
  - `auth.signIn`
  - `common.save`
  - `propertyCard.perMonth`

### Step 3: Add to Both Translation Files

**English (`en.json`):**
```json
{
  "dashboard": {
    "myProperties": "My Properties",
    "addProperty": "Add Property"
  }
}
```

**Swahili (`sw.json`):**
```json
{
  "dashboard": {
    "myProperties": "Nyumba Zangu",
    "addProperty": "Ongeza Nyumba"
  }
}
```

### Step 4: Update Component
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.myProperties')}</h1>
      <button>{t('dashboard.addProperty')}</button>
    </div>
  );
};
```

## Common Translation Patterns

### Pluralization
```json
{
  "propertyCount_one": "{{count}} house",
  "propertyCount_other": "{{count}} houses"
}
```

Usage:
```tsx
{t('propertyCount', { count: properties.length })}
```

### Variables/Interpolation
```json
{
  "welcome": "Welcome, {{name}}!"
}
```

Usage:
```tsx
{t('welcome', { name: user.name })}
```

### Getting Current Language
```tsx
const { t, i18n } = useTranslation();
const currentLanguage = i18n.language; // 'en' or 'sw'
```

## Translation Checklist

When adding new text to the application:

1. ✅ Check if translation key already exists
2. ✅ Add key to both `en.json` and `sw.json`
3. ✅ Use descriptive, hierarchical key names
4. ✅ Test in both English and Swahili
5. ✅ Ensure proper grammar and context
6. ✅ Use `useTranslation` hook in component
7. ✅ Replace hardcoded text with `t('key')`

## Common Sections

### Navigation
- `navigation.*` - Menu items, links

### Dashboard
- `dashboard.*` - Dashboard-specific text

### Authentication
- `auth.*` - Login, signup, password

### Common
- `common.*` - Buttons, actions (save, cancel, delete, etc.)

### Property
- `propertyCard.*` - Property card text
- `propertyDetail.*` - Property details page

### Forms
- `forms.*` - Form labels, placeholders, validation

## Example: Adding New Translation

**Scenario**: Adding "Delete Property" confirmation dialog

1. **Identify the text**:
   - "Are you sure?"
   - "This action cannot be undone"
   - "Delete"
   - "Cancel"

2. **Choose keys**:
   - `property.deleteConfirmTitle`
   - `property.deleteConfirmMessage`
   - `common.delete`
   - `common.cancel`

3. **Add to en.json**:
```json
{
  "property": {
    "deleteConfirmTitle": "Are you sure?",
    "deleteConfirmMessage": "This action cannot be undone"
  },
  "common": {
    "delete": "Delete",
    "cancel": "Cancel"
  }
}
```

4. **Add to sw.json**:
```json
{
  "property": {
    "deleteConfirmTitle": "Una uhakika?",
    "deleteConfirmMessage": "Hatua hii haiwezi kutenduliwa"
  },
  "common": {
    "delete": "Futa",
    "cancel": "Ghairi"
  }
}
```

5. **Use in component**:
```tsx
<AlertDialog>
  <AlertDialogTitle>{t('property.deleteConfirmTitle')}</AlertDialogTitle>
  <AlertDialogDescription>
    {t('property.deleteConfirmMessage')}
  </AlertDialogDescription>
  <AlertDialogAction>{t('common.delete')}</AlertDialogAction>
  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
</AlertDialog>
```

## Tips

- **Reuse common translations**: Check `common.*` section first
- **Keep keys organized**: Group related translations together
- **Be consistent**: Use same naming patterns across the app
- **Context matters**: Same English word might need different Swahili translations based on context
- **Test both languages**: Always verify translations display correctly

## Quick Reference

**Import translation hook:**
```tsx
import { useTranslation } from 'react-i18next';
const { t, i18n } = useTranslation();
```

**Use translation:**
```tsx
{t('section.key')}
```

**With variables:**
```tsx
{t('section.key', { variable: value })}
```

**Get current language:**
```tsx
i18n.language // 'en' or 'sw'
```

**Change language:**
```tsx
i18n.changeLanguage('sw')
```
