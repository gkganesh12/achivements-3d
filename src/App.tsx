import { useEffect, useState, Suspense } from 'react';
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

// Separate component to check R3F state without using useThree hook
function R3FStateChecker() {
  const { scene, gl } = useThree();
  
  useEffect(() => {
    console.log('R3FStateChecker - scene children:', scene.children.length);
    
    // Check if R3F context is properly set up
    const r3fState = (gl as any)?._r3f;
    const root = (gl as any)?._r3f?.root;
    const reconciler = (gl as any)?._r3f?.reconciler;
    
    console.log('Experience - R3F state check:', {
      r3fState: r3fState ? 'exists' : 'missing',
      root: root ? 'exists' : 'missing',
      reconciler: reconciler ? 'exists' : 'missing',
      sceneChildren: scene.children.length,
      rootChildren: root?.current?.children?.length || 0
    });
    
    // Check again after delays
    setTimeout(() => {
      console.log('R3FStateChecker - scene children after 500ms:', scene.children.length);
      if (scene.children.length === 0) {
        console.error('R3F reconciliation failed - scene still empty after Experience render');
        console.error('This suggests the reconciler is not processing JSX children');
      }
    }, 500);
  }, [scene, gl]);
  
  return null;
}

function Experience() {
  const { appState } = useStore();
  // CRITICAL: useThree must be called unconditionally for R3F to work
  // This hook access is what triggers R3F reconciler initialization
  const three = useThree();
  const { gl, scene } = three;
  const [reconcilerReady, setReconcilerReady] = useState(false);
  
  console.log('Experience component rendering - appState:', appState);
  console.log('Experience - useThree returned:', {
    hasGl: !!gl,
    hasScene: !!scene,
    glType: gl?.constructor?.name
  });
  
  // Check if R3F reconciler is initialized
  useEffect(() => {
    const checkReconciler = () => {
      const r3fState = (gl as any)?._r3f;
      const reconciler = (gl as any)?._r3f?.reconciler;
      const root = (gl as any)?._r3f?.root;
      
      if (r3fState && reconciler) {
        console.log('R3F reconciler is ready!', {
          hasReconciler: !!reconciler,
          hasRoot: !!root,
          rootCurrent: root?.current ? 'exists' : 'missing'
        });
        setReconcilerReady(true);
        return true;
      }
      
      // Log detailed state for debugging
      if (!r3fState) {
        const glKeys = Object.keys(gl).filter(k => k.startsWith('_'));
        console.warn('R3F reconciler check: _r3f is missing on gl object');
        console.warn('gl object keys starting with _:', glKeys);
        console.warn('gl object type:', gl.constructor?.name || 'unknown');
        console.warn('gl object is WebGLRenderer?', gl instanceof THREE.WebGLRenderer);
        // Check if R3F is actually loaded
        console.warn('R3F Canvas imported?', typeof Canvas !== 'undefined');
      } else if (!reconciler) {
        console.warn('R3F reconciler check: _r3f exists but reconciler is missing');
        console.warn('_r3f keys:', Object.keys(r3fState));
      }
      
      return false;
    };
    
    // Check immediately
    if (checkReconciler()) {
      return;
    }
    
    // If not ready, check periodically
    const interval = setInterval(() => {
      if (checkReconciler()) {
        clearInterval(interval);
      }
    }, 100);
    
    // Timeout after 3 seconds (increased from 2)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!reconcilerReady) {
        console.error('R3F reconciler failed to initialize after 3 seconds');
        console.error('This is a critical issue - R3F Canvas may not be working properly');
        console.error('Attempting to render anyway - reconciler may initialize later');
        // Still try to render - might work anyway
        setReconcilerReady(true);
      }
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [gl, reconcilerReady]);
  
  // Always render at least one mesh to ensure reconciler initializes
  // The reconciler needs actual geometry to initialize, not just lights
  // Only render full content when in MUSEUM state AND reconciler is ready
  if (appState !== 'MUSEUM' || !reconcilerReady) {
    // Render minimal but real geometry to force reconciler initialization
    return (
      <>
        {/* Invisible mesh to force reconciler initialization */}
        <mesh position={[0, -100, 0]} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <ambientLight intensity={0.1} />
      </>
    );
  }
  
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
      <R3FStateChecker />
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
        {/* 3D Canvas - Always mount and fully visible for R3F reconciler initialization */}
        {/* CRITICAL: Canvas must be visible with proper dimensions for reconciler to initialize */}
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
              frameloop="always"
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
                
                // Check if R3F reconciler is available
                const r3fState = (gl as any)?._r3f;
                const root = (gl as any)?._r3f?.root;
                const reconciler = (gl as any)?._r3f?.reconciler;
                
                console.log('Canvas created successfully', { 
                  cameraPosition: camera.position, 
                  cameraRotation: camera.rotation,
                  glContext: gl.getContext() ? 'valid' : 'invalid',
                  sceneChildren: scene.children.length,
                  canvasElement: canvas ? 'exists' : 'missing',
                  canvasWidth: canvas?.width,
                  canvasHeight: canvas?.height,
                  canvasParent: canvas?.parentElement?.id || 'no parent',
                  r3fState: r3fState ? 'initialized' : 'not initialized',
                  hasRoot: root ? 'yes' : 'no',
                  hasReconciler: reconciler ? 'yes' : 'no',
                  glKeys: Object.keys(gl).filter(k => k.startsWith('_')),
                  glKeysFull: Object.keys(gl).slice(0, 20), // First 20 keys for debugging
                  glConstructor: gl.constructor?.name || 'unknown'
                });
                
                if (!r3fState) {
                  console.error('CRITICAL: R3F reconciler state (_r3f) is missing!');
                  console.error('This means R3F Canvas did not initialize the reconciler');
                  console.error('Possible causes:');
                  console.error('1. R3F bundle is corrupted or not loaded');
                  console.error('2. React version mismatch');
                  console.error('3. Canvas children not rendering properly');
                  console.error('4. Production build issue with R3F initialization');
                  
                  // Verify R3F is actually imported
                  console.error('R3F Canvas type:', typeof Canvas);
                  console.error('R3F useThree type:', typeof useThree);
                  
                  // Check if gl is actually a WebGLRenderer
                  console.error('gl is WebGLRenderer?', gl instanceof THREE.WebGLRenderer);
                  console.error('gl constructor:', gl.constructor?.name);
                  
                  // Check all gl properties
                  const allGlKeys = Object.keys(gl);
                  console.error('All gl keys (first 30):', allGlKeys.slice(0, 30));
                  console.error('gl keys starting with _:', allGlKeys.filter(k => k.startsWith('_')));
                }
                
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
                
                // Check R3F reconciler state after a delay
                setTimeout(() => {
                  // Try to access R3F internal state to check reconciler
                  const r3fInternal = (gl as any)?._r3f;
                  const root = (gl as any)?._r3f?.root;
                  const reconciler = (gl as any)?._r3f?.reconciler;
                  
                  console.log('R3F Reconciler Check:', {
                    r3fState: r3fInternal ? 'exists' : 'missing',
                    root: root ? 'exists' : 'missing',
                    rootCurrent: root?.current ? 'exists' : 'missing',
                    rootChildren: root?.current?.children?.length || 0,
                    reconciler: reconciler ? 'exists' : 'missing',
                    reconcilerType: reconciler ? typeof reconciler : 'N/A'
                  });
                  
                  // If reconciler exists but root has no children, try to force update
                  if (reconciler && root && root.current && root.current.children?.length === 0) {
                    console.warn('Reconciler exists but root has no children - attempting to force update');
                    // Try to access the reconciler's updateContainer method
                    if (typeof reconciler.updateContainer === 'function') {
                      console.log('Reconciler has updateContainer method - this is good');
                    }
                  }
                  
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

        {/* UI Overlays - always render */}
        <HUD />
      </div>
    </ErrorBoundary>
  );
}

export default App;
