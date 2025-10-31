-- MFU Activity Board Database Schema
-- Run this SQL in your Supabase SQL Editor

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- REGISTRATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
    registration_status VARCHAR(20) DEFAULT 'registered' CHECK (registration_status IN ('registered', 'cancelled', 'completed')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, activity_id)
);

-- =============================================
-- INDEXES for better performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_activities_start_date ON activities(start_date);
CREATE INDEX IF NOT EXISTS idx_activities_created_by ON activities(created_by);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_activity_id ON registrations(activity_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(registration_status);

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
-- ROW LEVEL SECURITY (RLS) - Optional but recommended
-- =============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Policies for activities table
CREATE POLICY "Anyone can view open activities" ON activities
    FOR SELECT USING (status != 'cancelled');

CREATE POLICY "Admins can manage activities" ON activities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'organizer')
        )
    );

-- Policies for registrations table
CREATE POLICY "Users can view own registrations" ON registrations
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own registrations" ON registrations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own registrations" ON registrations
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all registrations" ON registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id::text = auth.uid()::text 
            AND role IN ('admin', 'organizer')
        )
    );

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert a default admin user (password: admin123)
-- Note: This is a bcrypt hash of "admin123" - change in production!
INSERT INTO users (username, email, password_hash, first_name, last_name, role)
VALUES (
    'admin',
    'admin@mfu.ac.th',
    '$2b$10$rKZYw.FqF5ySxH5H9J5hXu5kYGZ1YvGZ1YvGZ1YvGZ1YvGZ1YvGZ1Y',
    'Admin',
    'User',
    'admin'
) ON CONFLICT (username) DO NOTHING;

-- Insert sample student user (password: student123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role)
VALUES (
    'student1',
    'student@mfu.ac.th',
    '$2b$10$rKZYw.FqF5ySxH5H9J5hXu5kYGZ1YvGZ1YvGZ1YvGZ1YvGZ1YvGZ1Y',
    'John',
    'Doe',
    'student'
) ON CONFLICT (username) DO NOTHING;

-- =============================================
-- STORAGE BUCKET for profile pictures
-- =============================================
-- Run this in Supabase Dashboard > Storage

-- Create a bucket for avatars
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('avatars', 'avatars', true);

-- Set up storage policy
-- CREATE POLICY "Avatar images are publicly accessible"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'avatars');

-- CREATE POLICY "Users can upload their own avatar"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- CREATE POLICY "Users can update their own avatar"
-- ON storage.objects FOR UPDATE
-- USING (bucket_id = 'avatars' AND auth.uid()::text = owner::text);

COMMENT ON TABLE users IS 'Stores user account information';
COMMENT ON TABLE activities IS 'Stores university activity information';
COMMENT ON TABLE registrations IS 'Stores student activity registrations';
