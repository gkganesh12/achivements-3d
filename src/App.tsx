import { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameControls } from './hooks/useGameControls';
import { useStore } from './store/useStore';
import { CameraController } from './components/CameraController';
import { Museum } from './scenes/Museum';
import { HUD } from './components/HUD';
import { LoadingScreen } from './scenes/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function Experience() {
  const { appState } = useStore();
  
  // Only render Museum when in MUSEUM state
  if (appState !== 'MUSEUM') {
    return (
      <>
        <ambientLight intensity={0.5} />
      </>
    );
  }
  
  return (
    <>
      <CameraController />
      <Museum />
      <fog attach="fog" args={['#ffffff', 40, 100]} />
    </>
  );
}

function App() {
  const { appState, setAppState } = useStore();
  
  // Initialize game controls
  useGameControls();

  // Ensure app state is initialized
  useEffect(() => {
    if (!appState) {
      setAppState('LOADING');
    }
  }, [appState, setAppState]);

  // Safety timeout - if loading takes too long, force transition to MUSEUM
  useEffect(() => {
    if (appState === 'LOADING') {
      const timeout = setTimeout(() => {
        setAppState('MUSEUM');
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [appState, setAppState]);

  const safeAppState = appState === 'LOADING' || appState === 'MUSEUM' ? appState : 'LOADING';

  return (
    <ErrorBoundary>
      <div 
        className="app-container" 
        style={{ 
          width: '100vw', 
          height: '100vh', 
          position: 'fixed',
          top: 0,
          left: 0,
          overflow: 'hidden',
          backgroundColor: '#ffffff'
        }}
      >
        {/* 3D Canvas */}
        <div 
          id="canvas-wrapper"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            zIndex: 0,
            backgroundColor: '#ffffff'
          }}
        >
          <Canvas
            shadows
            camera={{ position: [0, 2.1, 12], fov: 50 }}
            gl={{ 
              antialias: true, 
              alpha: false,
              powerPreference: "high-performance"
            }}
            dpr={[1, 2]}
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'block',
              backgroundColor: '#ffffff'
            }}
            onCreated={({ camera }) => {
              const characterPos = useStore.getState().characterPosition;
              camera.lookAt(characterPos.x, 1.1, characterPos.z);
            }}
          >
            <color attach="background" args={['#ffffff']} />
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </Canvas>
        </div>
        
        {/* Loading Screen - overlay on top of Canvas */}
        {safeAppState === 'LOADING' && (
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            zIndex: 10,
            pointerEvents: 'auto'
          }}>
            <LoadingScreen />
          </div>
        )}

        {/* UI Overlays */}
        <HUD />
      </div>
    </ErrorBoundary>
  );
}

export default App;
