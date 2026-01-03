import { lazy, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameControls } from './hooks/useGameControls';
import { useStore } from './store/useStore';
import { CameraController } from './components/CameraController';
import { HUD } from './components/HUD';
import { LoadingScreen } from './scenes/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

// Lazy load Museum component for code splitting with error handling
const Museum = lazy(() => 
  import('./scenes/Museum')
    .then(module => ({ default: module.Museum }))
    .catch(error => {
      console.error('Failed to load Museum component:', error);
      throw error;
    })
);

function Experience() {
  return (
    <>
      <CameraController />
      <ErrorBoundary>
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
        }>
          <Museum />
        </Suspense>
      </ErrorBoundary>
      <fog attach="fog" args={['#ffffff', 25, 60]} />
    </>
  );
}

function App() {
  // Initialize game controls
  useGameControls();
  const { appState } = useStore();

  // Add error logging for debugging
  useEffect(() => {
    console.log('App state:', appState);
    
    // Log any unhandled errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
    
    return () => {
      window.removeEventListener('error', () => {});
      window.removeEventListener('unhandledrejection', () => {});
    };
  }, [appState]);

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
