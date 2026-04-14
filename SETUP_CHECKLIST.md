# Sofia Nexus - New Laptop Setup Checklist

Print this or follow along step-by-step for your new Windows laptop setup.

## ☐ Phase 1: System Software (Do FIRST)

- [ ] **Install Node.js LTS**
  - Go to: https://nodejs.org/
  - Download LTS version (v20.x or v22.x)
  - Run installer, use default settings
  - Restart terminal/PowerShell when done
  - Verify: `node --version` and `npm --version`

- [ ] **Install Git**
  - Go to: https://git-scm.com/download/win
  - Download Windows installer
  - Run installer, use default settings
  - Restart terminal/PowerShell when done
  - Verify: `git --version`

- [ ] **Install VS Code (Optional but Recommended)**
  - Go to: https://code.visualstudio.com/
  - Download for Windows
  - Run installer
  - After installation, add recommended extensions (optional)

---

## ☐ Phase 2: Project Setup

- [ ] **Copy project files to new laptop**
  - Clone from git or copy the sofia-nexus folder

- [ ] **Open PowerShell/Terminal**
  - Navigate to project: `cd path\to\sofia-nexus`

- [ ] **Install npm dependencies**
  - Run: `npm install`
  - Wait for installation to complete (2-5 minutes)

- [ ] **Verify everything works**
  - Run: `npm run lint` (should have no errors)

---

## ☐ Phase 3: Start Developing

- [ ] **Start dev server**
  - Run: `npm run dev`
  - Open browser: http://localhost:5173

- [ ] **Start coding!**
  - Edit files in `src/` folder
  - Changes auto-refresh in browser

---

## Quick Reference: Available Commands

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm run lint      # Check code quality
npm run preview   # Preview production build
```

---

## What Gets Installed

**System Software:**
- Node.js (JavaScript runtime)
- npm (package manager - automatic with Node.js)
- Git (version control)
- VS Code (code editor)

**Project Dependencies:**
- React 19 (UI framework)
- Vite 8 (build tool)
- TailwindCSS 4 (styling)
- Lucide React (icons)
- ESLint (code quality)
- And 9 other development tools

---

## Need Help?

See `NEW_LAPTOP_SETUP.md` for:
- Detailed step-by-step instructions
- Troubleshooting guides
- Alternative package managers
- Technology stack overview

---

Total Setup Time: ~15-20 minutes (mostly waiting for npm install)

Good luck with your new laptop! 🚀
