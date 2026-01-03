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

### Option 4: Traditional Web Server

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
   - Check browser console for errors
   - Ensure base path is correct in `vite.config.ts`
   - Verify all assets are in `dist/` folder

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
rm -rf node_modules dist
npm install
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
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
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

