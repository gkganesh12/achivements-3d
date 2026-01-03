import { useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
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
  console.log('Experience component rendering - this should appear in console');
  
  // Use useThree to access scene directly and ensure objects are added
  const { scene, invalidate } = useThree();
  
  useEffect(() => {
    console.log('Experience useEffect - scene children:', scene.children.length);
    
    // Force R3F to update/render
    invalidate();
    
    // Check again after a short delay
    setTimeout(() => {
      console.log('Experience - scene children after delay:', scene.children.length);
      if (scene.children.length === 0) {
        console.error('R3F reconciliation failed - scene still empty after Experience render');
      }
    }, 500);
  }, [scene, invalidate]);
  
  return (
    <>
      {/* Test: Add a very visible red box with light to verify rendering works */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="red" emissive="red" emissiveIntensity={0.5} />
      </mesh>
      {/* Add a bright light to ensure visibility */}
      <pointLight position={[0, 5, 0]} intensity={2} color="#ffffff" />
      <ambientLight intensity={1} />
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
                
                // CRITICAL: Ensure canvas is visible and has proper dimensions
                if (canvas) {
                  canvas.style.display = 'block';
                  canvas.style.width = '100%';
                  canvas.style.height = '100%';
                  canvas.style.position = 'absolute';
                  canvas.style.top = '0';
                  canvas.style.left = '0';
                  
                  // Force canvas to be visible
                  const computedStyle = window.getComputedStyle(canvas);
                  console.log('Canvas computed styles:', {
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity,
                    width: computedStyle.width,
                    height: computedStyle.height,
                    zIndex: computedStyle.zIndex
                  });
                }
                
                console.log('Canvas created successfully', { 
                  cameraPosition: camera.position, 
                  cameraRotation: camera.rotation,
                  glContext: gl.getContext() ? 'valid' : 'invalid',
                  sceneChildren: scene.children.length,
                  canvasElement: canvas ? 'exists' : 'missing',
                  canvasWidth: canvas?.width,
                  canvasHeight: canvas?.height,
                  canvasParent: canvas?.parentElement?.id || 'no parent'
                });
                
                // Verify canvas is in DOM
                if (canvas) {
                  if (!document.body.contains(canvas)) {
                    console.error('Canvas element not in DOM!');
                  } else {
                    console.log('Canvas is in DOM, parent:', canvas.parentElement?.tagName);
                  }
                  
                  // Ensure canvas is not hidden
                  if (canvas.style.display === 'none' || canvas.style.visibility === 'hidden') {
                    console.warn('Canvas is hidden! Fixing...');
                    canvas.style.display = 'block';
                    canvas.style.visibility = 'visible';
                  }
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
                  const webgl2Context = canvas?.getContext('webgl2');
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
                  } else {
                    console.log('WebGL can create programs - context is functional');
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
                  
                  // CRITICAL: If scene has no children, manually add Museum scene objects
                  if (scene.children.length === 0) {
                    console.error('Scene has NO children - R3F reconciliation failed!');
                    console.error('This indicates React Three Fiber is not processing JSX correctly in production');
                    console.error('Adding Museum scene objects manually as fallback...');
                    
                    // Create a group for the museum
                    const museumGroup = new THREE.Group();
                    
                    // Add floor
                    const floorGeometry = new THREE.PlaneGeometry(7, 14);
                    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
                    floor.rotation.x = -Math.PI / 2;
                    floor.position.set(0, 0, -4);
                    museumGroup.add(floor);
                    
                    // Add entry floor
                    const entryFloor = new THREE.Mesh(
                      new THREE.PlaneGeometry(12, 10),
                      new THREE.MeshBasicMaterial({ color: 0xffffff })
                    );
                    entryFloor.rotation.x = -Math.PI / 2;
                    entryFloor.position.set(0, 0, 7);
                    museumGroup.add(entryFloor);
                    
                    // Add walls
                    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
                    
                    // Left wall
                    const leftWall = new THREE.Mesh(
                      new THREE.BoxGeometry(0.08, 8, 13.5),
                      wallMaterial
                    );
                    leftWall.position.set(-3.5, 4, -4);
                    museumGroup.add(leftWall);
                    
                    // Right wall
                    const rightWall = new THREE.Mesh(
                      new THREE.BoxGeometry(0.08, 8, 13.5),
                      wallMaterial
                    );
                    rightWall.position.set(3.5, 4, -4);
                    museumGroup.add(rightWall);
                    
                    // Back wall
                    const backWall = new THREE.Mesh(
                      new THREE.BoxGeometry(6.8, 8, 0.08),
                      wallMaterial
                    );
                    backWall.position.set(0, 4, -10.5);
                    museumGroup.add(backWall);
                    
                    // Add backdrop walls
                    const backdropMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
                    const leftBackdrop = new THREE.Mesh(new THREE.BoxGeometry(0.1, 12, 22), backdropMaterial);
                    leftBackdrop.position.set(-5.5, 5, -4);
                    museumGroup.add(leftBackdrop);
                    
                    const rightBackdrop = new THREE.Mesh(new THREE.BoxGeometry(0.1, 12, 22), backdropMaterial);
                    rightBackdrop.position.set(5.5, 5, -4);
                    museumGroup.add(rightBackdrop);
                    
                    const topBackdrop = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.1, 22), backdropMaterial);
                    topBackdrop.position.set(0, 10, -4);
                    museumGroup.add(topBackdrop);
                    
                    const backBackdrop = new THREE.Mesh(new THREE.BoxGeometry(11.2, 12, 0.1), backdropMaterial);
                    backBackdrop.position.set(0, 5, -14.8);
                    museumGroup.add(backBackdrop);
                    
                    // Add lighting
                    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
                    museumGroup.add(ambientLight);
                    
                    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
                    dirLight1.position.set(0, 8, 3);
                    museumGroup.add(dirLight1);
                    
                    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
                    dirLight2.position.set(0, 6, -2);
                    museumGroup.add(dirLight2);
                    
                    const pointLight1 = new THREE.PointLight(0xffffff, 0.4, 15);
                    pointLight1.position.set(0, 7, -3);
                    museumGroup.add(pointLight1);
                    
                    const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 12);
                    pointLight2.position.set(0, 7, -7);
                    museumGroup.add(pointLight2);
                    
                    // Add fog
                    scene.fog = new THREE.Fog(0xffffff, 40, 100);
                    
                    // Add the museum group to scene
                    scene.add(museumGroup);
                    
                    console.log('Manually added Museum scene objects, children now:', scene.children.length);
                    
                    // Force immediate render
                    gl.render(scene, camera);
                  }
                  
                  // Verify renderer is working
                  if (gl.getContext()) {
                    console.log('Renderer state:', {
                      width: gl.domElement.width,
                      height: gl.domElement.height,
                      pixelRatio: gl.getPixelRatio()
                    });
                    
                    // Force a render
                    gl.render(scene, camera);
                    console.log('Forced render completed, scene children:', scene.children.length);
                  }
                }, 1000);
              }}
              onError={(error) => {
                console.error('Canvas error:', error);
              }}
            >
              <color attach="background" args={['#ffffff']} />
              <Suspense fallback={null}>
                <Experience />
              </Suspense>
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
