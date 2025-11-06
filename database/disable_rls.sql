-- Disable Row Level Security (RLS) for custom JWT authentication
-- Since we're using our own JWT authentication (not Supabase Auth),
-- we need to disable RLS and handle permissions in the backend

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;

-- Drop all RLS policies (they won't work with custom auth)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view approved activities" ON activities;
DROP POLICY IF EXISTS "Organizers can view their own activities" ON activities;
DROP POLICY IF EXISTS "Admins can view all activities" ON activities;
DROP POLICY IF EXISTS "Organizers can create activities" ON activities;
DROP POLICY IF EXISTS "Organizers can update their own activities" ON activities;
DROP POLICY IF EXISTS "Admins can approve/reject activities" ON activities;
DROP POLICY IF EXISTS "Users can view their own registrations" ON registrations;
DROP POLICY IF EXISTS "Organizers can view registrations for their activities" ON registrations;
DROP POLICY IF EXISTS "Students can register for activities" ON registrations;
DROP POLICY IF EXISTS "Users can cancel their own registrations" ON registrations;
DROP POLICY IF EXISTS "Anyone can view activity events" ON activity_events;
DROP POLICY IF EXISTS "Organizers and admins can manage events for their activities" ON activity_events;
DROP POLICY IF EXISTS "Users can view their own attendance" ON attendance;
DROP POLICY IF EXISTS "Organizers can view attendance for their activities" ON attendance;
DROP POLICY IF EXISTS "Admins can view all attendance" ON attendance;
DROP POLICY IF EXISTS "Users can check in to events they're registered for" ON attendance;

-- Verify RLS is disabled
SELECT 
    tablename,
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'activities', 'registrations', 'activity_events', 'attendance');

-- This should show rowsecurity = false for all tables
