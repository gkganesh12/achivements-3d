import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
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
      {/* Test: Add a visible red box to verify rendering works */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
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
          <div 
            id="canvas-wrapper"
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              zIndex: 1,
              backgroundColor: '#ffffff'
            }}
          >
            <Canvas
              shadows
              camera={{ position: [0, 2.1, 12], fov: 50 }}
              gl={{ 
                antialias: true, 
                alpha: false,
                powerPreference: "high-performance",
                preserveDrawingBuffer: false,
                stencil: false,
                depth: true,
                failIfMajorPerformanceCaveat: false
              }}
              dpr={[1, 2]}
              style={{ 
                width: '100%', 
                height: '100%',
                display: 'block',
                backgroundColor: '#ffffff'
              }}
              onCreated={({ camera, gl, scene }) => {
                const canvas = gl.domElement;
                console.log('Canvas created successfully', { 
                  cameraPosition: camera.position, 
                  cameraRotation: camera.rotation,
                  glContext: gl.getContext() ? 'valid' : 'invalid',
                  sceneChildren: scene.children.length,
                  canvasElement: canvas ? 'exists' : 'missing',
                  canvasWidth: canvas?.width,
                  canvasHeight: canvas?.height,
                  canvasStyle: canvas ? window.getComputedStyle(canvas).display : 'N/A'
                });
                
                // Verify canvas is in DOM
                if (canvas && !document.body.contains(canvas)) {
                  console.error('Canvas element not in DOM!');
                }
                
                // Point camera at character initially
                const characterPos = useStore.getState().characterPosition;
                console.log('Character position:', characterPos);
                camera.lookAt(characterPos.x, 1.1, characterPos.z);
                console.log('Camera lookAt set to:', characterPos.x, 1.1, characterPos.z);
                
                // Ensure WebGL context is valid
                const context = gl.getContext();
                if (!context) {
                  console.error('WebGL context is invalid - Canvas will not render');
                  // Try to get WebGL2 context as fallback
                  const canvas = gl.domElement;
                  const webgl2Context = canvas.getContext('webgl2');
                  if (webgl2Context) {
                    console.log('WebGL2 context available as fallback');
                  } else {
                    console.error('No WebGL context available - check browser support');
                  }
                } else {
                  const version = context.getParameter(context.VERSION);
                  const vendor = context.getParameter(context.VENDOR);
                  const renderer = context.getParameter(context.RENDERER);
                  console.log('WebGL context valid:', { version, vendor, renderer });
                  
                  // Verify WebGL is actually working
                  const testProgram = context.createProgram();
                  if (!testProgram) {
                    console.error('WebGL cannot create programs - context may be lost');
                  }
                }
                
                // Log scene after a short delay to see if objects are added
                setTimeout(() => {
                  console.log('Scene after render:', {
                    children: scene.children.length,
                    childrenNames: scene.children.map(c => c.type || c.constructor.name || 'unknown'),
                    cameraPosition: camera.position,
                    cameraLookAt: camera.getWorldDirection(new THREE.Vector3())
                  });
                  
                  // Verify renderer is working
                  if (gl.getContext()) {
                    console.log('Renderer state:', {
                      width: gl.domElement.width,
                      height: gl.domElement.height,
                      pixelRatio: gl.getPixelRatio()
                    });
                  }
                }, 1000);
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
