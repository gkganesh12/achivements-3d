import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useStore } from '../store/useStore';
import type { ExhibitData } from '../store/useStore';

const ACTIVATION_RADIUS = 0.6;

export const ActivationCircle = ({ exhibit }: { exhibit: ExhibitData }) => {
  const wasInCircle = useRef(false);
  const { characterPosition, activeExhibit, setActiveExhibit, isAmplified, setAmplified, setProfileActive } = useStore();
  
  const isActive = activeExhibit?.id === exhibit.id;
  
  // Position circles closer to the barricades
  const circleX = exhibit.wall === 'left' ? -2.1 : 2.1;
  const circleZ = exhibit.position.z;

  useFrame(() => {
    const distance = Math.sqrt(
      Math.pow(characterPosition.x - circleX, 2) +
      Math.pow(characterPosition.z - circleZ, 2)
    );

    const isInCircle = distance < ACTIVATION_RADIUS;
    
    // Enter circle - activate magnification
    if (isInCircle && !wasInCircle.current) {
      setActiveExhibit(exhibit);
      setProfileActive(false);
      setAmplified(true);
    }
    
    // Stay in circle - keep magnification active
    if (isInCircle && isActive && !isAmplified) {
      setAmplified(true);
    }
    
    // Leave circle - deactivate magnification
    if (!isInCircle && wasInCircle.current && isActive) {
      setAmplified(false);
      setActiveExhibit(null);
    }
    
    wasInCircle.current = isInCircle;
  });

  if (isAmplified && !isActive) return null;

  return (
    <group position={[circleX, 0.01, circleZ]}>
      {/* Smaller, sharp black circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.25, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={isActive ? 0.8 : 0.5} />
      </mesh>
    </group>
  );
};

export const ProfileActivationCircle = () => {
  const wasInCircle = useRef(false);
  const { characterPosition, isProfileActive, setProfileActive, setAmplified, setActiveExhibit, isAmplified } = useStore();

  const circleX = 0;
  const circleZ = -17.0;

  useFrame(() => {
    const distance = Math.sqrt(
      Math.pow(characterPosition.x - circleX, 2) +
      Math.pow(characterPosition.z - circleZ, 2)
    );

    const isInCircle = distance < ACTIVATION_RADIUS;

    // Enter circle - activate profile magnification
    if (isInCircle && !wasInCircle.current) {
      setActiveExhibit(null);
      setProfileActive(true);
      setAmplified(true);
    }
    
    // Stay in circle - keep magnification active
    if (isInCircle && isProfileActive && !isAmplified) {
      setAmplified(true);
    }

    // Leave circle - deactivate magnification
    if (!isInCircle && wasInCircle.current && isProfileActive) {
      setAmplified(false);
      setProfileActive(false);
    }

    wasInCircle.current = isInCircle;
  });

  if (isAmplified && !isProfileActive) return null;

  return (
    <group position={[circleX, 0.01, circleZ]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.55, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={isProfileActive ? 0.5 : 0.3} />
      </mesh>
    </group>
  );
};

// BIGGER pictures
export const Picture = ({ exhibit }: { exhibit: ExhibitData }) => {
  const frameRef = useRef<THREE.Group>(null);
  
  let xPos: number;
  let rotY: number;
  
  if (exhibit.wall === 'left') {
    xPos = -2.55;
    rotY = Math.PI / 2;
  } else if (exhibit.wall === 'right') {
    xPos = 2.55;
    rotY = -Math.PI / 2;
  } else {
    xPos = 0;
    rotY = 0;
  }

  // Use original z position since walls are now full length
  const scaledZ = exhibit.position.z;
  
  return (
    <group 
      ref={frameRef}
      position={[xPos, 2.1, scaledZ]}
      rotation={[0, rotY, 0]}
    >
      {/* Black frame - scaled down */}
      <mesh>
        <boxGeometry args={[1.5, 2.4, 0.05]} />
        <meshStandardMaterial color="#000000" roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* White inner */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.28, 2.18]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} metalness={0} />
      </mesh>
      
      {/* Content area */}
      <mesh position={[0, 0.06, 0.04]}>
        <planeGeometry args={[1.05, 1.58]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} metalness={0} />
      </mesh>
      
      <Text
        position={[0, 0.06, 0.05]}
        fontSize={0.075}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.9}
        textAlign="center"
        lineHeight={1.1}
      >
        {exhibit.title}
      </Text>
      
      <Text
        position={[0, -0.19, 0.05]}
        fontSize={0.045}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
      >
        {exhibit.year}
      </Text>
      
      <Text
        position={[0, -0.94, 0.05]}
        fontSize={0.034}
        color="#1a1a1a"
        anchorX="center"
        anchorY="middle"
      >
        {exhibit.subtitle}
      </Text>
    </group>
  );
};

export const RopeBarrier = ({ startX, startZ, endX, endZ, bold = false }: { startX: number; startZ: number; endX: number; endZ: number; bold?: boolean }) => {
  const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
  const angle = Math.atan2(endX - startX, endZ - startZ);
  
  // Calculate number of posts (one every ~0.8 units)
  const numPosts = Math.max(2, Math.floor(length / 0.8) + 1);
  
  const posts = [];
  for (let i = 0; i < numPosts; i++) {
    const t = i / (numPosts - 1);
    const postX = startX + (endX - startX) * t;
    const postZ = startZ + (endZ - startZ) * t;
    posts.push({ x: postX, z: postZ });
  }
  
  // Bold dimensions for profile wall - slightly smaller
  const postRadius = bold ? 0.035 : 0.018;
  const postHeight = bold ? 0.9 : 0.8;
  const railingThickness = bold ? 0.03 : 0.018;
  const postY = 0.4; // Start from floor level
  const railingY = bold ? 0.85 : 0.8; // Top of posts
  
  return (
    <group>
      {/* Vertical posts */}
      {posts.map((post, i) => (
        <group key={i}>
          <mesh position={[post.x, postY, post.z]}>
            <cylinderGeometry args={[postRadius, postRadius, postHeight, 8]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>
      ))}
      
      {/* Horizontal railing - positioned at top of posts */}
      <mesh position={[(startX + endX) / 2, railingY, (startZ + endZ) / 2]} rotation={[0, angle, 0]}>
        <boxGeometry args={[railingThickness, railingThickness, length]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};
