-- ====================================================================
-- Clear Database Script (Keep Admin Only)
-- This script removes all data except the admin account
-- Run this in Supabase SQL Editor
-- ====================================================================

-- Step 1: Delete all registrations
DELETE FROM registrations;

-- Step 2: Delete all activities
DELETE FROM activities;

-- Step 3: Delete all notifications
DELETE FROM notifications;

-- Step 4: Delete all users EXCEPT admin
-- Assuming admin has role = 'admin'
DELETE FROM users WHERE role != 'admin';

-- Optional: Reset the admin user's data if needed
-- UPDATE users 
-- SET 
--     avatar_url = NULL,
--     phone = NULL
-- WHERE role = 'admin';

-- Display remaining users (should only be admin)
SELECT id, username, email, role, first_name, last_name 
FROM users 
WHERE role = 'admin';
