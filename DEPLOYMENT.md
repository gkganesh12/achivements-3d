# Deployment Guide - 3D Achievements Museum

This guide will help you deploy the 3D Achievements Museum application to production.

## Prerequisites

- Node.js 18+ and npm/yarn installed
- Git installed
- A hosting service (Vercel, Netlify, GitHub Pages, etc.)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Deployment Options

> **Note**: This is a static site (SPA), so use Static Site hosting. For Render, use Static Site service, not Web Service.

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI** (optional):

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:

   ```bash
   vercel
   ```

   Or connect your GitHub repository to Vercel:

   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Vite and deploy automatically

3. **Environment Variables**: None required for basic setup

### Option 2: Netlify

1. **Install Netlify CLI** (optional):

   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:

   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

   Or use Netlify's web interface:

   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist/` folder
   - Or connect your GitHub repository

3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 3: GitHub Pages

1. **Install gh-pages**:

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**:

   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Deploy**:

   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages**:
   - Go to repository Settings > Pages
   - Source: `gh-pages` branch
   - Path: `/ (root)`

### Option 4: Render

1. **Create a Render Account**:

   - Go to [render.com](https://render.com)
   - Sign up or log in with your GitHub account

2. **Create a New Static Site**:

   - Click "New +" → "Static Site"
   - Connect your GitHub repository: `gkganesh12/achivements-3d`
   - Select the branch: `main`

3. **Configure Build Settings**:

   - **Name**: `achivements-3d` (or your preferred name)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Node Version**: `18` or `20` (Render will auto-detect)

4. **Environment Variables** (if needed):

   - Usually not required for this project
   - Add any custom environment variables if you have them

5. **Deploy**:

   - Click "Create Static Site"
   - Render will automatically:
     - Clone your repository
     - Install dependencies
     - Run the build command
     - Deploy the `dist/` folder

6. **Automatic Deployments**:

   - Every push to the `main` branch will trigger a new deployment
   - Render provides a free SSL certificate automatically
   - Your site will be available at: `https://your-app-name.onrender.com`

7. **Custom Domain** (Optional):

   - Go to your site settings
   - Click "Custom Domain"
   - Add your domain and follow DNS configuration instructions

8. **SPA Routing Configuration**:
   - Render automatically handles SPA routing for static sites
   - All routes will serve `index.html` correctly
   - No additional configuration needed

### Option 5: Traditional Web Server

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your web server:

   - Upload all files from `dist/` to your server's public directory
   - Ensure your server is configured to serve `index.html` for all routes (SPA routing)

3. **Server Configuration** (Apache `.htaccess`):

   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

4. **Server Configuration** (Nginx):
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

## Environment Setup

### Required Files

Ensure these files are in the `public/` directory:

- `stan.png` - Stanford University logo
- `dre.png` - Drexel University logo
- Any additional document images (if using local files)

### External Links Configuration

Update `src/data/exhibits.ts` with your actual:

- Google Drive links for certificates
- GitHub repository links
- ImgBB or other image hosting links

## Build Optimization

### Production Build

The production build includes:

- Code minification
- Tree shaking
- Asset optimization
- Source maps (disabled by default)

### Performance Tips

1. **Image Optimization**: Compress images before adding to `public/`
2. **Code Splitting**: Already configured via Vite
3. **Lazy Loading**: 3D models load on demand
4. **CDN**: Consider using a CDN for static assets

## Troubleshooting

### Common Issues

1. **Blank Page After Deployment**:

   - **Check browser console** (F12) for JavaScript errors
   - **Verify deployment configuration**:
     - For Netlify: Ensure `public/_redirects` file exists
     - For Vercel: Ensure `vercel.json` file exists
     - For GitHub Pages: May need to set `base` in `vite.config.ts` if deploying to subdirectory
   - **Check network tab** for failed asset requests (404 errors)
   - **Verify build output**: Ensure `dist/` folder contains `index.html` and all assets
   - **Clear browser cache** and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - **Check error boundary**: The app now includes error boundaries that will show error messages
   - **Verify environment**: Ensure you're using a modern browser with WebGL support

2. **3D Models Not Loading**:

   - Check network tab for failed requests
   - Verify file paths are correct
   - Ensure CORS is properly configured

3. **Routing Issues**:
   - Configure server to serve `index.html` for all routes
   - Check `vite.config.ts` base path

### Build Errors

If you encounter build errors:

```bash
# Clear cache and rebuild
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### React Version Conflicts

If you see "Cannot set properties of undefined" errors:

1. **Delete lock file and reinstall**:

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Verify React version**:

   ```bash
   npm list react react-dom
   ```

   Should show `18.3.1` for both.

3. **Force clean build**:
   ```bash
   rm -rf dist .vite
   npm run build
   ```

## Post-Deployment Checklist

- [ ] Test all navigation controls
- [ ] Verify all external links work
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Verify 3D rendering performance
- [ ] Check loading times
- [ ] Test all exhibit interactions
- [ ] Verify document/image links

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm install
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Support

For issues or questions:

- Check the repository issues
- Review the code documentation
- Contact the maintainer

---

**Last Updated**: January 2025
