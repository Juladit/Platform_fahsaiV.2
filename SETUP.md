# Platform Fahsai - Detailed Setup Guide

This guide provides step-by-step instructions for setting up the Platform Fahsai application from scratch.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js (v14 or higher) installed
- [ ] npm package manager
- [ ] Git installed
- [ ] A Supabase account (free tier is sufficient)
- [ ] A code editor (VS Code recommended)

## Step 1: Clone and Install

### 1.1 Clone the Repository

```bash
git clone <repository-url>
cd Platform_fahsaiV.2
```

### 1.2 Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express (web framework)
- Supabase client (@supabase/supabase-js)
- JWT for authentication (jsonwebtoken)
- Bcrypt for password hashing
- Other utilities

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: Platform Fahsai (or your choice)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to you
5. Click "Create new project" and wait for setup to complete

### 2.2 Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **Service Role Key** (under "Project API keys", click to reveal)

⚠️ **Important**: Use the **service_role** key, NOT the anon/public key. The service role key bypasses Row Level Security which we've disabled for this application.

### 2.3 Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Open the file `database/complete_schema.sql` from your local project
4. Copy ALL contents and paste into the Supabase SQL editor
5. Click "Run" or press `Ctrl+Enter`
6. Wait for execution to complete (should see "Success" message)

### 2.4 Verify Database Setup

Run this query in the SQL Editor to verify:

```sql
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'activities', COUNT(*) FROM activities
UNION ALL
SELECT 'registrations', COUNT(*) FROM registrations
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;
```

You should see:
- users: 1 (the admin user)
- activities: 0
- registrations: 0
- notifications: 0

## Step 3: Configure Environment

### 3.1 Create .env File

```bash
# On Windows PowerShell
Copy-Item .env.example .env

# On Mac/Linux
cp .env.example .env
```

### 3.2 Edit .env File

Open `.env` in your code editor and fill in:

```env
PORT=3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here

JWT_SECRET=your_generated_secret_here
```

### 3.3 Generate JWT Secret

Generate a secure random secret:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Using OpenSSL (Mac/Linux)
openssl rand -base64 32

# Option 3: Online generator
# Visit: https://randomkeygen.com/ and use "Fort Knox Passwords"
```

Copy the generated string and paste it as your `JWT_SECRET` value.

## Step 4: Start the Application

### 4.1 Start the Server

```bash
npm start
```

You should see:

```
Server is running on port 3000
Database connected successfully
```

If you see any errors:
- Check your `.env` file has correct values
- Verify Supabase credentials are correct
- Ensure database schema was run successfully

### 4.2 Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## Step 5: First Login

### 5.1 Login with Default Admin

Use these default credentials:
- **Username**: `admin`
- **Password**: `admin123`

### 5.2 Change Admin Password

⚠️ **CRITICAL SECURITY STEP**

1. Click on the profile icon (top right)
2. Go to "Profile"
3. Scroll to "Change Password" section
4. Enter:
   - Current Password: `admin123`
   - New Password: (choose a strong password)
   - Confirm Password: (repeat new password)
5. Click "Change Password"

### 5.3 Create Test Users (Optional)

To test different roles:

1. Log out from admin
2. Click "Sign up here" on login page
3. Create accounts with different roles:
   - Student account for testing activity registration
   - Organizer account for testing activity creation

## Step 6: Test the Application

### 6.1 Test as Organizer

1. Login with organizer account (or admin)
2. Go to "Calendar" → "Create Activity"
3. Fill in activity details:
   - Title, description, dates
   - Upload a poster image
   - Add external link (optional)
4. Click "Create Activity"
5. Verify activity appears in calendar

### 6.2 Test as Student

1. Login with student account
2. Navigate to calendar
3. Click on an activity
4. Click "Register" button
5. Verify registration success

### 6.3 Test Participant Management

1. Login as the activity organizer
2. Click on your created activity
3. Click "Manage Participants" button
4. Verify registered students appear
5. Test removing a participant (optional)

## Troubleshooting

### Common Issues

#### "Database connected successfully" but login fails

**Solution**: Verify the admin user was created:

```sql
SELECT * FROM users WHERE username = 'admin';
```

If no results, re-run the `complete_schema.sql` file.

#### "Invalid credentials" error

**Possible causes**:
1. Wrong username/password
2. Admin user not created in database
3. Bcrypt hashing issue

**Solution**: Reset admin password in Supabase SQL Editor:

```sql
UPDATE users 
SET password_hash = '$2b$10$YourBcryptHashHere'
WHERE username = 'admin';
```

Or re-run `complete_schema.sql`.

#### Port 3000 already in use

**Solution**: Change the PORT in `.env` file:

```env
PORT=3001
```

Then access at `http://localhost:3001`

#### Cannot upload images

**Issue**: File size too large or format not supported

**Solution**: 
- Ensure images are < 2MB
- Use JPG, PNG, or GIF formats
- Check browser console for specific errors

### Database Reset

If you need to start fresh (WARNING: Deletes all data except admin):

1. Open Supabase SQL Editor
2. Run `database/clear_database_keep_admin.sql`
3. Verify with: `SELECT COUNT(*) FROM users;` (should be 1)

### Disable Row Level Security (Development Only)

If you encounter permission errors:

1. Open Supabase SQL Editor
2. Run `database/disable_rls.sql`
3. This disables RLS on all tables for easier development

⚠️ **Never disable RLS in production!**

## Development Tips

### Hot Reload

For development with auto-restart on file changes:

```bash
npm install -g nodemon
nodemon server/server.js
```

### View Server Logs

All console logs appear in your terminal where you ran `npm start`.

Watch for:
- API request logs
- Database query results
- Error messages

### API Testing

Use tools like:
- **Postman**: Import endpoints from README.md
- **Thunder Client** (VS Code extension)
- **Browser DevTools**: Network tab shows all requests

### Code Structure

```
server/
  ├── config/       # Database configuration
  ├── controllers/  # Business logic
  ├── middleware/   # Auth & role checks
  └── routes/       # API endpoints

public/
  ├── *.html        # Page templates
  ├── *.js          # Frontend logic
  └── *.css         # Styling
```

## Next Steps

After successful setup:

1. ✅ Explore the dashboard
2. ✅ Create sample activities
3. ✅ Test registration flow
4. ✅ Try all user roles (student, organizer, admin)
5. ✅ Review the API documentation in README.md
6. ✅ Customize styling in CSS files

## Production Deployment

For production deployment, consider:

1. **Environment**:
   - Use production-grade hosting (Heroku, DigitalOcean, AWS)
   - Set `NODE_ENV=production`
   - Use strong JWT secret

2. **Security**:
   - Enable HTTPS
   - Add rate limiting
   - Implement CORS properly
   - Review and enable Supabase RLS policies

3. **Performance**:
   - Use external image storage (AWS S3, Cloudinary)
   - Add Redis caching
   - Enable database connection pooling

4. **Monitoring**:
   - Add error tracking (Sentry)
   - Implement logging (Winston, Morgan)
   - Set up uptime monitoring

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the README.md for API documentation
3. Check Supabase dashboard for database errors
4. Review browser console for frontend errors

## License

Educational project - see LICENSE file for details.
