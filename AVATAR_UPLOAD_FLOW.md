# Avatar Upload Flow Documentation

## How Avatar Upload Works

### 1. **User Selects Image**
```
User clicks camera icon → File input opens → User selects image file
```

### 2. **Validation**
```javascript
// File type validation
✓ Accepts: JPG, JPEG, PNG, WEBP
✗ Rejects: Other file types

// File size validation
✓ Accepts: Files ≤ 5MB
✗ Rejects: Files > 5MB
```

### 3. **Upload to Supabase Storage**
```javascript
// Location: avatars bucket
// Filename format: {userId}-{timestamp}.{extension}
// Example: 51917144-8fb9-4765-8b54-4c3ddb5bcf7c-1699123456789.jpg

await supabase.storage
  .from('avatars')
  .upload(fileName, file, {
    cacheControl: '3600',
    upsert: true
  });
```

### 4. **Get Public URL**
```javascript
// Supabase generates a public URL for the uploaded file
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(fileName);

// Example URL:
// https://your-project.supabase.co/storage/v1/object/public/avatars/51917144-8fb9-4765-8b54-4c3ddb5bcf7c-1699123456789.jpg
```

### 5. **Update Profile Table**
```javascript
// Save the public URL to the profiles table
await supabase
  .from('profiles')
  .update({ avatar_url: publicUrl })
  .eq('user_id', userId);
```

### 6. **Database Result**
```sql
-- Before upload
SELECT id, name, avatar_url FROM profiles WHERE user_id = '51917144...';
-- Result: avatar_url = NULL

-- After upload
SELECT id, name, avatar_url FROM profiles WHERE user_id = '51917144...';
-- Result: avatar_url = 'https://your-project.supabase.co/storage/v1/object/public/avatars/51917144...-1699123456789.jpg'
```

## Complete Flow Diagram

```
┌─────────────────┐
│  User clicks    │
│  camera icon    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  File input     │
│  opens          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User selects   │
│  image file     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validate file  │
│  type & size    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Delete old     │
│  avatar (if any)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Upload to      │
│  Supabase       │
│  Storage        │
│  (avatars       │
│   bucket)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Get public URL │
│  from Supabase  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Update         │
│  profiles table │
│  avatar_url     │
│  field          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Show success   │
│  notification   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Refresh profile│
│  display        │
└─────────────────┘
```

## Code Implementation

### AvatarUpload Component (`src/components/forms/AvatarUpload.tsx`)

```typescript
const uploadAvatar = async (file: File) => {
  try {
    setUploading(true);

    // Step 1: Delete old avatar if exists
    if (currentAvatarUrl) {
      const oldFileName = currentAvatarUrl.split('/').pop();
      if (oldFileName && oldFileName.startsWith(userId)) {
        await supabase.storage
          .from('avatars')
          .remove([oldFileName]);
      }
    }

    // Step 2: Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    // Step 3: Upload to Supabase Storage (avatars bucket)
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Step 4: Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Step 5: Update profile table with avatar_url
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', userId);

    if (updateError) throw updateError;

    // Step 6: Notify success
    onUploadSuccess(publicUrl);
    toast({ title: 'Success!', description: 'Avatar uploaded' });
    
  } catch (error) {
    console.error('Error uploading avatar:', error);
    toast({ variant: 'destructive', title: 'Error', description: 'Upload failed' });
  } finally {
    setUploading(false);
  }
};
```

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  phone TEXT,
  avatar_url TEXT,  -- ← This field stores the Supabase Storage URL
  bio TEXT,
  location TEXT,
  is_host BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Storage Bucket
```sql
-- Bucket: avatars
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp
```

## Testing the Flow

1. **Go to Profile Page**: Navigate to `/profile`
2. **Click Camera Icon**: On the avatar
3. **Select Image**: Choose a JPG, PNG, or WEBP file (max 5MB)
4. **Wait for Upload**: See spinner overlay
5. **Verify Success**: 
   - Toast notification appears
   - Avatar updates immediately
   - Check database: `SELECT avatar_url FROM profiles WHERE user_id = 'your-id'`
   - Check storage: Visit the URL in `avatar_url` field

## Features

✅ **Automatic cleanup** - Deletes old avatar before uploading new one
✅ **Unique filenames** - Prevents conflicts with timestamp
✅ **Validation** - File type and size checks
✅ **Error handling** - User-friendly error messages
✅ **Loading states** - Visual feedback during upload
✅ **Database sync** - Automatically updates profile table
✅ **Public URLs** - Images are publicly accessible
✅ **Cache control** - Optimized for performance

## Security Considerations

1. **File validation** - Only images allowed
2. **Size limits** - Max 5MB to prevent abuse
3. **User authentication** - Must be logged in
4. **RLS policies** - Supabase Row Level Security protects data
5. **Unique filenames** - User ID prefix prevents conflicts

## Troubleshooting

### Avatar not showing after upload?
- Check browser console for errors
- Verify `avatars` bucket exists and is public
- Check RLS policies on profiles table
- Verify user is authenticated

### Upload fails?
- Check file size (must be ≤ 5MB)
- Check file type (must be JPG, PNG, or WEBP)
- Check Supabase storage quota
- Check network connection

### Old avatar not deleted?
- Check if filename starts with user ID
- Verify storage permissions
- Check browser console for errors
