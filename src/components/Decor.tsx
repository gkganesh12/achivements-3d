import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Shared royal-gold material settings. The slight emissive keeps the metal from
// reading black — the scene has no environment map, only punctual lights.
export const GOLD_PROPS = {
  color: '#d9a441',
  metalness: 0.65,
  roughness: 0.28,
  emissive: '#6b4a12',
  emissiveIntensity: 0.22,
} as const;

const IVORY = '#fff6e0';
const FLAME = '#ffc36b';
const WARM_LIGHT = '#ffd9a0';

const ringAngles = (count: number, offset = 0) =>
  Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2 + offset);

/** Spotlight that actually aims at a point (three spotlights target the origin by default). */
export const AimedSpot = ({
  position,
  target,
  angle = 0.5,
  penumbra = 0.6,
  intensity = 10,
  distance = 14,
  color = WARM_LIGHT,
}: {
  position: [number, number, number];
  target: [number, number, number];
  angle?: number;
  penumbra?: number;
  intensity?: number;
  distance?: number;
  color?: string;
}) => {
  const lightRef = useRef<THREE.SpotLight>(null);
  const [tx, ty, tz] = target;

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;
    light.target.position.set(tx, ty, tz);
    light.target.updateMatrixWorld();
  }, [tx, ty, tz]);

  return (
    <spotLight
      ref={lightRef}
      position={position}
      angle={angle}
      penumbra={penumbra}
      intensity={intensity}
      distance={distance}
      color={color}
    />
  );
};

const Candle = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* cup */}
    <mesh position={[0, 0.02, 0]}>
      <cylinderGeometry args={[0.03, 0.022, 0.035, 10]} />
      <meshStandardMaterial {...GOLD_PROPS} />
    </mesh>
    {/* wax body */}
    <mesh position={[0, 0.085, 0]}>
      <cylinderGeometry args={[0.016, 0.016, 0.1, 8]} />
      <meshStandardMaterial color={IVORY} roughness={0.6} />
    </mesh>
    {/* flame */}
    <mesh position={[0, 0.155, 0]} scale={[1, 1.7, 1]}>
      <sphereGeometry args={[0.016, 8, 8]} />
      <meshBasicMaterial color={FLAME} toneMapped={false} />
    </mesh>
  </group>
);

const CrystalDrop = ({ position, length }: { position: [number, number, number]; length: number }) => (
  <group position={position}>
    <mesh position={[0, -length / 2, 0]}>
      <cylinderGeometry args={[0.0035, 0.0035, length, 6]} />
      <meshStandardMaterial {...GOLD_PROPS} />
    </mesh>
    <mesh position={[0, -length - 0.03, 0]}>
      <octahedronGeometry args={[0.034]} />
      <meshStandardMaterial
        color="#eef3ff"
        metalness={0.25}
        roughness={0.05}
        transparent
        opacity={0.78}
        emissive="#9db8ff"
        emissiveIntensity={0.3}
      />
    </mesh>
  </group>
);

/**
 * Two-tier gold ring chandelier: candles standing on both rings, crystal drops
 * hanging beneath them, a flickering warm light and a faux volumetric shaft
 * falling to the floor. Group origin sits at the ceiling attachment point.
 */
export const GrandChandelier = ({ position }: { position: [number, number, number] }) => {
  const crystalsRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const flickerPhase = position[2];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (crystalsRef.current) crystalsRef.current.rotation.y = t * 0.1;
    if (lightRef.current) {
      lightRef.current.intensity =
        9 + Math.sin(t * 2.6 + flickerPhase) * 0.8 + Math.sin(t * 7.3 + flickerPhase * 2) * 0.35;
    }
  });

  return (
    <group position={position}>
      {/* ceiling mount */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.06, 0.05, 12]} />
        <meshStandardMaterial {...GOLD_PROPS} />
      </mesh>

      {/* chain links */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={`link-${i}`} position={[0, -0.07 - i * 0.065, 0]} rotation={[0, i % 2 === 0 ? 0 : Math.PI / 2, 0]}>
          <torusGeometry args={[0.035, 0.008, 6, 12]} />
          <meshStandardMaterial {...GOLD_PROPS} />
        </mesh>
      ))}

      {/* central stem and ornaments */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.7, 10]} />
        <meshStandardMaterial {...GOLD_PROPS} />
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial {...GOLD_PROPS} />
      </mesh>
      <mesh position={[0, -1.0, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial {...GOLD_PROPS} />
      </mesh>

      {/* suspension rods to the big ring */}
      {ringAngles(4).map((a) => (
        <group key={`rod-big-${a}`} rotation={[0, a, 0]}>
          <mesh position={[0.275, -0.625, 0]} rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.008, 0.008, 0.78, 6]} />
            <meshStandardMaterial {...GOLD_PROPS} />
          </mesh>
        </group>
      ))}
      {/* suspension rods to the small ring */}
      {ringAngles(3, Math.PI / 6).map((a) => (
        <group key={`rod-small-${a}`} rotation={[0, a, 0]}>
          <mesh position={[0.17, -0.475, 0]} rotation={[0, 0, Math.atan2(0.34, 0.25)]}>
            <cylinderGeometry args={[0.007, 0.007, 0.42, 6]} />
            <meshStandardMaterial {...GOLD_PROPS} />
          </mesh>
        </group>
      ))}

      {/* big ring, tier of 10 candles */}
      <mesh position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.03, 10, 40]} />
        <meshStandardMaterial {...GOLD_PROPS} />
      </mesh>
      {ringAngles(10).map((a) => (
        <Candle key={`candle-big-${a}`} position={[Math.cos(a) * 0.55, -0.885, Math.sin(a) * 0.55]} />
      ))}

      {/* small ring, tier of 6 candles */}
      <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.025, 10, 32]} />
        <meshStandardMaterial {...GOLD_PROPS} />
      </mesh>
      {ringAngles(6, Math.PI / 6).map((a) => (
        <Candle key={`candle-small-${a}`} position={[Math.cos(a) * 0.34, -0.585, Math.sin(a) * 0.34]} />
      ))}

      {/* slowly revolving crystal drops */}
      <group ref={crystalsRef}>
        {ringAngles(12, Math.PI / 12).map((a, i) => (
          <CrystalDrop
            key={`crystal-big-${a}`}
            position={[Math.cos(a) * 0.55, -0.93, Math.sin(a) * 0.55]}
            length={i % 2 === 0 ? 0.12 : 0.18}
          />
        ))}
        {ringAngles(8).map((a, i) => (
          <CrystalDrop
            key={`crystal-small-${a}`}
            position={[Math.cos(a) * 0.34, -0.63, Math.sin(a) * 0.34]}
            length={i % 2 === 0 ? 0.09 : 0.13}
          />
        ))}
        {/* centerpiece crystal under the stem */}
        <CrystalDrop position={[0, -1.05, 0]} length={0.14} />
      </group>

      {/* warm glowing heart + flickering light */}
      <mesh position={[0, -0.75, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color="#ffedc4" transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <pointLight ref={lightRef} position={[0, -0.75, 0]} intensity={9} distance={8} decay={2} color={WARM_LIGHT} />

      {/* faux volumetric light shaft down to the floor */}
      <mesh position={[0, -2.87, 0]}>
        <cylinderGeometry args={[0.55, 1.5, 3.85, 24, 1, true]} />
        <meshBasicMaterial
          color={WARM_LIGHT}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

/** Red runner with gold trim, laid down the full length of the gallery. */
export const RedCarpet = () => (
  <group>
    {/* dark underlay border */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, -7.6]} receiveShadow>
      <planeGeometry args={[2.0, 20.9]} />
      <meshStandardMaterial color="#4a060e" roughness={0.95} />
    </mesh>
    {/* main red runner */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -7.6]} receiveShadow>
      <planeGeometry args={[1.7, 20.7]} />
      <meshStandardMaterial color="#a30f1f" roughness={0.8} />
    </mesh>
    {/* gold edge trims */}
    <mesh position={[-0.9, 0.012, -7.6]}>
      <boxGeometry args={[0.05, 0.014, 20.8]} />
      <meshStandardMaterial {...GOLD_PROPS} />
    </mesh>
    <mesh position={[0.9, 0.012, -7.6]}>
      <boxGeometry args={[0.05, 0.014, 20.8]} />
      <meshStandardMaterial {...GOLD_PROPS} />
    </mesh>
    {/* gold end bars */}
    <mesh position={[0, 0.012, 2.82]}>
      <boxGeometry args={[1.85, 0.016, 0.08]} />
      <meshStandardMaterial {...GOLD_PROPS} />
    </mesh>
    <mesh position={[0, 0.012, -18.0]}>
      <boxGeometry args={[1.85, 0.016, 0.08]} />
      <meshStandardMaterial {...GOLD_PROPS} />
    </mesh>
  </group>
);

/** Brass candle sconce mounted on a wall, glowing warmly (no real light — cheap). */
export const WallSconce = ({ x, y = 2.55, z }: { x: number; y?: number; z: number }) => {
  const facing = x < 0 ? Math.PI / 2 : -Math.PI / 2;
  return (
    <group position={[x, y, z]} rotation={[0, facing, 0]}>
      {/* soft glow on the wall behind */}
      <mesh position={[0, 0.06, 0.005]}>
        <circleGeometry args={[0.24, 24]} />
        <meshBasicMaterial color={WARM_LIGHT} transparent opacity={0.28} depthWrite={false} />
      </mesh>
      {/* back plate */}
      <mesh position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.02, 16]} />
        <meshStandardMaterial {...GOLD_PROPS} />
      </mesh>
      {/* arm */}
      <mesh position={[0, -0.02, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.13, 8]} />
        <meshStandardMaterial {...GOLD_PROPS} />
      </mesh>
      {/* candle on the arm tip */}
      <Candle position={[0, -0.04, 0.15]} />
    </group>
  );
};

/** Drifting golden dust motes filling the hall. */
export const GoldDust = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 130;

  const { positions, base, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 4.4;
      const y = 0.4 + Math.random() * 3.4;
      const z = 2.2 - Math.random() * 20;
      base.set([x, y, z], i * 3);
      positions.set([x, y, z], i * 3);
      seeds[i * 2] = Math.random() * Math.PI * 2;
      seeds[i * 2 + 1] = 0.3 + Math.random() * 0.7;
    }
    return { positions, base, seeds };
  }, []);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;
    const t = state.clock.elapsedTime;
    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const phase = seeds[i * 2];
      const speed = seeds[i * 2 + 1];
      arr[i * 3] = base[i * 3] + Math.sin(t * 0.4 * speed + phase) * 0.25;
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * speed + phase) * 0.45;
      arr[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * 0.3 * speed + phase) * 0.2;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#dcb14a" transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
};

/** Spinning golden star hovering over the profile stage. */
export const GoldenEmblem = ({ position }: { position: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const baseY = position[1];

  const starGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const outer = 0.26;
    const inner = 0.105;
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) shape.moveTo(px, py);
      else shape.lineTo(px, py);
    }
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelSize: 0.012,
      bevelThickness: 0.012,
      bevelSegments: 2,
    });
    geometry.center();
    return geometry;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y = t * 0.7;
    group.position.y = baseY + Math.sin(t * 1.3) * 0.09;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh geometry={starGeometry}>
        <meshStandardMaterial {...GOLD_PROPS} emissive="#8a5f10" emissiveIntensity={0.55} />
      </mesh>
      {/* tilted halo rings — the group spin makes them sweep */}
      <mesh rotation={[Math.PI / 2 + 0.35, 0, 0]}>
        <torusGeometry args={[0.42, 0.011, 8, 40]} />
        <meshStandardMaterial {...GOLD_PROPS} emissive="#8a5f10" emissiveIntensity={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2 - 0.35, 0, 0.5]}>
        <torusGeometry args={[0.5, 0.008, 8, 40]} />
        <meshStandardMaterial {...GOLD_PROPS} emissive="#8a5f10" emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
};
