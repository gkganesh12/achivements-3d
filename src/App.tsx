import { lazy, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameControls } from './hooks/useGameControls';
import { useStore } from './store/useStore';
import { CameraController } from './components/CameraController';
import { HUD } from './components/HUD';
import { LoadingScreen } from './scenes/LoadingScreen';
import './App.css';

// Lazy load Museum component for code splitting
const Museum = lazy(() => import('./scenes/Museum').then(module => ({ default: module.Museum })));

function Experience() {
  return (
    <>
      <CameraController />
      <Suspense fallback={null}>
        <Museum />
      </Suspense>
      <fog attach="fog" args={['#ffffff', 25, 60]} />
    </>
  );
}

function App() {
  // Initialize game controls
  useGameControls();
  const { appState } = useStore();

  return (
    <div className="app-container">
      {appState === 'LOADING' && <LoadingScreen />}
      {/* 3D Canvas - Direct entry to museum */}
      {appState === 'MUSEUM' && (
        <Canvas
          shadows
          camera={{ position: [0, 2.1, 12], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
          onCreated={({ camera }) => {
            // Point camera at character initially
            const characterPos = useStore.getState().characterPosition;
            camera.lookAt(characterPos.x, 1.1, characterPos.z);
          }}
        >
          <color attach="background" args={['#ffffff']} />
          <Experience />
        </Canvas>
      )}

      {/* UI Overlays */}
      <HUD />
    </div>
  );
}

export default App;
