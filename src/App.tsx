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
        <Suspense fallback={null}>
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

  // Safety timeout - if loading takes too long, force transition to MUSEUM
  useEffect(() => {
    if (appState === 'LOADING') {
      const timeout = setTimeout(() => {
        console.warn('Loading timeout - forcing transition to MUSEUM');
        useStore.getState().setAppState('MUSEUM');
      }, 5000); // 5 second safety timeout
      
      return () => clearTimeout(timeout);
    }
  }, [appState]);

  // Add error logging for debugging
  useEffect(() => {
    console.log('App state:', appState);
    
    // Log any unhandled errors
    const errorHandler = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
    };
    
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
    };
    
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, [appState]);

  // Always render something - fallback to loading if state is invalid
  const safeAppState = appState === 'LOADING' || appState === 'MUSEUM' ? appState : 'LOADING';

  return (
    <ErrorBoundary>
      <div className="app-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
        {safeAppState === 'LOADING' && <LoadingScreen />}
        {/* 3D Canvas - Direct entry to museum */}
        {safeAppState === 'MUSEUM' && (
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

        {/* UI Overlays - always render */}
        <HUD />
      </div>
    </ErrorBoundary>
  );
}

export default App;
