# Platform Fahsai — Frontend (Next.js + TypeScript + Tailwind)

This repository contains a minimal Next.js + React + TypeScript + Tailwind CSS scaffold with a demo `login` page.

## Quick setup (Windows PowerShell)

1. Install dependencies:

```powershell
cd "c:\Users\User\OneDrive - Mae Fah Luang University\เอกสาร\GitHub\Platform_fahsaiV.2"
npm install
```

2. Start the dev server:

```powershell
npm run dev
```

Open http://localhost:3000/login

## What was added

- `package.json`, `tsconfig.json`, Tailwind + PostCSS config
- `styles/globals.css` with Tailwind imports
- `pages/_app.tsx` and `pages/login.tsx` (login UI and simple validation)
- `components/Input.tsx` and `components/Button.tsx` small UI components

## Next steps

- Hook the form up to your real authentication API
- Add unit tests / e2e tests
- Add form libraries (React Hook Form, Zod) if you want stricter validation

If you'd like, I can run the dev server here, or add server-side logic / API routes for authentication.

## Install & run (Windows PowerShell)

Below are exact PowerShell commands you can run locally. Try the Simple install first. If you hit "No matching version found" errors (like earlier), follow the "Explicit latest" steps and the troubleshooting commands.

1) Simple install (uses versions in package.json):

```powershell
cd "C:\Users\User\OneDrive - Mae Fah Luang University\เอกสาร\GitHub\Platform_fahsaiV.2"
npm install
npm run dev
```

2) Explicit (install latest compatible packages) — use this if the simple install fails due to registry/version problems:

```powershell
cd "C:\Users\User\OneDrive - Mae Fah Luang University\เอกสาร\GitHub\Platform_fahsaiV.2"
# runtime deps
npm install next@latest react@latest react-dom@latest

# dev tooling (Tailwind + PostCSS + types)
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest typescript @types/react @types/node

# create Tailwind config (optional but useful)
npx tailwindcss init -p

npm run dev
```

3) Troubleshooting tips (if you see "No matching version found"):

- Check which npm registry you're using:

```powershell
npm config get registry
```

If it is not `https://registry.npmjs.org/` you can point it to the public registry temporarily:

```powershell
npm config set registry https://registry.npmjs.org/
npm cache clean --force
npm install
```

- See what versions of a package npm can see (example for Tailwind):

```powershell
npm view tailwindcss versions --json | Select-String -Pattern "\[|\]" -NotMatch -Context 0,200
```

This will list available versions; if the package/version you requested doesn't exist on the registry, pick a visible version or use `@latest`.

- If your environment uses a private registry or an offline cache (company proxy, Artifactory, Verdaccio), ensure the registry has the requested packages or switch to the public registry while installing.

4) After a successful install

Open http://localhost:3000/login to view the login page.

If you'd like, run the explicit install commands locally and paste any error output here — I'll analyze it and propose the exact fix (for example: updating `package.json` to match available versions or adjusting your registry settings).
