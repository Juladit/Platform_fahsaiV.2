-- =============================================
-- MFU Activity Board - Complete Database Schema
-- Version: 2.1
-- =============================================
-- Run this SQL in your Supabase SQL Editor to set up the complete database
-- This includes all tables, functions, triggers, and indexes
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin', 'organizer')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'Stores user account information for students, organizers, and admins';
COMMENT ON COLUMN users.avatar_url IS 'Profile picture URL or base64 encoded image data';

-- =============================================
-- ACTIVITIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50),
    location VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled', 'completed')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Feature enhancements
    is_announcement_only BOOLEAN DEFAULT false,
    registration_start_date TIMESTAMP WITH TIME ZONE,
    registration_end_date TIMESTAMP WITH TIME ZONE,
    external_link TEXT,
    poster_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE activities IS 'Stores university activity and event information';
COMMENT ON COLUMN activities.is_announcement_only IS 'If true, this activity is announcement-only and does not allow registration';
COMMENT ON COLUMN activities.registration_start_date IS 'When registration opens for this activity';
COMMENT ON COLUMN activities.registration_end_date IS 'When registration closes for this activity';
COMMENT ON COLUMN activities.external_link IS 'External link (e.g., Google Forms, registration website)';
COMMENT ON COLUMN activities.poster_url IS 'Base64 encoded image data for activity poster/banner';

-- =============================================
-- REGISTRATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
    registration_status VARCHAR(20) DEFAULT 'registered' CHECK (registration_status IN ('registered', 'cancelled', 'completed', 'pending')),
    
    -- Approval workflow
    requires_approval BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(user_id, activity_id)
);

COMMENT ON TABLE registrations IS 'Stores student activity registrations and approval status';
COMMENT ON COLUMN registrations.requires_approval IS 'If true, registration needs organizer approval before being confirmed';
COMMENT ON COLUMN registrations.approved_by IS 'User ID of organizer/admin who approved the registration';

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) NOT NULL,
    related_activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE notifications IS 'System notifications for activity reminders, approvals, and announcements';
COMMENT ON COLUMN notifications.type IS 'Notification type: activity_reminder, registration_approved, registration_cancelled, new_activity, announcement';

-- =============================================
-- INDEXES for better performance
-- =============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Activities indexes
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_start_date ON activities(start_date);
CREATE INDEX IF NOT EXISTS idx_activities_created_by ON activities(created_by);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);

-- Registrations indexes
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_activity_id ON registrations(activity_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(registration_status);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for activities table
DROP TRIGGER IF EXISTS update_activities_updated_at ON activities;
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update participant count
CREATE OR REPLACE FUNCTION update_activity_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.registration_status = 'registered' THEN
        UPDATE activities 
        SET current_participants = current_participants + 1 
        WHERE id = NEW.activity_id;
    ELSIF TG_OP = 'DELETE' AND OLD.registration_status = 'registered' THEN
        UPDATE activities 
        SET current_participants = GREATEST(current_participants - 1, 0)
        WHERE id = OLD.activity_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.registration_status = 'registered' AND NEW.registration_status != 'registered' THEN
            UPDATE activities 
            SET current_participants = GREATEST(current_participants - 1, 0)
            WHERE id = NEW.activity_id;
        ELSIF OLD.registration_status != 'registered' AND NEW.registration_status = 'registered' THEN
            UPDATE activities 
            SET current_participants = current_participants + 1 
            WHERE id = NEW.activity_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating participant count
DROP TRIGGER IF EXISTS update_participant_count ON registrations;
CREATE TRIGGER update_participant_count
    AFTER INSERT OR UPDATE OR DELETE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_activity_participant_count();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
-- Note: RLS policies are disabled by default for development
-- To enable RLS, run the disable_rls.sql script or uncomment below

/*
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Activities policies
CREATE POLICY "Anyone can view activities" ON activities FOR SELECT USING (status != 'cancelled');
CREATE POLICY "Organizers can manage activities" ON activities FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('admin', 'organizer'))
);

-- Registrations policies
CREATE POLICY "Users can view own registrations" ON registrations FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can create own registrations" ON registrations FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id::text);
*/

-- =============================================
-- INITIAL ADMIN ACCOUNT
-- =============================================
-- Creates a default admin account for first-time setup
-- Username: admin
-- Password: admin123
-- IMPORTANT: Change this password immediately after first login!

INSERT INTO users (username, email, password_hash, first_name, last_name, role)
VALUES (
    'admin',
    'admin@mfu.ac.th',
    '$2b$10$HXfLMs6kYPgOjYg06a7mOOZ3iBVzx48z/EVL7mV3L/hz5l/Wf3YIS',
    'System',
    'Administrator',
    'admin'
) ON CONFLICT (username) DO NOTHING;

-- =============================================
-- VERIFICATION
-- =============================================
-- Check if all tables were created successfully
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name IN ('users', 'activities', 'registrations', 'notifications')
ORDER BY table_name;
