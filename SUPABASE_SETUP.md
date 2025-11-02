# 🚀 Supabase Setup Guide

Follow these steps to set up your Supabase database for the MFU Activity Board.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign In"**
3. Sign up using:
   - GitHub account (recommended)
   - Google account
   - Email/password

## Step 2: Create a New Project

1. Once logged in, click **"New Project"**
2. Fill in the project details:
   - **Name**: `mfu-activity-board` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest region to you (e.g., Southeast Asia for Thailand)
   - **Pricing Plan**: Free tier is sufficient for development

3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be provisioned

## Step 3: Get Your API Keys

1. In your project dashboard, click on the **Settings** icon (⚙️) in the sidebar
2. Navigate to **"API"** section
3. You'll see two important keys:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

   **service_role key** (click "Reveal" to see it):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
   ```

4. **Keep these safe!** You'll need them for the `.env` file

## Step 4: Run the Database Schema

1. In your Supabase dashboard, click on the **SQL Editor** icon in the sidebar
2. Click **"New query"**
3. Open the file `database/schema.sql` from your project
4. Copy the entire SQL content
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. You should see: **"Success. No rows returned"**

This will create:
- ✅ `users` table
- ✅ `activities` table
- ✅ `registrations` table
- ✅ Indexes for performance
- ✅ Triggers for automatic updates
- ✅ Row Level Security policies
- ✅ Sample admin user (username: `admin`, password: `admin123`)

## Step 5: Create Storage Bucket for Avatars

1. In Supabase dashboard, click on **Storage** in the sidebar
2. Click **"Create a new bucket"**
3. Fill in:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Check this (so images can be publicly accessed)
4. Click **"Create bucket"**

### Set up storage policies:

1. Click on the `avatars` bucket you just created
2. Go to **Policies** tab
3. Click **"New Policy"**
4. Add these policies:

   **Policy 1 - Public Read Access:**
   - Template: Select **"Allow access to JPG images in a public folder to anonymous users"**
   - Policy name: `Public avatar access`
   - Modify the policy SQL to allow all image types (not just JPG):
     - Change `storage."extension"(name) = 'jpg'` to `storage."extension"(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp')`
   - Click **"Review"** and **"Save policy"**

   **Policy 2 - Authenticated Upload:**
   - Click **"New Policy"** again
   - Template: Select **"Give users access to a folder only to authenticated users"**
   - Policy name: `Authenticated users can upload avatars`
   - This will allow authenticated users to upload files
   - Click **"Review"** and **"Save policy"**

   **Alternative: If you prefer simpler policies, you can:**
   - Skip using templates and click **"Create policy from scratch"**
   - For public read: Set `operation` to `SELECT`, leave `target roles` as `public`, check `WITH CHECK` to `true`
   - For authenticated upload: Set `operation` to `INSERT`, set `target roles` to `authenticated`, check `WITH CHECK` to `auth.role() = 'authenticated'`

## Step 6: Configure Environment Variables

1. In your project root, create a file named `.env`
2. Copy the template from `.env.example`:

```bash
cp .env.example .env
```

3. Open `.env` and fill in your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_public_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (generate a random string)
JWT_SECRET=change_this_to_a_random_secure_string_at_least_32_characters_long

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Generate a JWT Secret:
You can generate a secure random string using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online generator like: https://randomkeygen.com/ (CodeIgniter Encryption Keys section)

## Step 7: Verify Database Tables

1. In Supabase dashboard, click **"Table Editor"** in the sidebar
2. You should see three tables:
   - ✅ **users**
   - ✅ **activities**
   - ✅ **registrations**

3. Click on **users** table
4. You should see one row with username `admin`

## Step 8: Test the API Connection

1. Make sure your `.env` file is configured
2. Start the backend server:

```bash
npm run dev:backend
```

3. You should see:
```
🚀 Server running on: http://localhost:5000
```

4. Test the health endpoint:

Open your browser or use curl:
```bash
curl http://localhost:5000/health
```

You should get:
```json
{
  "success": true,
  "message": "MFU Activity Board API is running",
  "timestamp": "2025-11-01T..."
}
```

5. Test login with the sample admin user:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

You should get a response with a JWT token!

## Step 9: Optional - View Database in Supabase

1. Click **"Database"** in the sidebar
2. Click on any table to view/edit data
3. You can manually add test data here if needed

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env` file exists in project root
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set correctly

### Error: "relation 'users' does not exist"
- Run the schema.sql again in Supabase SQL Editor
- Make sure there were no errors when running the schema

### Error: "Invalid API key"
- Double-check you copied the correct keys from Supabase
- Make sure there are no extra spaces or quotes in `.env`

### Error: "JWT Secret not defined"
- Set `JWT_SECRET` in your `.env` file
- Generate a random secure string (at least 32 characters)

## Next Steps

Once your Supabase is set up:

1. ✅ Start both frontend and backend:
   ```bash
   npm start
   ```

2. ✅ Open http://localhost:3000 in your browser

3. ✅ Try logging in with:
   - Username: `admin`
   - Password: `admin123`

4. ✅ Create your own user account

5. ✅ Start using the application!

## Important Notes

- 🔐 **Change the admin password** after first login
- 🔒 Keep `.env` file secret (never commit to Git)
- 💾 The free tier has limits: 500MB database, 1GB file storage
- 📊 Monitor usage in Supabase dashboard under "Settings" > "Usage"

## Resources

- 📖 [Supabase Documentation](https://supabase.com/docs)
- 🎓 [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- 💬 [Supabase Discord Community](https://discord.supabase.com/)

---

**You're all set! 🎉** Your backend is now connected to Supabase PostgreSQL!
