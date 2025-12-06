#!/bin/bash

# Server-side Deployment Script
# This script should be run on your VPS server to deploy the latest build
# Usage: ./scripts/deploy-server.sh

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting server deployment...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📍 Current branch: ${CURRENT_BRANCH}${NC}"

# Switch to deploy branch if not already on it
if [ "$CURRENT_BRANCH" != "deploy" ]; then
    echo -e "${YELLOW}🔄 Switching to deploy branch...${NC}"
    if git show-ref --verify --quiet refs/heads/deploy; then
        git checkout deploy
    else
        echo -e "${YELLOW}🌿 Creating deploy branch from remote...${NC}"
        git checkout -b deploy origin/deploy
    fi
fi

# Pull latest changes
echo -e "${YELLOW}📥 Pulling latest changes from deploy branch...${NC}"
git pull origin deploy

# Check if .next folder exists (should be in deploy branch)
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Error: .next folder not found. The deploy branch may not have been built properly.${NC}"
    echo -e "${YELLOW}💡 Run the build-and-deploy script locally first.${NC}"
    exit 1
fi

# Install production dependencies only (faster, less memory)
echo -e "${YELLOW}📦 Installing production dependencies...${NC}"
npm ci --production

# Check if PM2 is installed (recommended for production)
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}🔄 Restarting application with PM2...${NC}"
    # Check if app is already running
    if pm2 list | grep -q "superior-seats"; then
        pm2 restart superior-seats
    else
        pm2 start npm --name "superior-seats" -- start
        pm2 save
    fi
    echo -e "${GREEN}✅ Application restarted with PM2${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 not found. Starting with npm start...${NC}"
    echo -e "${YELLOW}💡 Consider installing PM2 for better process management: npm install -g pm2${NC}"
    # If there's a process running, you may need to stop it first
    # pkill -f "next start" || true
    # nohup npm start > /dev/null 2>&1 &
    echo -e "${GREEN}✅ Run 'npm start' manually or set up a process manager${NC}"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"

