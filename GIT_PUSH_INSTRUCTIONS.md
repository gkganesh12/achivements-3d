# Git Push Instructions - 8 Commits

Follow these steps to push the code to GitHub in 8 organized commits.

## Prerequisites

1. Make sure you have Git installed
2. Ensure you're authenticated with GitHub (SSH or HTTPS)

## Step-by-Step Instructions

### 1. Navigate to Project Directory

```bash
cd "/Users/ganesh_khetawat/3D Acheivements and Journey/portfolio-3d"
```

### 2. Initialize Git (if not already done)

```bash
git init
```

### 3. Add Remote Repository

```bash
git remote add origin https://github.com/gkganesh12/achivements-3d.git
```

Or if remote already exists:
```bash
git remote set-url origin https://github.com/gkganesh12/achivements-3d.git
```

### 4. Create 8 Commits

#### Commit 1: Project Setup
```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js index.html
git commit -m "chore: initial project setup with dependencies and configuration"
```

#### Commit 2: State Management
```bash
git add src/store/ src/types/ src/utils/
git commit -m "feat: add state management and type definitions"
```

#### Commit 3: 3D Scene
```bash
git add src/scenes/ src/components/Character.tsx src/components/CameraController.tsx
git commit -m "feat: implement 3D museum scene with character and camera controls"
```

#### Commit 4: Museum Elements and HUD
```bash
git add src/components/MuseumElements.tsx src/components/HUD.tsx src/components/HUD.css
git commit -m "feat: add museum elements, HUD, and interactive components"
```

#### Commit 5: Data and Controls
```bash
git add src/data/ src/hooks/
git commit -m "feat: add exhibits data and game controls"
```

#### Commit 6: App Components
```bash
git add src/App.tsx src/App.css src/main.tsx src/index.css src/scenes/LoadingScreen.tsx src/scenes/LoadingScreen.css
git commit -m "feat: add main app component and loading screen"
```

#### Commit 7: Public Assets
```bash
git add public/ README.md
git commit -m "feat: add public assets and documentation"
```

#### Commit 8: Deployment Guide
```bash
git add DEPLOYMENT.md .gitignore PUSH_TO_GITHUB.sh GIT_PUSH_INSTRUCTIONS.md
git commit -m "docs: add comprehensive deployment guide and push scripts"
```

### 5. Push to GitHub

```bash
git branch -M main
git push -u origin main --force
```

## Alternative: Use the Script

You can also run the provided script:

```bash
chmod +x PUSH_TO_GITHUB.sh
./PUSH_TO_GITHUB.sh
```

## Verify Push

After pushing, verify at: https://github.com/gkganesh12/achivements-3d

You should see 8 commits in the commit history.

## Troubleshooting

### If you get authentication errors:
- Use SSH instead: `git remote set-url origin git@github.com:gkganesh12/achivements-3d.git`
- Or use GitHub CLI: `gh auth login`

### If you get permission errors:
- Make sure you have write access to the repository
- Check your GitHub authentication

### If files are already committed:
- The script will skip commits with "No changes to commit" message
- This is normal if files were already committed

---

**Note**: The `--force` flag is used because this is a new repository. Use with caution if the repository already has commits you want to keep.

