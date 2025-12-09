# 🚀 Deployment Process Update - Team Announcement

## 📋 What Changed?

We've implemented a new deployment strategy to solve the VPS build issues. The Next.js build process was hanging on our PS with limited resources (4GB RAM), so we now build locally and deploy pre-built files.

## 🔄 New Process Overview

**Three-Branch Strategy:**
- **`develop` branch**: Source code + deployment scripts (developers commit here)
- **`main` branch**: Production-ready source code
- **`deploy` branch**: Pre-built artifacts (automatically managed)

## 👨‍💻 For Developers

1. Continue working on `develop` branch as usual
2. All deployment scripts are now in the repo
3. No changes to your workflow - just commit to `develop`/`main` as normal

## 🔧 For Deployment Person

### First Time Setup:
```bash
# Pull latest code
git checkout develop
git pull origin develop

# Make scripts executable (Linux/Mac)
chmod +x scripts/build-and-deploy.sh
chmod +x scripts/deploy-server.sh
```

### Regular Deployment (3 Simple Steps):

**Step 1: Pull latest code**
```bash
git checkout develop  # or main
git pull origin develop
```

**Step 2: Build and push (Windows)**
```powershell
.\scripts\build-and-deploy.ps1
```

**Or (Linux/Mac):**
```bash
./scripts/build-and-deploy.sh
```

**Step 3: Deploy on server**
```bash
ssh user@vps-ip
cd /path/to/superior-seats
./scripts/deploy-server.sh
```

That's it! 🎉

## 📚 Documentation

- **Full Guide**: See `DEPLOYMENT.md` for detailed instructions
- **Quick Reference**: See `QUICK_DEPLOYMENT_GUIDE.md` for cheat sheet

## ✅ Benefits

- ✅ No more build hangs on VPS
- ✅ Faster deployments (just pull and start)
- ✅ Lower server resource usage
- ✅ Automated process with scripts

## ⚠️ Important Notes

- **Never manually commit to `deploy` branch** - scripts handle it automatically
- Scripts automatically detect `develop` or `main` branch
- Server only runs `npm start` (no build needed)

## 🆘 Need Help?

Check the documentation files or reach out to the team!

---

**Files Added:**
- `scripts/build-and-deploy.sh` - Linux/Mac build script
- `scripts/build-and-deploy.ps1` - Windows build script  
- `scripts/deploy-server.sh` - Server deployment script
- `DEPLOYMENT.md` - Full documentation
- `QUICK_DEPLOYMENT_GUIDE.md` - Quick reference

