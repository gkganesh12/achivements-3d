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
      {/* Void Background - deep warm black */}
      <mesh position={[0, 0, -20]}>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#120709" side={THREE.BackSide} />
      </mesh>

      {/* Central Light - warm gold */}
      <pointLight position={[0, 3, 0]} intensity={30} distance={20} color="#ffd9a0" />
      <ambientLight intensity={0.12} color="#ffe6c4" />

      {/* Title Group */}
      <group ref={titleRef} position={[0, 2, 0]}>
        <Text
          fontSize={0.5}
          color="#f7ecd4"
          anchorX="center"
          anchorY="middle"
        >
          THE JOURNEY
        </Text>

        <Text
          position={[0, -0.6, 0]}
          fontSize={0.15}
          color="#c9b48a"
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
            color="#17120c"
            metalness={0.8}
            roughness={0.2}
            emissive="#d9a441"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Head */}
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial
            color="#17120c"
            metalness={0.8}
            roughness={0.2}
            emissive="#d9a441"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* Glow Ring */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.7, 32]} />
          <meshBasicMaterial
            color="#d4af37"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Enter Prompt */}
      <group position={[0, -1, 2]}>
        <Text
          fontSize={0.1}
          color="#d4af37"
          anchorX="center"
          anchorY="middle"
        >
          Press SPACE or ENTER to begin
        </Text>

        {/* Pulsing indicator */}
        <mesh position={[0, -0.3, 0]}>
          <planeGeometry args={[0.1, 0.05]} />
          <meshBasicMaterial color="#d4af37" transparent opacity={0.8} />
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
        color="#d9a441"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};
