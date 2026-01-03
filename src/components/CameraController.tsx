import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

export const CameraController = () => {
  const { camera } = useThree();
  const { characterPosition, isAmplified, activeExhibit, isProfileActive } = useStore();
  
  // Initialize camera to look at character position
  const characterStartPos = useStore.getState().characterPosition;
  const currentPosition = useRef(new THREE.Vector3(0, 2.1, 12));
  const currentLookAt = useRef(new THREE.Vector3(characterStartPos.x, 1.1, characterStartPos.z));
  const targetPosition = useRef(new THREE.Vector3(0, 2.1, 12));
  const targetLookAt = useRef(new THREE.Vector3(characterStartPos.x, 1.1, characterStartPos.z));

  useFrame(() => {

    if (isAmplified && isProfileActive) {
      targetPosition.current.set(0, 2.1, -6.5);
      targetLookAt.current.set(0, 4.3, -10.5);
      currentPosition.current.lerp(targetPosition.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
    } else if (isAmplified && activeExhibit) {
      // Zoom to picture when amplified
      const exhibit = activeExhibit;
      
      if (exhibit.wall === 'left') {
        targetPosition.current.set(exhibit.position.x + 4, 2.1, exhibit.position.z);
        targetLookAt.current.set(exhibit.position.x, 2.8, exhibit.position.z);
      } else if (exhibit.wall === 'right') {
        targetPosition.current.set(exhibit.position.x - 4, 2.1, exhibit.position.z);
        targetLookAt.current.set(exhibit.position.x, 2.8, exhibit.position.z);
      } else {
        targetPosition.current.set(0, 2.1, exhibit.position.z + 5);
        targetLookAt.current.set(exhibit.position.x, 2.8, exhibit.position.z);
      }
      
      currentPosition.current.lerp(targetPosition.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
    } else {
      // LENIENT NATURAL CAMERA - stays behind, doesn't dive or jump
      // Fixed height, smooth following, not too close
      targetPosition.current.set(
        characterPosition.x * 0.3, // Slight horizontal offset
        2.1, // Fixed lower height
        characterPosition.z + 7 // Stay behind
      );
      
      // Look ahead of character, at floor level mostly
      targetLookAt.current.set(
        characterPosition.x,
        1.1,
        characterPosition.z - 5
      );
      
      // Very smooth - lenient following (low lerp value)
      currentPosition.current.lerp(targetPosition.current, 0.02);
      currentLookAt.current.lerp(targetLookAt.current, 0.02);
    }

    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};
