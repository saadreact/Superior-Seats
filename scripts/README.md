# Deployment Scripts

## Quick Start

### Local Build and Deploy (Windows)
```powershell
.\scripts\build-and-deploy.ps1
```

### Local Build and Deploy (Linux/Mac)
```bash
chmod +x scripts/build-and-deploy.sh
./scripts/build-and-deploy.sh
```

### Server Deployment
```bash
chmod +x scripts/deploy-server.sh
./scripts/deploy-server.sh
```

## Scripts Overview

- **build-and-deploy.sh / build-and-deploy.ps1**: Builds the Next.js app locally and pushes to `deploy` branch
- **deploy-server.sh**: Pulls latest from `deploy` branch and starts the application on the server

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed documentation.

