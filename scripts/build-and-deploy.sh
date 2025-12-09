#!/bin/bash

# Build and Deploy Script for Superior Seats Next.js App
# This script builds the project locally and pushes to the deploy branch
# Usage: ./scripts/build-and-deploy.sh [commit-message]

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting build and deployment process...${NC}"

# Get commit message or use default
COMMIT_MSG=${1:-"Deploy: $(date +'%Y-%m-%d %H:%M:%S')"}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --production=false

echo -e "${YELLOW}🔨 Building Next.js application...${NC}"
npm run build

if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Error: Build failed - .next directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}📍 Current branch: ${CURRENT_BRANCH}${NC}"

# Determine source branch (develop if exists, otherwise main)
if git show-ref --verify --quiet refs/heads/develop; then
    SOURCE_BRANCH="develop"
    echo -e "${YELLOW}📌 Using 'develop' as source branch${NC}"
elif git show-ref --verify --quiet refs/remotes/origin/develop; then
    SOURCE_BRANCH="develop"
    echo -e "${YELLOW}📌 Using 'develop' as source branch${NC}"
else
    SOURCE_BRANCH="main"
    echo -e "${YELLOW}📌 Using 'main' as source branch${NC}"
fi

# Check if deploy branch exists locally
if git show-ref --verify --quiet refs/heads/deploy; then
    echo -e "${YELLOW}🔄 Switching to deploy branch...${NC}"
    git checkout deploy
    git merge $SOURCE_BRANCH --no-edit || echo -e "${YELLOW}⚠️  Merge conflicts or already up to date${NC}"
else
    echo -e "${YELLOW}🌿 Creating deploy branch from ${SOURCE_BRANCH}...${NC}"
    git checkout -b deploy $SOURCE_BRANCH
fi

# Copy deployment .gitignore
echo -e "${YELLOW}📝 Updating .gitignore for deployment...${NC}"
cp .gitignore.deploy .gitignore

# Stage all changes including .next folder
echo -e "${YELLOW}📤 Staging changes...${NC}"
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}ℹ️  No changes to commit.${NC}"
else
    echo -e "${YELLOW}💾 Committing changes...${NC}"
    git commit -m "$COMMIT_MSG"
fi

# Push to remote
echo -e "${YELLOW}🚀 Pushing to remote deploy branch...${NC}"
git push origin deploy --force-with-lease

echo -e "${GREEN}✅ Deployment branch updated successfully!${NC}"
echo -e "${GREEN}📋 Next steps:${NC}"
echo -e "   1. SSH into your VPS server"
echo -e "   2. Navigate to your project directory"
echo -e "   3. Run: git checkout deploy && git pull origin deploy"
echo -e "   4. Run: npm ci --production"
echo -e "   5. Run: npm start"
echo -e ""
echo -e "${YELLOW}💡 Tip: Use the server deployment script (deploy-server.sh) for automated deployment${NC}"

# Switch back to original branch
if [ "$CURRENT_BRANCH" != "deploy" ]; then
    echo -e "${YELLOW}🔄 Switching back to ${CURRENT_BRANCH}...${NC}"
    git checkout "$CURRENT_BRANCH"
    # Restore original .gitignore from source branch
    git checkout $SOURCE_BRANCH -- .gitignore 2>/dev/null || echo -e "${YELLOW}⚠️  Could not restore .gitignore from ${SOURCE_BRANCH}${NC}"
fi

echo -e "${GREEN}🎉 All done!${NC}"

