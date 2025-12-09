# Quick Deployment Guide

## For Developers: Adding Deployment Scripts

1. **Create/switch to develop branch:**
   ```bash
   git checkout -b develop  # If it doesn't exist
   # OR
   git checkout develop     # If it already exists
   ```

2. **Add and commit deployment files:**
   ```bash
   git add scripts/ DEPLOYMENT.md .gitignore.deploy QUICK_DEPLOYMENT_GUIDE.md
   git commit -m "Add deployment scripts and documentation"
   git push origin develop
   ```

## For Deployment Person: Deploying to Production

### Initial Setup (First Time Only)

1. **Clone or pull the repository:**
   ```bash
   git clone <repository-url>
   cd superior-seats
   # OR if already cloned
   git checkout develop  # or main
   git pull origin develop  # or main
   ```

2. **Make scripts executable (Linux/Mac):**
   ```bash
   chmod +x scripts/build-and-deploy.sh
   chmod +x scripts/deploy-server.sh
   ```

### Regular Deployment Process

1. **Pull latest code from develop/main:**
   ```bash
   git checkout develop  # or main
   git pull origin develop  # or main
   ```

2. **Build and push to deploy branch (Windows):**
   ```powershell
   .\scripts\build-and-deploy.ps1
   ```

   **Or (Linux/Mac):**
   ```bash
   ./scripts/build-and-deploy.sh
   ```

3. **On the server, deploy:**
   ```bash
   ssh user@your-vps-ip
   cd /path/to/superior-seats
   ./scripts/deploy-server.sh
   ```

## Branch Flow Diagram

```
develop/main (source code + scripts)
    │
    ├──> [build-and-deploy.sh] ──> deploy (pre-built artifacts)
    │                                    │
    │                                    └──> [Server pulls & runs]
    │
    └──> [Developers commit here]
```

## Key Points

- ✅ Scripts automatically detect `develop` or `main` branch
- ✅ Build happens locally (not on server)
- ✅ Server only runs `npm start` (lightweight)
- ✅ Never manually commit to `deploy` branch

