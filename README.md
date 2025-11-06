# Platform Fahsai v2.2# MFU Activity Board



A comprehensive activity management platform for educational institutions, enabling students and organizers to create, manage, and participate in campus activities.Mae Fah Luang University Activity Management Platform



## 🌟 Features## Description



### User ManagementMFU Activity Board is a web-based platform for managing and viewing university activities at Mae Fah Luang University. Students can browse activities, view their calendar, manage registrations, and access their profile.

- **Multi-role System**: Student, Organizer, and Admin roles

- **User Profiles**: Customizable profiles with avatar upload## Features

- **Change Password**: Secure password change with strength validation

- **Authentication**: JWT-based authentication system- **User Authentication**: Secure login system

- **Activity Feed**: Browse and search available activities

### Activity Management- **Calendar View**: Visual calendar with activity dates

- **Create Activities**: Organizers can create various types of activities- **User Profile**: Manage personal information and view activity history

- **Activity Types**: - **Responsive Design**: Works on desktop, tablet, and mobile devices

  - Regular activities with registration

  - Announcement-only activities (no registration)## Project Structure

- **Registration Periods**: Set start and end dates for registration

- **Poster Upload**: Upload activity posters with image preview```

- **External Links**: Add external resources or registration linksPlatform_fahsaiV.2/

- **Filter & Search**: Filter activities by type, status, and date range├── public/                 # Served directory

- **Delete Activities**: Organizers can delete their own activities│   ├── index.html         # Login page

│   ├── dashboard.html     # Activity feed

### Participant Management│   ├── calendar.html      # Calendar view

- **Registration System**: Students can register for activities│   ├── profile.html       # User profile

- **Manage Participants**: Organizers can view and remove participants│   └── src/               # Auto-copied from ../src/

- **Visibility Control**: Events only visible to registered participants├── src/                   # Source files (EDIT THESE)

- **Registration Status**: Track pending/approved registrations│   ├── css/              # Stylesheets

│   │   ├── styles.css

### Notifications│   │   ├── dashboard.css

- **Real-time Notifications**: System-wide notification system│   │   ├── calendar.css

- **Activity Updates**: Get notified about registrations and changes│   │   └── profile.css

- **Mark as Read**: Manage notification status│   └── js/               # JavaScript files

│       ├── script.js

### Dashboard│       ├── dashboard.js

- **Calendar View**: Visual calendar displaying all activities│       ├── calendar.js

- **Statistics**: Overview of activities and registrations│       └── profile.js

- **Quick Access**: Easy navigation to all features├── scripts/              # Build scripts

│   └── copy-files.js    # Copies src to public/src

## 🛠️ Tech Stack├── package.json         # Project dependencies and scripts

├── .gitignore          # Git ignore rules

### Frontend├── README.md           # This file

- HTML5, CSS3, JavaScript (Vanilla)└── PROJECT_STRUCTURE.md # Detailed structure documentation

- Font Awesome icons```

- Responsive design

**Note:** Edit files in `src/` directory. The `public/src/` folder is auto-generated.

### Backend

- Node.js with Express## Installation

- JWT authentication

- Bcrypt password hashing1. **Clone or download the repository**

- Multer for file uploads (Base64 encoding)

2. **Install dependencies**:

### Database   ```bash

- Supabase (PostgreSQL)   npm install

- Row Level Security policies   ```

- Database triggers and functions

## Usage

## 📋 Prerequisites

### Development Mode

- Node.js (v14 or higher)

- npm or yarnStart the development server:

- Supabase account

- Git```bash

npm start

## 🚀 Installation```



### 1. Clone the RepositoryThis will start a live server on `http://localhost:3000` and automatically open the application in your default browser.



```bash### Available Scripts

git clone <repository-url>

cd Platform_fahsaiV.2- `npm start` - Start the development server (alias for `npm run dev`)

```- `npm run dev` - Copy source files and start live-server for development

- `npm run copy` - Copy src files to public/src directory

### 2. Install Dependencies- `npm run build` - Prepare files for production

- `npm run clean` - Remove auto-generated files from public/src

```bash

npm install## Technologies Used

```

- **HTML5**: Structure and content

### 3. Configure Environment Variables- **CSS3**: Styling with modern features (Flexbox, Grid)

- **Vanilla JavaScript**: Interactive functionality

Create a `.env` file in the root directory:- **Font Awesome**: Icon library

- **Google Fonts (Inter)**: Typography

```env- **Live Server**: Development server

# Server Configuration

PORT=3000## Browser Support



# Supabase Configuration- Chrome (latest)

SUPABASE_URL=your_supabase_url- Firefox (latest)

SUPABASE_SERVICE_KEY=your_supabase_service_key- Safari (latest)

- Edge (latest)

# JWT Secret

JWT_SECRET=your_jwt_secret_key## Login

```

For demonstration purposes, you can log in with any username and password. The authentication is currently simulated for development.

**Important**: Replace the placeholder values with your actual Supabase credentials and a secure JWT secret.

## Pages

### 4. Set Up Database

1. **Login Page** (`index.html`): User authentication

Run the database schema setup:2. **Dashboard** (`dashboard.html`): View all available activities

3. **Calendar** (`calendar.html`): Visual calendar with activity markers

```sql4. **Profile** (`profile.html`): User profile management

-- Execute the complete schema file in your Supabase SQL Editor

-- File: database/complete_schema.sql## Development Notes

```

- The project uses a modern file-based structure with separation of source and served files

This will create:- Source files are in `src/` directory - **always edit these**

- All required tables (users, activities, registrations, notifications)- The `public/src/` directory is auto-generated - **never edit directly**

- Indexes for performance- All dependencies are loaded via CDN for Font Awesome and Google Fonts

- Triggers for automatic timestamps- The project is configured with npm for an improved development workflow

- Default admin account- Live reload is enabled during development for instant feedback



**Default Admin Credentials**:## Important Files

- Username: `admin`

- Password: `admin123`- **Edit in `src/`**: All CSS and JavaScript source files

- **Edit in `public/`**: All HTML files

⚠️ **Security Notice**: Change the default admin password immediately after first login!- **Don't edit**: Files in `public/src/` (auto-generated)

- **Package management**: Use `npm install` to install dependencies

### 5. Development Setup (Optional)

For detailed information about the project structure, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

To disable Row Level Security during development:

## Contributing

```sql

-- Execute in Supabase SQL EditorThis is a university project. For any suggestions or improvements, please contact the development team.

-- File: database/disable_rls.sql

```## License



To reset database while keeping admin account:ISC



```sql## Version

-- Execute in Supabase SQL Editor

-- File: database/clear_database_keep_admin.sql2.1.0

```

---

## 🏃 Running the Application

**Mae Fah Luang University**

### Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
Platform_fahsaiV.2/
├── server/
│   ├── config/
│   │   └── database.js          # Supabase configuration
│   ├── controllers/
│   │   ├── activity.controller.js
│   │   ├── auth.controller.js
│   │   ├── notification.controller.js
│   │   ├── registration.controller.js
│   │   └── user.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification
│   │   └── role.middleware.js   # Role-based access
│   ├── routes/
│   │   ├── activity.routes.js
│   │   ├── auth.routes.js
│   │   ├── notification.routes.js
│   │   ├── registration.routes.js
│   │   └── user.routes.js
│   └── server.js                # Express server setup
├── public/
│   ├── activity-details.html
│   ├── activity-details.js
│   ├── calendar.html
│   ├── calendar.js
│   ├── calendar.css
│   ├── create_logo.html
│   ├── dashboard.html
│   ├── dashboard.js
│   ├── dashboard.css
│   ├── index.html               # Login page
│   ├── profile.html
│   ├── profile.js
│   ├── profile.css
│   ├── script.js                # Auth scripts
│   └── styles.css
├── database/
│   ├── complete_schema.sql      # Full database schema
│   ├── disable_rls.sql          # Disable RLS for dev
│   └── clear_database_keep_admin.sql
├── .env                         # Environment variables (not tracked)
├── .gitignore
├── package.json
└── README.md
```

## 🔑 User Roles & Permissions

### Student
- Register for activities
- View activity details
- See events they're registered for
- Update profile and password
- Receive notifications

### Organizer
- All student permissions
- Create activities
- Upload posters and add external links
- Manage participants (view/remove)
- Delete own activities
- Set registration periods

### Admin
- All organizer permissions
- View all system activities
- Manage all users (future feature)
- System-wide oversight

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/verify            # Verify JWT token
```

### Users
```
GET    /api/users/profile          # Get user profile
PUT    /api/users/profile          # Update profile
POST   /api/users/change-password  # Change password
PUT    /api/users/avatar           # Update avatar
```

### Activities
```
GET    /api/activities             # Get all activities (with filters)
GET    /api/activities/:id         # Get activity by ID
POST   /api/activities             # Create activity (organizer)
PUT    /api/activities/:id         # Update activity (organizer)
DELETE /api/activities/:id         # Delete activity (organizer)
PUT    /api/activities/:id/poster  # Update poster
```

### Registrations
```
GET    /api/registrations          # Get user registrations
POST   /api/registrations          # Register for activity
GET    /api/registrations/activity/:id  # Get activity registrations (organizer)
DELETE /api/registrations/:id/remove    # Remove participant (organizer)
```

### Notifications
```
GET    /api/notifications          # Get user notifications
PUT    /api/notifications/:id/read # Mark notification as read
```

## 🗄️ Database Schema

### Tables

#### users
- `id` (PK, UUID)
- `username` (unique)
- `password_hash`
- `email` (unique)
- `first_name`
- `last_name`
- `phone`
- `role` (student, organizer, admin)
- `avatar_url` (base64)
- `created_at`
- `updated_at`

#### activities
- `id` (PK, UUID)
- `title`
- `description`
- `type` (activity, event, announcement)
- `start_date`
- `end_date`
- `location`
- `max_participants`
- `is_announcement_only`
- `registration_start_date`
- `registration_end_date`
- `poster_url` (base64)
- `external_link`
- `created_by` (FK → users)
- `created_at`
- `updated_at`

#### registrations
- `id` (PK, UUID)
- `activity_id` (FK → activities)
- `user_id` (FK → users)
- `status` (pending, approved, rejected)
- `registered_at`

#### notifications
- `id` (PK, UUID)
- `user_id` (FK → users)
- `title`
- `message`
- `type`
- `is_read`
- `created_at`

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Middleware for permission control
- **Input Validation**: Server-side validation
- **SQL Injection Prevention**: Parameterized queries via Supabase
- **XSS Protection**: Proper data sanitization

## 🐛 Known Issues & Limitations

- File uploads use Base64 encoding (consider external storage for production)
- Some features pending implementation:
  - Participant approval workflow
  - Event deletion for organizers
  - Contact admin feature

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes.

## 👥 Authors

Platform Fahsai Development Team

## 🙏 Acknowledgments

- Font Awesome for icons
- Supabase for backend infrastructure
- Express.js community

---

**Note**: This is an educational project. For production deployment, consider:
- Moving to cloud storage for images (AWS S3, Cloudinary)
- Implementing proper error tracking (Sentry)
- Adding comprehensive logging
- Setting up CI/CD pipelines
- Implementing rate limiting
- Adding comprehensive testing
