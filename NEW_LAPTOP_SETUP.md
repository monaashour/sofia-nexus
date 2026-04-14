# Sofia Nexus - New Laptop Complete Setup Guide

Complete setup instructions for a brand new Windows laptop (Windows + Office only).

## Prerequisites Installation (Do First)

### 1. Node.js & npm
This project requires Node.js and npm (Node Package Manager comes bundled with Node.js).

**Download & Install:**
- Go to https://nodejs.org/
- Download the **LTS (Long Term Support)** version (currently v20.x or v22.x)
- Run the installer and follow the default installation steps
- Accept the default paths
- The installer will also install npm automatically

**Verify Installation:**
```bash
node --version
npm --version
```

### 2. Git (Version Control)
Required for managing code and cloning repositories.

**Download & Install:**
- Go to https://git-scm.com/download/win
- Download the Windows installer
- Run the installer and use default settings
- Accept all prompts

**Verify Installation:**
```bash
git --version
```

### 3. Visual Studio Code (Recommended)
A code editor for development.

**Download & Install:**
- Go to https://code.visualstudio.com/
- Download for Windows
- Run the installer and follow prompts
- Optionally install the VS Code extensions we use (see Extensions section below)

### 4. GitHub Authentication (Required for sync across PCs)
Set up Git identity and authentication once on the new laptop.

**Configure Git identity:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

**Choose one authentication method (SSH recommended):**

Option A - SSH key (recommended)
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```
Press Enter to accept defaults. Then copy your public key:
```bash
type $env:USERPROFILE\.ssh\id_ed25519.pub
```
Add that key in GitHub:
- GitHub -> Settings -> SSH and GPG keys -> New SSH key

Test connection:
```bash
ssh -T git@github.com
```

Option B - HTTPS + Personal Access Token (PAT)
- Use your GitHub username with the repository HTTPS URL
- When prompted for password, use a GitHub PAT instead of your account password

---

## Project Setup (After prerequisites are installed)

### One-command bootstrap (recommended for a new PC)
From PowerShell, run this once to clone/update repo and install sync aliases automatically:

```powershell
pwsh -ExecutionPolicy Bypass -File .\scripts\bootstrap-new-pc.ps1 -InstallDeps
```

Optional parameters:
- `-RepoUrl` to use SSH URL or another fork
- `-DestinationPath` to choose where the repo will live
- `-ForceAliasUpdate` to rewrite alias loader block in your profile

### Step 1: Navigate to Project Directory
```bash
cd "path\to\sofia-nexus"
```

If this is a fresh setup, clone from GitHub instead of copying old local files:
```bash
git clone git@github.com:<your-org-or-user>/<your-repo>.git
cd <your-repo>
```

### Step 2: Install All Dependencies
Run this command to install all npm packages (this uses package.json):
```bash
npm install
```

This will install all dependencies listed below.

### Step 3: Verify Setup
```bash
npm run lint
```

### Step 4: Confirm Git remote and branch tracking
```bash
git remote -v
git branch -vv
```

If needed, set upstream:
```bash
git branch --set-upstream-to=origin/main main
```

---

## Daily GitHub Sync Workflow (Use on every PC)

Follow this exact order every time you start or finish work.

### Start of session (pull latest)
```bash
git checkout main
git pull --rebase origin main
npm install
```

### During work
Create a branch for your task:
```bash
git checkout -b feature/<short-name>
```

### End of session (push your work)
```bash
git add .
git commit -m "Describe your change"
git push -u origin feature/<short-name>
```

After merge to `main`, sync local:
```bash
git checkout main
git pull --rebase origin main
```

### If you must switch PCs mid-task
On current PC:
```bash
git add .
git commit -m "WIP: safe checkpoint"
git push
```

On new PC:
```bash
git fetch origin
git checkout <your-branch>
git pull --rebase origin <your-branch>
npm install
```

### Optional one-command PowerShell helper
This repository includes a helper script at `scripts/git-sync.ps1`.

From the project root, use:

```powershell
pwsh -ExecutionPolicy Bypass -File .\scripts\git-sync.ps1 -Action sync-start -InstallDeps
```

```powershell
pwsh -ExecutionPolicy Bypass -File .\scripts\git-sync.ps1 -Action sync-end -Message "Describe your change"
```

```powershell
pwsh -ExecutionPolicy Bypass -File .\scripts\git-sync.ps1 -Action switch-pc-push -Message "WIP: safe checkpoint"
```

```powershell
pwsh -ExecutionPolicy Bypass -File .\scripts\git-sync.ps1 -Action switch-pc-pull -Branch feature/<short-name> -InstallDeps
```

What each action does:
- `sync-start`: checks out `main`, rebases from `origin/main`, optionally runs `npm install`
- `sync-end`: commits current changes (if any) and pushes current branch
- `switch-pc-push`: creates a safe checkpoint commit (if needed) and pushes before device switch
- `switch-pc-pull`: fetches, checks out your branch, rebases it from origin, optionally runs `npm install`

### Optional shell aliases (short commands)
You can add aliases in your PowerShell profile so you can run short commands directly:
- `sync-start`
- `sync-end`
- `sync-switch-push`
- `sync-switch-pull -Branch feature/<short-name>`

One-command install from repo root:
```powershell
pwsh -ExecutionPolicy Bypass -File .\scripts\install-sync-aliases.ps1
```

This writes a loader to your PowerShell profile that imports:
- `scripts/sofia-sync-aliases.ps1`

Profile location on Windows (PowerShell 7):
- `C:\Users\<you>\OneDrive - orange.com\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`

After updating profile, restart terminal (or run `. $PROFILE`).

---

## Project Dependencies

### Runtime Dependencies (Required for application to run)
- **react** (v19.2.4) - UI library
- **react-dom** (v19.2.4) - React DOM rendering
- **lucide-react** (v1.8.0) - Icon library

### Development Dependencies (Required for development)
- **vite** (v8.0.4) - Build tool and dev server
- **@vitejs/plugin-react** (v6.0.1) - React plugin for Vite
- **tailwindcss** (v4.2.2) - CSS framework
- **@tailwindcss/vite** (v4.2.2) - TailwindCSS Vite integration
- **eslint** (v9.39.4) - Code linter
- **@eslint/js** (v9.39.4) - ESLint configuration
- **eslint-plugin-react-hooks** (v7.0.1) - React hooks linting rules
- **eslint-plugin-react-refresh** (v0.5.2) - Fast Refresh linting
- **esbuild** (v0.28.0) - JavaScript bundler
- **globals** (v17.4.0) - Global variables for ESLint
- **@types/react** (v19.2.14) - TypeScript types for React
- **@types/react-dom** (v19.2.3) - TypeScript types for React DOM

---

## Available Commands

Once setup is complete, use these commands:

### Development Server
```bash
npm run dev
```
Starts the development server at http://localhost:5173

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder

### Linting
```bash
npm run lint
```
Checks code for style and quality issues

### Preview Production Build
```bash
npm run preview
```
Previews the production build locally

---

## Optional Recommended Tools

### Extensions for VS Code
Install these in VS Code for better development experience:
- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
- **ESLint** - dbaeumer.vscode-eslint
- **Prettier** - esbenp.prettier-vscode

### Package Managers Alternative
- **npm** (default) - Comes with Node.js
- **yarn** (optional) - Alternative package manager
- **pnpm** (optional) - Fast alternative package manager

---

## Troubleshooting

### "npm command not found"
- Node.js wasn't installed properly
- Restart your terminal or computer
- Verify with `node --version` and `npm --version`

### "Dependencies not installing"
- Delete `node_modules` folder and `package-lock.json`
- Run `npm cache clean --force`
- Run `npm install` again

### "Port 5173 already in use"
- The dev server is already running
- Close the existing process or run on a different port with `npm run dev -- --port 3000`

### "Git not found"
- Restart your terminal after installing Git
- Add Git to PATH if needed during installation

---

## Quick One-Time Setup Summary

For setting up the new laptop **exactly once**:

1. **Install Node.js LTS** from https://nodejs.org
2. **Install Git** from https://git-scm.com
3. **Install VS Code** from https://code.visualstudio.com (optional but recommended)
4. **Set up GitHub auth (SSH or PAT)** on new laptop
5. **Clone project from GitHub** to new laptop
6. **Verify remote and branch tracking** with `git remote -v` and `git branch -vv`
7. **Run `npm install`** to install all dependencies
8. **Run `npm run dev`** to start developing

For every new work session on any PC:
9. **Run `git pull --rebase origin main` before coding**
10. **Commit and push before switching devices**

That's it! You're ready to go.

---

## Project Technology Stack Summary

- **Frontend Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: TailwindCSS 4
- **Icons**: Lucide React
- **Code Quality**: ESLint
- **Language**: JavaScript (with React)

---

Generated: April 14, 2026
