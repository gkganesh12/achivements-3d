import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useStore } from '../store/useStore';
import type { ExhibitData } from '../store/useStore';
import { GOLD_PROPS } from './Decor';

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
        <meshBasicMaterial color="#d4af37" transparent opacity={isProfileActive ? 0.95 : 0.7} />
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

      {/* Brass gallery lamp above the frame */}
      <group position={[0, 1.34, 0.02]}>
        <mesh position={[0, 0.03, 0.07]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.011, 0.011, 0.24, 8]} />
          <meshStandardMaterial {...GOLD_PROPS} />
        </mesh>
        <mesh position={[0, -0.06, 0.16]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, 0.6, 14, 1]} />
          <meshStandardMaterial {...GOLD_PROPS} />
        </mesh>
        {/* warm underglow washing the top of the frame */}
        <mesh position={[0, -0.32, 0.09]} rotation={[-0.18, 0, 0]}>
          <planeGeometry args={[1.34, 0.55]} />
          <meshBasicMaterial color="#ffd9a0" transparent opacity={0.14} depthWrite={false} />
        </mesh>
      </group>
      
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

// Gold stanchions with sagging red velvet ropes
export const RopeBarrier = ({ startX, startZ, endX, endZ, bold = false }: { startX: number; startZ: number; endX: number; endZ: number; bold?: boolean }) => {
  const { posts, ropeGeometries } = useMemo(() => {
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2));
    const spacing = bold ? 1.15 : 1.6;
    const numPosts = Math.max(2, Math.round(length / spacing) + 1);

    const posts: { x: number; z: number }[] = [];
    for (let i = 0; i < numPosts; i++) {
      const t = i / (numPosts - 1);
      posts.push({ x: startX + (endX - startX) * t, z: startZ + (endZ - startZ) * t });
    }

    const ropeY = bold ? 0.78 : 0.72;
    const sag = bold ? 0.1 : 0.13;
    const ropeRadius = bold ? 0.028 : 0.022;
    const ropeGeometries = posts.slice(0, -1).map((post, i) => {
      const next = posts[i + 1];
      const a = new THREE.Vector3(post.x, ropeY, post.z);
      const b = new THREE.Vector3(next.x, ropeY, next.z);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      mid.y -= sag;
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      return new THREE.TubeGeometry(curve, 14, ropeRadius, 8, false);
    });
    return { posts, ropeGeometries };
  }, [startX, startZ, endX, endZ, bold]);

  const postRadius = bold ? 0.03 : 0.022;
  const postHeight = bold ? 0.82 : 0.76;

  return (
    <group>
      {posts.map((post, i) => (
        <group key={i} position={[post.x, 0, post.z]}>
          {/* weighted base */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[postRadius * 3.4, postRadius * 4, 0.045, 16]} />
            <meshStandardMaterial {...GOLD_PROPS} />
          </mesh>
          {/* pole */}
          <mesh position={[0, postHeight / 2, 0]}>
            <cylinderGeometry args={[postRadius, postRadius, postHeight, 10]} />
            <meshStandardMaterial {...GOLD_PROPS} />
          </mesh>
          {/* collar under the finial */}
          <mesh position={[0, postHeight - 0.015, 0]}>
            <cylinderGeometry args={[postRadius * 1.7, postRadius * 1.7, 0.02, 12]} />
            <meshStandardMaterial {...GOLD_PROPS} />
          </mesh>
          {/* finial ball */}
          <mesh position={[0, postHeight + 0.045, 0]}>
            <sphereGeometry args={[postRadius * 2.1, 16, 16]} />
            <meshStandardMaterial {...GOLD_PROPS} />
          </mesh>
        </group>
      ))}
      {ropeGeometries.map((geometry, i) => (
        <mesh key={`rope-${i}`} geometry={geometry}>
          <meshStandardMaterial color="#8f1024" roughness={0.9} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
};
