#!/bin/bash

# Script to push code to GitHub repository in 8 commits
# Run this script from the portfolio-3d directory

set -e

echo "🚀 Starting GitHub push process..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add remote repository
echo "🔗 Setting up remote repository..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/gkganesh12/achivements-3d.git

# Commit 1: Project setup
echo "📝 Commit 1: Project setup..."
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js index.html
git commit -m "chore: initial project setup with dependencies and configuration" || echo "No changes to commit"

# Commit 2: State management
echo "📝 Commit 2: State management..."
git add src/store/ src/types/ src/utils/
git commit -m "feat: add state management and type definitions" || echo "No changes to commit"

# Commit 3: 3D Scene
echo "📝 Commit 3: 3D Scene..."
git add src/scenes/ src/components/Character.tsx src/components/CameraController.tsx
git commit -m "feat: implement 3D museum scene with character and camera controls" || echo "No changes to commit"

# Commit 4: Museum elements and HUD
echo "📝 Commit 4: Museum elements and HUD..."
git add src/components/MuseumElements.tsx src/components/HUD.tsx src/components/HUD.css
git commit -m "feat: add museum elements, HUD, and interactive components" || echo "No changes to commit"

# Commit 5: Data and controls
echo "📝 Commit 5: Data and controls..."
git add src/data/ src/hooks/
git commit -m "feat: add exhibits data and game controls" || echo "No changes to commit"

# Commit 6: App components
echo "📝 Commit 6: App components..."
git add src/App.tsx src/App.css src/main.tsx src/index.css src/scenes/LoadingScreen.tsx src/scenes/LoadingScreen.css
git commit -m "feat: add main app component and loading screen" || echo "No changes to commit"

# Commit 7: Public assets
echo "📝 Commit 7: Public assets..."
git add public/ README.md
git commit -m "feat: add public assets and documentation" || echo "No changes to commit"

# Commit 8: Deployment guide
echo "📝 Commit 8: Deployment guide..."
git add DEPLOYMENT.md .gitignore 2>/dev/null || git add DEPLOYMENT.md
git commit -m "docs: add comprehensive deployment guide" || echo "No changes to commit"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main --force

echo "✅ Successfully pushed to GitHub!"
echo "📖 Repository: https://github.com/gkganesh12/achivements-3d"

