# 3D Achievements Museum

An immersive 3D virtual museum showcasing achievements, certifications, and projects. Built with React, Three.js, and React Three Fiber.

![3D Museum](https://img.shields.io/badge/3D-Museum-blue) ![React](https://img.shields.io/badge/React-19.2.0-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.182.0-green)

## 🎯 Features

- **Immersive 3D Environment**: Navigate through a minimalist black and white museum
- **Interactive Exhibits**: Click on activation circles to view detailed information
- **Character Movement**: Control a stickman character with arrow keys or WASD
- **Document Links**: View certificates, offer letters, and repositories
- **Organization Logos**: Display logos for universities and companies
- **Footprints**: Visual trail of movement with fading footprints
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/gkganesh12/achivements-3d.git
cd achivements-3d

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the museum.

## 📦 Project Structure

```
portfolio-3d/
├── public/              # Static assets (logos, images)
├── src/
│   ├── components/      # React components
│   │   ├── Character.tsx
│   │   ├── CameraController.tsx
│   │   ├── HUD.tsx
│   │   └── MuseumElements.tsx
│   ├── scenes/         # 3D scene components
│   │   ├── Museum.tsx
│   │   └── LoadingScreen.tsx
│   ├── data/           # Exhibits data
│   │   └── exhibits.ts
│   ├── store/          # State management
│   │   └── useStore.ts
│   ├── hooks/          # Custom hooks
│   │   └── useGameControls.ts
│   └── App.tsx         # Main app component
├── DEPLOYMENT.md       # Deployment guide
└── package.json
```

## 🎮 Controls

- **Arrow Keys** or **WASD**: Move character
- **ESC**: Close magnification / Close menu
- **M**: Toggle menu
- **Click on circles**: View exhibit details

## 🏗️ Building for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

## 📖 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Vercel** (Recommended):
```bash
npm i -g vercel
vercel
```

**Netlify**:
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🛠️ Technologies Used

- **React 18.3.1** - UI framework
- **Three.js 0.182.0** - 3D graphics library
- **React Three Fiber 9.5.0** - React renderer for Three.js
- **React Three Drei 10.7.7** - Useful helpers for R3F
- **Zustand 5.0.9** - State management
- **Vite 7.2.4** - Build tool
- **TypeScript** - Type safety

## 📝 Adding Exhibits

Edit `src/data/exhibits.ts` to add or modify exhibits:

```typescript
{
  id: 'exhibit-id',
  title: 'Exhibit Title',
  subtitle: 'Subtitle',
  description: 'Description text',
  year: '2024',
  type: 'achievement',
  color: '#000000',
  position: { x: -3.5, z: 1.5 },
  wall: 'left',
  logo: '/logo.png', // Optional
  externalLinks: [
    {
      label: 'View Details',
      url: 'https://example.com'
    }
  ]
}
```

## 🎨 Customization

### Colors

Edit `src/App.css` and component files to customize colors:
- Background: `#ffffff`
- Text: `#000000`
- Museum walls: `#ffffff`

### Character Speed

Edit `MOVE_SPEED` in `src/components/Character.tsx`:
```typescript
const MOVE_SPEED = 3.5; // Adjust this value
```

### Museum Dimensions

Edit positions and sizes in `src/scenes/Museum.tsx`

## 🐛 Troubleshooting

### Build Errors
```bash
rm -rf node_modules dist
npm install
npm run build
```

### 3D Models Not Loading
- Check browser console for errors
- Verify file paths in `public/` folder
- Ensure CORS is configured correctly

### Performance Issues
- Reduce number of exhibits
- Optimize images before adding to `public/`
- Check browser DevTools performance tab

## 📄 License

This project is private and proprietary.

## 👤 Author

**Ganesh Khetawat**
- GitHub: [@gkganesh12](https://github.com/gkganesh12)
- Portfolio: [ganeshkhetawat.unaux.com](https://ganeshkhetawat.unaux.com)

## 🙏 Acknowledgments

- Three.js community
- React Three Fiber team
- All contributors to the open-source libraries used

---

**Built with ❤️ using React and Three.js**
