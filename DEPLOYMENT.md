# Deployment Guide for Superior Seats Next.js Application

## Problem Statement

The Next.js build process requires significant memory and CPU resources, which causes builds to hang or fail on a VPS with limited resources (4GB RAM, 100GB storage).

## Solution

We use a **three-branch deployment strategy**:
- **`develop` branch** (or `main`): Contains source code and deployment scripts (no build artifacts)
- **`main` branch**: Production-ready source code (if using develop workflow)
- **`deploy` branch**: Contains pre-built `.next` folder and production-ready files

This allows us to:
1. Commit deployment scripts and documentation to `develop`/`main` branch
2. Build the application locally (on a machine with sufficient resources)
3. Commit the built artifacts to the `deploy` branch
4. Deploy on the server by simply pulling the `deploy` branch and running `npm start` (no build required)

## Prerequisites

- Node.js and npm installed locally
- Node.js and npm installed on VPS server
- Git configured on both local machine and server
- SSH access to your VPS server

## Local Setup (First Time)

### For Developers (Adding Scripts to Repository)

1. **Commit deployment scripts to `develop` or `main` branch:**
   ```bash
   # If using develop branch
   git checkout develop
   git add scripts/ DEPLOYMENT.md .gitignore.deploy
   git commit -m "Add deployment scripts and documentation"
   git push origin develop
   
   # Or if using main branch directly
   git checkout main
   git add scripts/ DEPLOYMENT.md .gitignore.deploy
   git commit -m "Add deployment scripts and documentation"
   git push origin main
   ```

### For Deployment Person (Getting Scripts)

1. **Pull the latest code from `develop` or `main` branch:**
   ```bash
   # If using develop branch
   git checkout develop
   git pull origin develop
   
   # Or if using main branch
   git checkout main
   git pull origin main
   ```

2. **Make the deployment scripts executable (Linux/Mac):**
   ```bash
   chmod +x scripts/build-and-deploy.sh
   chmod +x scripts/deploy-server.sh
   ```

## Deployment Workflow

### Step 1: Build and Push to Deploy Branch (Local Machine)

**On Windows (PowerShell):**
```powershell
.\scripts\build-and-deploy.ps1 -CommitMessage "Your deployment message"
```

**On Linux/Mac (Bash):**
```bash
./scripts/build-and-deploy.sh "Your deployment message"
```

**Or with default message:**
```bash
./scripts/build-and-deploy.sh
```

This script will:
1. Detect if `develop` branch exists (uses `develop` if available, otherwise `main`)
2. Install dependencies
3. Build the Next.js application (`npm run build`)
4. Switch to/create the `deploy` branch from the source branch (`develop` or `main`)
5. Update `.gitignore` to allow `.next` folder
6. Commit and push the built files to the `deploy` branch
7. Switch back to your original branch

**Note:** The script automatically detects whether to use `develop` or `main` as the source branch. If `develop` exists, it will be used; otherwise, it falls back to `main`.

### Step 2: Deploy on Server (VPS)

**Option A: Using the deployment script (Recommended)**

1. SSH into your VPS:
   ```bash
   ssh user@your-vps-ip
   ```

2. Navigate to your project directory:
   ```bash
   cd /path/to/superior-seats
   ```

3. Run the deployment script:
   ```bash
   ./scripts/deploy-server.sh
   ```

**Option B: Manual deployment**

1. SSH into your VPS and navigate to project:
   ```bash
   ssh user@your-vps-ip
   cd /path/to/superior-seats
   ```

2. Switch to deploy branch and pull:
   ```bash
   git checkout deploy
   git pull origin deploy
   ```

3. Install production dependencies:
   ```bash
   npm ci --production
   ```

4. Start the application:
   ```bash
   npm start
   ```

   Or with PM2 (recommended for production):
   ```bash
   pm2 start npm --name "superior-seats" -- start
   pm2 save
   ```

## Using PM2 for Process Management (Recommended)

PM2 is a process manager that keeps your application running and automatically restarts it if it crashes.

**Install PM2:**
```bash
npm install -g pm2
```

**Start application with PM2:**
```bash
pm2 start npm --name "superior-seats" -- start
```

**Useful PM2 commands:**
```bash
pm2 list              # List all processes
pm2 logs superior-seats  # View logs
pm2 restart superior-seats  # Restart application
pm2 stop superior-seats     # Stop application
pm2 delete superior-seats   # Remove from PM2
pm2 save              # Save current process list
pm2 startup           # Setup PM2 to start on system boot
```

## Environment Variables

Make sure your `.env.production` or `.env` file is configured on the server with the correct values:

```bash
# On server, create/edit .env file
nano .env
```

**Important:** Never commit `.env` files to git. They should already be in `.gitignore`.

## Troubleshooting

### Build fails locally
- Ensure you have enough disk space
- Check Node.js version (should be compatible with Next.js 15)
- Clear node_modules and rebuild: `rm -rf node_modules package-lock.json && npm install`

### Server deployment fails
- Ensure `.next` folder exists in the deploy branch
- Check that you're on the `deploy` branch: `git branch`
- Verify production dependencies: `npm ci --production`
- Check server logs: `pm2 logs superior-seats` or `npm start` output

### Application won't start
- Check if port 3000 (or your configured port) is available
- Verify environment variables are set correctly
- Check Node.js version on server matches local version
- Review application logs for errors

### Memory issues on server
- The build process is done locally, so server only needs to run the application
- If `npm start` still uses too much memory, consider:
  - Increasing Node.js memory limit: `NODE_OPTIONS=--max-old-space-size=2048 npm start`
  - Using PM2 with memory limits: `pm2 start npm --name "superior-seats" --node-args="--max-old-space-size=2048" -- start`

## Branch Management

### Branch Strategy

- **`develop` branch** (optional): Development branch where new features are merged. Deployment scripts should be committed here.
- **`main` branch**: Production-ready source code. If not using `develop`, scripts go here.
- **`deploy` branch**: Contains pre-built artifacts. **Never commit directly to this branch manually.**

### Workflow

1. **Development:**
   - Developers work on feature branches
   - Merge to `develop` (or `main` if no develop branch)
   - Deployment scripts and documentation are committed to `develop`/`main`

2. **Deployment:**
   - Deployment person pulls from `develop`/`main` to get latest scripts
   - Runs `build-and-deploy.sh` script locally (builds and pushes to `deploy` branch)
   - Server pulls from `deploy` branch and starts the application

**Important Notes:**
- Never commit directly to `deploy` branch manually
- The `deploy` branch is automatically managed by the build script
- The build script automatically uses `develop` if it exists, otherwise `main`
- Always use the build script to update the `deploy` branch

**To reset deploy branch (if needed):**
```bash
git checkout deploy
# If using develop branch
git reset --hard origin/develop
# Or if using main branch
git reset --hard origin/main
# Then run build-and-deploy script again
```

## Alternative: CI/CD Pipeline

For a more automated approach, consider setting up:
- GitHub Actions to build on push to main
- Automated deployment to your VPS
- This would eliminate the need for local builds

## File Structure

```
Superior-Seats/
├── .gitignore              # Main .gitignore (excludes .next)
├── .gitignore.deploy       # Deployment .gitignore (allows .next)
├── scripts/
│   ├── build-and-deploy.sh    # Local build and push script
│   ├── build-and-deploy.ps1   # Windows PowerShell version
│   └── deploy-server.sh       # Server deployment script
└── DEPLOYMENT.md           # This file
```

## Summary

1. **Developers**: Commit scripts/docs to `develop` or `main` branch
2. **Deployment Person**: Pull from `develop`/`main`, run `build-and-deploy.sh` to build and push to `deploy` branch
3. **Server**: Pull from `deploy` branch and run `npm start` (no build needed)

This approach solves the memory/CPU constraint issues while maintaining a clean development workflow.
