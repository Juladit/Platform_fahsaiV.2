# MFU Activity Board

Mae Fah Luang University Activity Management Platform

## Description

MFU Activity Board is a web-based platform for managing and viewing university activities at Mae Fah Luang University. Students can browse activities, view their calendar, manage registrations, and access their profile.

## Features

- **User Authentication**: Secure login system
- **Activity Feed**: Browse and search available activities
- **Calendar View**: Visual calendar with activity dates
- **User Profile**: Manage personal information and view activity history
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Project Structure

```
Platform_fahsaiV.2/
├── public/                 # Served directory
│   ├── index.html         # Login page
│   ├── dashboard.html     # Activity feed
│   ├── calendar.html      # Calendar view
│   ├── profile.html       # User profile
│   └── src/               # Auto-copied from ../src/
├── src/                   # Source files (EDIT THESE)
│   ├── css/              # Stylesheets
│   │   ├── styles.css
│   │   ├── dashboard.css
│   │   ├── calendar.css
│   │   └── profile.css
│   └── js/               # JavaScript files
│       ├── script.js
│       ├── dashboard.js
│       ├── calendar.js
│       └── profile.js
├── scripts/              # Build scripts
│   └── copy-files.js    # Copies src to public/src
├── package.json         # Project dependencies and scripts
├── .gitignore          # Git ignore rules
├── README.md           # This file
└── PROJECT_STRUCTURE.md # Detailed structure documentation
```

**Note:** Edit files in `src/` directory. The `public/src/` folder is auto-generated.

## Installation

1. **Clone or download the repository**

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage

### Development Mode

Start the development server:

```bash
npm start
```

This will start a live server on `http://localhost:3000` and automatically open the application in your default browser.

### Available Scripts

- `npm start` - Start the development server (alias for `npm run dev`)
- `npm run dev` - Copy source files and start live-server for development
- `npm run copy` - Copy src files to public/src directory
- `npm run build` - Prepare files for production
- `npm run clean` - Remove auto-generated files from public/src

## Technologies Used

- **HTML5**: Structure and content
- **CSS3**: Styling with modern features (Flexbox, Grid)
- **Vanilla JavaScript**: Interactive functionality
- **Font Awesome**: Icon library
- **Google Fonts (Inter)**: Typography
- **Live Server**: Development server

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Login

For demonstration purposes, you can log in with any username and password. The authentication is currently simulated for development.

## Pages

1. **Login Page** (`index.html`): User authentication
2. **Dashboard** (`dashboard.html`): View all available activities
3. **Calendar** (`calendar.html`): Visual calendar with activity markers
4. **Profile** (`profile.html`): User profile management

## Development Notes

- The project uses a modern file-based structure with separation of source and served files
- Source files are in `src/` directory - **always edit these**
- The `public/src/` directory is auto-generated - **never edit directly**
- All dependencies are loaded via CDN for Font Awesome and Google Fonts
- The project is configured with npm for an improved development workflow
- Live reload is enabled during development for instant feedback

## Important Files

- **Edit in `src/`**: All CSS and JavaScript source files
- **Edit in `public/`**: All HTML files
- **Don't edit**: Files in `public/src/` (auto-generated)
- **Package management**: Use `npm install` to install dependencies

For detailed information about the project structure, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## Contributing

This is a university project. For any suggestions or improvements, please contact the development team.

## License

ISC

## Version

2.1.0

---

**Mae Fah Luang University**
