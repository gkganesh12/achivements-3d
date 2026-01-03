import { useEffect } from 'react';
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
  return (
    <>
      <CameraController />
      <ErrorBoundary>
        <Museum />
      </ErrorBoundary>
      {/* Reduced fog density to ensure visibility */}
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
    console.log('App mounted, current state:', appState);
    // Ensure we start with LOADING state
    if (!appState) {
      console.warn('App state is undefined, setting to LOADING');
      setAppState('LOADING');
    }
  }, []);

  // Safety timeout - if loading takes too long, force transition to MUSEUM
  useEffect(() => {
    if (appState === 'LOADING') {
      const timeout = setTimeout(() => {
        console.warn('Loading timeout - forcing transition to MUSEUM');
        setAppState('MUSEUM');
      }, 5000); // 5 second safety timeout
      
      return () => clearTimeout(timeout);
    }
  }, [appState, setAppState]);

  // Add error logging for debugging
  useEffect(() => {
    console.log('App state changed:', appState);
    
    // Log any unhandled errors
    const errorHandler = (event: ErrorEvent) => {
      console.error('Global error:', event.error, event.message, event.filename, event.lineno);
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

  // Debug: Log what we're rendering
  useEffect(() => {
    console.log('Rendering with safeAppState:', safeAppState);
  }, [safeAppState]);

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
        {safeAppState === 'LOADING' && <LoadingScreen />}
        {/* 3D Canvas - Direct entry to museum */}
        {safeAppState === 'MUSEUM' && (
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            zIndex: 1
          }}>
            <Canvas
              shadows
              camera={{ position: [0, 2.1, 12], fov: 50 }}
              gl={{ 
                antialias: true, 
                alpha: false,
                powerPreference: "high-performance"
              }}
              dpr={[1, 2]}
              style={{ width: '100%', height: '100%' }}
              onCreated={({ camera, gl, scene }) => {
                console.log('Canvas created successfully', { 
                  cameraPosition: camera.position, 
                  glContext: gl.getContext() ? 'valid' : 'invalid',
                  sceneChildren: scene.children.length
                });
                // Point camera at character initially
                const characterPos = useStore.getState().characterPosition;
                camera.lookAt(characterPos.x, 1.1, characterPos.z);
                // Ensure WebGL context is valid
                if (!gl.getContext()) {
                  console.error('WebGL context is invalid');
                }
              }}
              onError={(error) => {
                console.error('Canvas error:', error);
              }}
            >
              <color attach="background" args={['#ffffff']} />
              <Experience />
            </Canvas>
          </div>
        )}

        {/* UI Overlays - always render */}
        <HUD />
      </div>
    </ErrorBoundary>
  );
}

export default App;
