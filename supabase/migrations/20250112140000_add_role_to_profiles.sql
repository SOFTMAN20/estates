-- Migration: Add role column to profiles table
-- Description: Adds role column for admin access control
-- Date: 2025-01-12

-- Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Add index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Add comment to explain the column
COMMENT ON COLUMN profiles.role IS 'User role: user (default) or admin for access control';

-- Update RLS policies to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Update RLS policies to allow admins to update user roles
CREATE POLICY "Admins can update user roles"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
