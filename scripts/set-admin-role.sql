-- Script to set a user as admin
-- Replace 'user@example.com' with the actual user email

-- Update user role to admin
UPDATE profiles
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@example.com'
);

-- Verify the update
SELECT 
  u.email,
  p.role,
  p.full_name
FROM auth.users u
JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'user@example.com';
