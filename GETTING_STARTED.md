# 🚀 LinK Accessibility Platform - Getting Started

Welcome to the LinK Accessibility Platform! This guide will help you set up and run the website from scratch.

## 📋 Quick Start (Like `npm start`)

If you just want to get the website running quickly:

```bash
# 1. First-time setup (only needed once)
npm run setup

# 2. Start the website
npm start
```

That's it! Your website will be available at **http://localhost:8000**

## 🔧 Detailed Setup Process

### Prerequisites

Before starting, make sure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

### Step-by-Step Setup

#### 1. **Project Initialization** (First Time Only)
```bash
npm run setup
```
This command will:
- ✅ Check Node.js and npm versions
- ✅ Install all dependencies (frontend + backend)
- ✅ Build the TypeScript backend
- ✅ Build the React frontend
- ✅ Create required directories
- ✅ Set up environment configuration

#### 2. **Start the Website**
```bash
npm start
# or
npm run dev
```

#### 3. **Access Your Website**
Open your browser and go to:
- **Main Site**: http://localhost:8000
- **Tools Page**: http://localhost:8000/tools
- **Chat Assistant**: http://localhost:8000/chat
- **API Health**: http://localhost:8000/api/health

## 🛠️ Available Commands

### Essential Commands
| Command | Description |
|---------|-------------|
| `npm run setup` | **Initial setup** - Run this first time only |
| `npm start` | **Start the website** - Your main command |
| `npm run stop` | **Stop the website** |
| `npm run restart` | **Restart the website** |

### Development Commands
| Command | Description |
|---------|-------------|
| `npm run build` | Build both frontend and backend |
| `npm run clean` | Clean all build files |
| `npm run logs` | View server logs in real-time |
| `npm test` | Test connectivity |
| `npm run help` | Show all available commands |

### Individual Component Commands
| Command | Description |
|---------|-------------|
| `npm run build:frontend` | Build only React frontend |
| `npm run build:backend` | Build only Node.js backend |
| `npm run install:frontend` | Install only frontend dependencies |
| `npm run install:backend` | Install only backend dependencies |

## 🏗️ Project Architecture

```
LinK Accessibility Platform
├── 🎨 Frontend (React + TypeScript)
│   ├── Built as static files
│   └── Served by backend server
├── ⚙️ Backend (Node.js + Express + TypeScript)
│   ├── API endpoints (/api/*)
│   ├── Serves frontend files
│   └── AI service integrations
└── 🌐 Unified Server (Port 8000)
    ├── Frontend: http://localhost:8000
    └── API: http://localhost:8000/api
```

## 🔍 Troubleshooting

### Common Issues

#### ❌ "Module not found" errors
```bash
# Solution: Run setup again
npm run setup
```

#### ❌ Port 8000 already in use
```bash
# Solution: Stop existing servers
npm run stop
# Then start again
npm start
```

#### ❌ Dependencies not installed
```bash
# Solution: Reinstall dependencies
npm run install:all
```

#### ❌ Build files missing
```bash
# Solution: Rebuild everything
npm run clean
npm run build
npm start
```

### Check System Status
```bash
# Test if everything is working
npm test

# View server logs
npm run logs

# Check what's running on port 8000
netstat -tlnp | grep 8000
```

## 🎯 Development Workflow

### For First-Time Setup:
1. Clone/download the project
2. Run `npm run setup` (one time only)
3. Run `npm start`
4. Open http://localhost:8000

### For Daily Development:
1. `npm start` - Start working
2. Make your changes
3. `npm run restart` - If needed
4. `npm run stop` - When done

### For Building/Deployment:
1. `npm run build` - Build for production
2. `npm start` - Run production build

## 🌟 Features Available

Once the website is running, you can access:

- **🤖 AI Tools**: Image captioning, text-to-speech, OCR
- **💬 Chat Assistant**: Ask accessibility questions
- **🎨 Accessibility Features**: High contrast, keyboard navigation
- **📱 Responsive Design**: Works on all devices
- **🔧 API Documentation**: http://localhost:8000/api-docs

## 🆘 Need Help?

1. **View logs**: `npm run logs`
2. **Test connectivity**: `npm test`
3. **Reset everything**: `npm run clean && npm run setup`
4. **Check the browser console** for frontend errors
5. **Check terminal output** for backend errors

## 🚀 Ready to Go!

Your LinK Accessibility Platform is now ready! The website runs on a **unified server** at port 8000, eliminating all backend connectivity issues.

**Happy coding! 🎉** 