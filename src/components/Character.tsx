import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

const MOVE_SPEED = 3.5;
const ROOM_BOUNDS = {
  minX: -2.0,
  maxX: 2.0,
  minZ: -17.8,
  maxZ: 2.0
};

export const Character = () => {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  
  const { characterPosition, keysPressed, setCharacterPosition, setCharacterRotation, isMenuOpen } = useStore();
  
  const currentPosition = useRef(new THREE.Vector3(characterPosition.x, 0, characterPosition.z));
  const currentRotation = useRef(Math.PI);
  const walkCycle = useRef(0);

  // Load the businessman 3D model with animations
  const { scene, animations } = useGLTF('/businessman.glb');
  const { actions, names } = useAnimations(animations, modelRef);
  
  // Clone the scene
  const clonedScene = scene.clone();

  useEffect(() => {
    // Setup shadows
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    // Log available animations for debugging
    console.log('Businessman animations:', names);
    
    // Play idle animation if available
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]]?.reset().play();
    }
  }, [clonedScene, names, actions]);

  // Hide character when viewing an exhibit
  const { isAmplified } = useStore();

  useFrame((_state, delta) => {
    if (isMenuOpen) return;
    
    // ... existing movement logic ...
    let moveX = 0;
    let moveZ = 0;

    const step = MOVE_SPEED * delta;
    if (keysPressed.has('ArrowUp') || keysPressed.has('KeyW')) moveZ -= step;
    if (keysPressed.has('ArrowDown') || keysPressed.has('KeyS')) moveZ += step;
    if (keysPressed.has('ArrowLeft') || keysPressed.has('KeyA')) moveX -= step;
    if (keysPressed.has('ArrowRight') || keysPressed.has('KeyD')) moveX += step;

    if (moveX !== 0 && moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX = (moveX / length) * step;
      moveZ = (moveZ / length) * step;
    }

    const isMoving = moveX !== 0 || moveZ !== 0;

    if (isMoving) {
      const nextX = THREE.MathUtils.clamp(
        characterPosition.x + moveX,
        ROOM_BOUNDS.minX,
        ROOM_BOUNDS.maxX
      );
      const nextZ = THREE.MathUtils.clamp(
        characterPosition.z + moveZ,
        ROOM_BOUNDS.minZ,
        ROOM_BOUNDS.maxZ
      );
      setCharacterPosition({ x: nextX, z: nextZ });
      
      const targetRotation = Math.atan2(moveX, moveZ);
      setCharacterRotation(targetRotation);
      walkCycle.current += delta * 15; // Faster walk cycle
    }

    if (groupRef.current) {
      // Smooth position following
      currentPosition.current.lerp(
        new THREE.Vector3(characterPosition.x, 0, characterPosition.z),
        0.15
      );
      groupRef.current.position.x = currentPosition.current.x;
      groupRef.current.position.z = currentPosition.current.z;
      
      // Smooth rotation
      const targetRot = useStore.getState().characterRotation;
      let diff = targetRot - currentRotation.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      currentRotation.current += diff * 0.12;
      groupRef.current.rotation.y = currentRotation.current;
      
      // ENHANCED PROCEDURAL WALK ANIMATION
      if (modelRef.current) {
        if (isMoving) {
          // More pronounced bob (up and down)
          const bob = Math.abs(Math.sin(walkCycle.current)) * 0.04;
          modelRef.current.position.y = bob;
          
          // Side-to-side sway (like steps)
          const sway = Math.sin(walkCycle.current) * 0.03;
          modelRef.current.rotation.z = sway; // Rocking side to side
          
          // Forward/Backward tilt (acceleration/deceleration feel)
          modelRef.current.rotation.x = (Math.sin(walkCycle.current * 2) * 0.02);
        } else {
          // Return to neutral
          modelRef.current.position.y = THREE.MathUtils.lerp(modelRef.current.position.y, 0, 0.1);
          modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, 0, 0.1);
          modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, 0, 0.1);
        }
      }
    }
  });

  if (isAmplified) return null; // Hide character when zoomed in

  return (
    <group ref={groupRef} position={[characterPosition.x, 0, characterPosition.z]}>
      {/* Businessman 3D Model - larger and straight */}
      <group ref={modelRef}>
        <primitive 
          object={clonedScene} 
          scale={2.2}
          position={[0, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </group>
    </group>
  );
};

// Preload the model
useGLTF.preload('/businessman.glb');
