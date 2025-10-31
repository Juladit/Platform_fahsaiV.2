# Project Structure Documentation

## Overview

This project has been restructured to follow modern web development practices with npm workflow support.

## Directory Structure

```
Platform_fahsaiV.2/
│
├── public/                     # Served directory (DO NOT edit files here)
│   ├── index.html             # Login page
│   ├── dashboard.html         # Activity feed page
│   ├── calendar.html          # Calendar view page
│   ├── profile.html           # User profile page
│   └── src/                   # Auto-copied from ../src/ (ignored by git)
│       ├── css/
│       └── js/
│
├── src/                       # SOURCE FILES - Edit these!
│   ├── css/                   # Stylesheets
│   │   ├── styles.css        # Login page styles
│   │   ├── dashboard.css     # Dashboard & shared component styles
│   │   ├── calendar.css      # Calendar-specific styles
│   │   └── profile.css       # Profile page styles
│   │
│   └── js/                    # JavaScript files
│       ├── script.js         # Login page functionality
│       ├── dashboard.js      # Dashboard functionality & shared functions
│       ├── calendar.js       # Calendar functionality
│       └── profile.js        # Profile page functionality
│
├── scripts/                   # Build scripts
│   └── copy-files.js         # Copies src/ to public/src/
│
├── node_modules/             # NPM dependencies (ignored by git)
│
├── package.json              # Project configuration & dependencies
├── package-lock.json         # Locked dependency versions
├── .gitignore               # Git ignore rules
└── README.md                # Project documentation
```

## Important Notes

### What to Edit

**✅ ALWAYS EDIT THESE:**
- Files in `src/css/` - Your stylesheets
- Files in `src/js/` - Your JavaScript files
- Files in `public/*.html` - Your HTML pages

**❌ NEVER EDIT THESE:**
- Files in `public/src/` - Auto-generated, changes will be overwritten
- Files in `node_modules/` - Managed by npm

### How the Structure Works

1. **Source Files (`src/`)**: This is where you edit your CSS and JavaScript
2. **Public Directory (`public/`)**: This is what the web server serves
3. **Auto-Copy Process**: When you run `npm start`, files from `src/` are automatically copied to `public/src/`

### Why This Structure?

- **Organization**: Separates source code from served files
- **Scalability**: Easy to add build steps (minification, transpiling, etc.)
- **Modern Workflow**: Standard practice in modern web development
- **Version Control**: public/src/ is git-ignored since it's auto-generated

## NPM Commands

### Development
```bash
npm start           # Start development server (copies files + starts live-server)
npm run dev         # Same as npm start
npm run copy        # Just copy src files to public (without starting server)
```

### Build
```bash
npm run build       # Prepare files for production
```

### Cleanup
```bash
npm run clean       # Remove auto-generated files from public/src/
```

## Development Workflow

1. **Start the server:**
   ```bash
   npm start
   ```
   This will:
   - Copy your source files to public/src/
   - Start a live server at http://localhost:3000
   - Auto-open your browser

2. **Edit your files:**
   - Edit CSS files in `src/css/`
   - Edit JS files in `src/js/`
   - Edit HTML files in `public/`

3. **See changes:**
   - CSS/JS changes: Refresh your browser
   - HTML changes: Live-server will auto-reload

4. **Adding new files:**
   - New CSS/JS: Add to `src/css/` or `src/js/`
   - Link in HTML using: `<link href="src/css/yourfile.css">`
   - Link in HTML using: `<script src="src/js/yourfile.js"></script>`

## File Paths in HTML

All HTML files reference resources using these patterns:

**CSS:**
```html
<link rel="stylesheet" href="src/css/filename.css">
```

**JavaScript:**
```html
<script src="src/js/filename.js"></script>
```

**Navigation between pages:**
```html
<a href="dashboard.html">Dashboard</a>
<a href="calendar.html">Calendar</a>
<a href="profile.html">Profile</a>
<a href="index.html">Login</a>
```

## Version Control (Git)

The `.gitignore` file excludes:
- `node_modules/` - NPM packages (reinstall with `npm install`)
- `public/src/` - Auto-generated files (regenerate with `npm run copy`)

This keeps your repository clean and only tracks source files.

## Troubleshooting

**Problem: Changes to CSS/JS not showing**
- Solution: Refresh your browser (Ctrl+F5 / Cmd+Shift+R for hard refresh)
- Ensure you're editing files in `src/`, not `public/src/`

**Problem: npm start fails**
- Solution: Make sure you ran `npm install` first
- Check that port 3000 is not in use

**Problem: Files not found (404 errors)**
- Solution: Run `npm run copy` to copy source files to public
- Verify files exist in `src/css/` and `src/js/`

## Future Enhancements

This structure makes it easy to add:
- CSS preprocessors (SASS/LESS)
- JavaScript bundlers (Webpack/Rollup)
- Minification for production
- TypeScript support
- Automated testing
- Deployment scripts

---

**Happy Coding! 🚀**
