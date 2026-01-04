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

  useFrame(() => {

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
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
