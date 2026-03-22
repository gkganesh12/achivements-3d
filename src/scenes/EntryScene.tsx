import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

export const EntryScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const titleRef = useRef<THREE.Group>(null);
  const { appState } = useStore();

  useFrame((state) => {
    if (titleRef.current) {
      titleRef.current.position.y = 2 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  if (appState !== 'ENTRANCE' && appState !== 'LOADING') return null;

  return (
    <group ref={groupRef}>
      {/* Void Background */}
      <mesh position={[0, 0, -20]}>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#050510" side={THREE.BackSide} />
      </mesh>

      {/* Central Light */}
      <pointLight position={[0, 3, 0]} intensity={2} color="#4a4aff" />
      <ambientLight intensity={0.1} />

      {/* Title Group */}
      <group ref={titleRef} position={[0, 2, 0]}>
        <Text
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          THE JOURNEY
        </Text>
        
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.15}
          color="#888888"
          anchorX="center"
          anchorY="middle"
        >
          An Immersive Portfolio Experience
        </Text>
      </group>

      {/* Avatar Placeholder */}
      <group position={[0, 0.5, 2]}>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[0.3, 0.8, 4, 16]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#3498db"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#3498db"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Glow Ring */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial 
            color="#3498db" 
            transparent 
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Enter Prompt */}
      <group position={[0, -1, 2]}>
        <Text
          fontSize={0.1}
          color="#4a4aff"
          anchorX="center"
          anchorY="middle"
        >
          Press SPACE or ENTER to begin
        </Text>
        
        {/* Pulsing indicator */}
        <mesh position={[0, -0.3, 0]}>
          <planeGeometry args={[0.1, 0.05]} />
          <meshBasicMaterial color="#4a4aff" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Floating Particles */}
      <EntryParticles />
    </group>
  );
};

const EntryParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4a4aff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
};
