# Build and Deploy Script for Superior Seats Next.js App (PowerShell)
# This script builds the project locally and pushes to the deploy branch
# Usage: .\scripts\build-and-deploy.ps1 [-CommitMessage "Your message"]

param(
    [string]$CommitMessage = "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting build and deployment process..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js is not installed." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: npm is not installed." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci --production=false
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: npm install failed." -ForegroundColor Red
    exit 1
}

Write-Host "🔨 Building Next.js application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Build failed." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".next")) {
    Write-Host "❌ Error: Build failed - .next directory not found." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

# Check current branch
$currentBranch = git branch --show-current
Write-Host "📍 Current branch: $currentBranch" -ForegroundColor Yellow

# Determine source branch (develop if exists, otherwise main)
$sourceBranch = "main"
if (git show-ref --verify --quiet refs/heads/develop) {
    $sourceBranch = "develop"
    Write-Host "📌 Using 'develop' as source branch" -ForegroundColor Yellow
} elseif (git show-ref --verify --quiet refs/remotes/origin/develop) {
    $sourceBranch = "develop"
    Write-Host "📌 Using 'develop' as source branch" -ForegroundColor Yellow
} else {
    Write-Host "📌 Using 'main' as source branch" -ForegroundColor Yellow
}

# Check if deploy branch exists locally
$deployBranchExists = git show-ref --verify --quiet refs/heads/deploy
if ($LASTEXITCODE -eq 0) {
    Write-Host "🔄 Switching to deploy branch..." -ForegroundColor Yellow
    git checkout deploy
    git merge $sourceBranch --no-edit
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Merge conflicts or already up to date" -ForegroundColor Yellow
    }
} else {
    Write-Host "🌿 Creating deploy branch from $sourceBranch..." -ForegroundColor Yellow
    git checkout -b deploy $sourceBranch
}

# Copy deployment .gitignore
Write-Host "📝 Updating .gitignore for deployment..." -ForegroundColor Yellow
Copy-Item .gitignore.deploy .gitignore -Force

# Stage all changes including .next folder
Write-Host "📤 Staging changes..." -ForegroundColor Yellow
git add -A

# Check if there are changes to commit
$stagedChanges = git diff --staged --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "ℹ️  No changes to commit." -ForegroundColor Yellow
} else {
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m $CommitMessage
}

# Push to remote
Write-Host "🚀 Pushing to remote deploy branch..." -ForegroundColor Yellow
git push origin deploy --force-with-lease
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to push to remote." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Deployment branch updated successfully!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Green
Write-Host "   1. SSH into your VPS server"
Write-Host "   2. Navigate to your project directory"
Write-Host "   3. Run: git checkout deploy && git pull origin deploy"
Write-Host "   4. Run: npm ci --production"
Write-Host "   5. Run: npm start"
Write-Host ""
Write-Host "💡 Tip: Use the server deployment script (deploy-server.sh) for automated deployment" -ForegroundColor Yellow

# Switch back to original branch
if ($currentBranch -ne "deploy") {
    Write-Host "🔄 Switching back to $currentBranch..." -ForegroundColor Yellow
    git checkout $currentBranch
    # Restore original .gitignore from source branch
    git checkout $sourceBranch -- .gitignore 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Could not restore .gitignore from $sourceBranch" -ForegroundColor Yellow
    }
}

Write-Host "🎉 All done!" -ForegroundColor Green

