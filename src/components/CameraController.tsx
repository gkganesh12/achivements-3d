import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

export const CameraController = () => {
  const { camera } = useThree();
  const { characterPosition, isAmplified, activeExhibit, isProfileActive } = useStore();
  
  // Initialize camera to look at character position - ZOOMED IN
  const characterStartPos = useStore.getState().characterPosition;
  const currentPosition = useRef(new THREE.Vector3(0, 1.6, characterStartPos.z + 3));
  const currentLookAt = useRef(new THREE.Vector3(characterStartPos.x, 1.5, characterStartPos.z - 3));
  const targetPosition = useRef(new THREE.Vector3(0, 1.6, characterStartPos.z + 3));
  const targetLookAt = useRef(new THREE.Vector3(characterStartPos.x, 1.5, characterStartPos.z - 3));

  // Subtle head-bob while walking — sells the stride without causing motion sickness
  const bobEnvelope = useRef(0);
  const bobPhase = useRef(0);

  useFrame((_, delta) => {
    const keys = useStore.getState().keysPressed;
    const isWalking =
      !isAmplified &&
      ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].some((k) => keys.has(k));
    bobEnvelope.current = THREE.MathUtils.lerp(bobEnvelope.current, isWalking ? 1 : 0, 0.07);
    if (isWalking) bobPhase.current += delta * 9.5; // matches the character's stride rate

    if (isAmplified && isProfileActive) {
      targetPosition.current.set(0, 1.6, -14.5);
      targetLookAt.current.set(0, 3.2, -18);
      currentPosition.current.lerp(targetPosition.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
    } else if (isAmplified && activeExhibit) {
      // Zoom to picture when amplified - ZOOMED OUT to see whole picture
      const exhibit = activeExhibit;
      
      if (exhibit.wall === 'left') {
        // Pulled back from left wall to see full frame
        targetPosition.current.set(exhibit.position.x + 3.5, 1.6, exhibit.position.z + 0.3);
        targetLookAt.current.set(exhibit.position.x, 2.1, exhibit.position.z);
      } else if (exhibit.wall === 'right') {
        // Pulled back from right wall to see full frame
        targetPosition.current.set(exhibit.position.x - 3.5, 1.6, exhibit.position.z + 0.3);
        targetLookAt.current.set(exhibit.position.x, 2.1, exhibit.position.z);
      } else {
        targetPosition.current.set(0, 1.6, exhibit.position.z + 3.5);
        targetLookAt.current.set(exhibit.position.x, 2.1, exhibit.position.z);
      }
      
      currentPosition.current.lerp(targetPosition.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
    } else {
      // IMMERSIVE CAMERA - very close to character, no exterior visible
      targetPosition.current.set(
        characterPosition.x * 0.15, // Minimal horizontal offset
        1.5, // Slightly lower eye level
        characterPosition.z + 2 // Very close behind character
      );
      
      // Look forward at character level
      targetLookAt.current.set(
        characterPosition.x,
        1.6,
        characterPosition.z - 2.5
      );
      
      // Smooth following
      currentPosition.current.lerp(targetPosition.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
    }

    camera.position.copy(currentPosition.current);

    // Apply the walk bob on top of the smoothed follow position
    const env = bobEnvelope.current;
    if (env > 0.001) {
      camera.position.y += Math.abs(Math.sin(bobPhase.current)) * 0.018 * env;
      camera.position.x += Math.sin(bobPhase.current) * 0.01 * env;
    }

    camera.lookAt(currentLookAt.current);

    // A whisper of roll with each step
    if (env > 0.001) {
      camera.rotation.z += Math.sin(bobPhase.current) * 0.0022 * env;
    }
  });

  return null;
};
