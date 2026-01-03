import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

const MOVE_SPEED = 3.5;
const ROOM_BOUNDS = {
  minX: -3.1,
  maxX: 3.1,
  minZ: -10.6,
  maxZ: 2.6
};

interface Footprint {
  id: number;
  x: number;
  z: number;
  opacity: number;
  rotation: number;
}

export const Character = () => {
  const groupRef = useRef<THREE.Group>(null);
  const leftFootRef = useRef<THREE.Mesh>(null);
  const rightFootRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  
  const { characterPosition, keysPressed, setCharacterPosition, setCharacterRotation, isAmplified, isMenuOpen } = useStore();
  
  const currentPosition = useRef(new THREE.Vector3(characterPosition.x, 0, characterPosition.z));
  const currentRotation = useRef(Math.PI);
  const walkCycle = useRef(0);
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const lastFootprintTime = useRef({ left: 0, right: 0 });
  const footprintIdCounter = useRef(0);

  useFrame((_state, delta) => {
    if (isMenuOpen) return;
    
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
      walkCycle.current += delta * 12;
    }

    if (groupRef.current) {
      currentPosition.current.lerp(
        new THREE.Vector3(characterPosition.x, 0, characterPosition.z),
        0.15
      );
      groupRef.current.position.x = currentPosition.current.x;
      groupRef.current.position.z = currentPosition.current.z;
      
      const targetRot = useStore.getState().characterRotation;
      let diff = targetRot - currentRotation.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      currentRotation.current += diff * 0.12;
      groupRef.current.rotation.y = currentRotation.current;
      
      // Body bob when walking
      if (isMoving) {
        groupRef.current.position.y = Math.abs(Math.sin(walkCycle.current * 2)) * 0.02;
      } else {
        groupRef.current.position.y *= 0.9;
      }
    }
    
    // Animate legs and feet with realistic human walking motion (alternating left-right)
    if (leftFootRef.current && rightFootRef.current && leftLegRef.current && rightLegRef.current) {
      if (isMoving) {
        // Human walking: when left leg is forward, right is back (and vice versa)
        // Left leg forward phase (0 to PI)
        const leftPhase = walkCycle.current;
        const rightPhase = walkCycle.current + Math.PI; // 180 degrees out of phase
        
        // Left leg: lift foot and move forward
        const leftLift = Math.max(0, Math.sin(leftPhase)) * 0.1;
        const leftForward = Math.sin(leftPhase) * 0.08; // Forward/backward motion
        leftFootRef.current.position.y = leftLift;
        leftFootRef.current.position.z = 0.06 + leftForward;
        leftLegRef.current.rotation.x = Math.sin(leftPhase) * 0.3; // Leg swing
        
        // Right leg: lift foot and move forward (opposite phase)
        const rightLift = Math.max(0, Math.sin(rightPhase)) * 0.1;
        const rightForward = Math.sin(rightPhase) * 0.08; // Forward/backward motion
        rightFootRef.current.position.y = rightLift;
        rightFootRef.current.position.z = 0.06 + rightForward;
        rightLegRef.current.rotation.x = Math.sin(rightPhase) * 0.3; // Leg swing
        
        // Create footprints when foot touches ground (when lift is minimal)
        const currentTime = Date.now();
        if (leftLift < 0.02 && currentTime - lastFootprintTime.current.left > 300) {
          // Calculate footprint position relative to character
          const cos = Math.cos(currentRotation.current);
          const sin = Math.sin(currentRotation.current);
          const footOffsetX = -0.06 * cos - 0.08 * sin;
          const footOffsetZ = -0.06 * sin + 0.08 * cos;
          
          setFootprints(prev => [...prev, {
            id: footprintIdCounter.current++,
            x: currentPosition.current.x + footOffsetX,
            z: currentPosition.current.z + footOffsetZ,
            opacity: 0.3,
            rotation: currentRotation.current
          }]);
          lastFootprintTime.current.left = currentTime;
        }
        
        if (rightLift < 0.02 && currentTime - lastFootprintTime.current.right > 300) {
          // Calculate footprint position relative to character
          const cos = Math.cos(currentRotation.current);
          const sin = Math.sin(currentRotation.current);
          const footOffsetX = 0.06 * cos - 0.08 * sin;
          const footOffsetZ = 0.06 * sin + 0.08 * cos;
          
          setFootprints(prev => [...prev, {
            id: footprintIdCounter.current++,
            x: currentPosition.current.x + footOffsetX,
            z: currentPosition.current.z + footOffsetZ,
            opacity: 0.3,
            rotation: currentRotation.current
          }]);
          lastFootprintTime.current.right = currentTime;
        }
      } else {
        // Return to neutral position when not moving
        leftFootRef.current.position.y *= 0.8;
        leftFootRef.current.position.z = 0.06;
        leftLegRef.current.rotation.x *= 0.8;
        rightFootRef.current.position.y *= 0.8;
        rightFootRef.current.position.z = 0.06;
        rightLegRef.current.rotation.x *= 0.8;
      }
    }
    
    // Fade out footprints over time
    setFootprints(prev => {
      return prev
        .map(fp => ({ ...fp, opacity: fp.opacity - delta * 0.5 }))
        .filter(fp => fp.opacity > 0);
    });
  });



  // Simple stickman character
  return (
    <group ref={groupRef} position={[characterPosition.x, 0, characterPosition.z]} scale={1.0}>
      {/* Head - simple circle */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Torso - vertical line */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Left Arm - diagonal line */}
      <mesh position={[-0.12, 0.75, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Right Arm - diagonal line */}
      <mesh position={[0.12, 0.75, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Left Leg - with animation reference */}
      <mesh ref={leftLegRef} position={[-0.06, 0.35, 0]} rotation={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Right Leg - with animation reference */}
      <mesh ref={rightLegRef} position={[0.06, 0.35, 0]} rotation={[0, 0, -0.1]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Left foot - with lift animation */}
      <mesh ref={leftFootRef} position={[-0.06, 0.02, 0.08]} castShadow>
        <boxGeometry args={[0.06, 0.03, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Right foot - with lift animation */}
      <mesh ref={rightFootRef} position={[0.06, 0.02, 0.08]} castShadow>
        <boxGeometry args={[0.06, 0.03, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Standing circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.25, 0.28, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
      
      {/* Footprints */}
      {footprints.map(fp => (
        <mesh
          key={fp.id}
          rotation={[-Math.PI / 2, fp.rotation, 0]}
          position={[fp.x, 0.015, fp.z]}
        >
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color="#000000" transparent opacity={fp.opacity} />
        </mesh>
      ))}
    </group>
  );
};
