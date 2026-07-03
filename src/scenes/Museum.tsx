import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { exhibits, profileData } from '../data/exhibits';
import { Character } from '../components/Character';
import { ActivationCircle, Picture, RopeBarrier, ProfileActivationCircle } from '../components/MuseumElements';
import {
  AimedSpot,
  GoldDust,
  GoldenEmblem,
  GrandChandelier,
  RedCarpet,
  WallSconce,
  GOLD_PROPS,
} from '../components/Decor';

// Sconces sit on the walls between neighbouring exhibits
const SCONCE_Z = [-0.25, -3.75, -7.25, -10.75, -14.25];

export const Museum = () => {
  // Gable triangle shapes - same white as walls
  const frontGableShape = new THREE.Shape();
  frontGableShape.moveTo(-2.6, 0);
  frontGableShape.lineTo(2.6, 0);
  frontGableShape.lineTo(0, 1.5);
  frontGableShape.closePath();

  const backGableShape = new THREE.Shape();
  backGableShape.moveTo(-2.6, 0);
  backGableShape.lineTo(2.6, 0);
  backGableShape.lineTo(0, 1.5);
  backGableShape.closePath();

  return (
    <group>
      {/* ===== FLOOR - lit material so the chandelier pools and shadows read ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -7.75]} receiveShadow>
        <planeGeometry args={[5.25, 21]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.55} />
      </mesh>

      {/* Entry floor - extends outward */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 7]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.6} />
      </mesh>

      {/* ===== LARGE ENCLOSURE to hide ALL exterior space ===== */}
      <mesh position={[-15, 5, 0]}>
        <boxGeometry args={[0.1, 20, 60]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[15, 5, 0]}>
        <boxGeometry args={[0.1, 20, 60]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 15, 0]}>
        <boxGeometry args={[30, 0.1, 60]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 5, -30]}>
        <boxGeometry args={[30, 20, 0.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 5, 30]}>
        <boxGeometry args={[30, 20, 0.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* ===== WALLS - Extended length ===== */}
      {/* Left wall */}
      <mesh position={[-2.6, 1.9, -7.75]}>
        <boxGeometry args={[0.08, 3.8, 21]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>

      {/* Right wall */}
      <mesh position={[2.6, 1.9, -7.75]}>
        <boxGeometry args={[0.08, 3.8, 21]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>

      {/* Back wall - Profile */}
      <mesh position={[0, 1.9, -18.25]}>
        <boxGeometry args={[5.1, 3.8, 0.08]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>

      {/* Profile wall lighting - warm spots aimed at the wall */}
      <AimedSpot
        position={[0, 4.4, -14.2]}
        target={[0, 2.3, -18.3]}
        angle={0.55}
        penumbra={0.5}
        intensity={20}
        distance={16}
        color="#ffe8c4"
      />
      <AimedSpot
        position={[-1.8, 3.9, -15.3]}
        target={[-1.2, 1.8, -18.3]}
        angle={0.45}
        penumbra={0.85}
        intensity={6}
        distance={10}
        color="#ffd9a0"
      />
      <AimedSpot
        position={[1.8, 3.9, -15.3]}
        target={[1.2, 1.8, -18.3]}
        angle={0.45}
        penumbra={0.85}
        intensity={6}
        distance={10}
        color="#ffd9a0"
      />

      {/* ===== VISIBLE TRIANGULAR CEILING - Extended ===== */}
      {/* Left sloped roof panel */}
      <mesh position={[-1.35, 4.55, -8]} rotation={[0, 0, Math.PI / 5.5]}>
        <boxGeometry args={[3.2, 0.1, 22]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>

      {/* Right sloped roof panel */}
      <mesh position={[1.35, 4.55, -8]} rotation={[0, 0, -Math.PI / 5.5]}>
        <boxGeometry args={[3.2, 0.1, 22]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>

      {/* RIDGE BEAM - now gilded */}
      <mesh position={[0, 5.1, -8]}>
        <boxGeometry args={[0.12, 0.12, 22]} />
        <meshStandardMaterial {...GOLD_PROPS} />
      </mesh>

      {/* LEFT CORNER - Vertical line where left wall meets back wall */}
      <mesh position={[-2.56, 1.9, -18.25]}>
        <boxGeometry args={[0.03, 3.8, 0.03]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* RIGHT CORNER - Vertical line where right wall meets back wall */}
      <mesh position={[2.56, 1.9, -18.25]}>
        <boxGeometry args={[0.03, 3.8, 0.03]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Front gable triangle - matching white */}
      <mesh position={[0, 3.8, 2.9]}>
        <shapeGeometry args={[frontGableShape]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* Back gable triangle - matching white */}
      <mesh position={[0, 3.8, -18.25]} rotation={[0, Math.PI, 0]}>
        <shapeGeometry args={[backGableShape]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* ===== GRAND GOLD CHANDELIERS ===== */}
      {[-3, -9, -15].map((z) => (
        <GrandChandelier key={`chandelier-${z}`} position={[0, 4.8, z]} />
      ))}

      {/* ===== RED CARPET + GOLD DUST + FLOATING EMBLEM ===== */}
      <RedCarpet />
      <GoldDust />
      <GoldenEmblem position={[0, 3.5, -17]} />

      {/* ===== WALL SCONCES between the exhibits ===== */}
      {SCONCE_Z.map((z) => (
        <group key={`sconces-${z}`}>
          <WallSconce x={-2.56} z={z} />
          <WallSconce x={2.56} z={z} />
        </group>
      ))}

      {/* ===== PROFILE WALL ===== */}
      <group position={[0, 0, -18.21]}>
        <Html
          transform
          position={[0, 2.5, 0.06]}
          distanceFactor={4.5}
          style={{ pointerEvents: 'none' }}
        >
          <div className="profile-panel">
            <div className="profile-name">{profileData.name}</div>
            <div className="profile-tagline">{profileData.tagline}</div>
            <div className="profile-bio">{profileData.bio[0]}</div>
          </div>
        </Html>
      </group>

      {/* ===== VELVET ROPE BARRIERS ===== */}
      <RopeBarrier startX={-2.25} startZ={1} endX={-2.25} endZ={-18} />
      <RopeBarrier startX={2.25} startZ={1} endX={2.25} endZ={-18} />

      {/* Profile barrier */}
      <RopeBarrier startX={-2.25} startZ={-18.1} endX={2.25} endZ={-18.1} bold />
      <RopeBarrier startX={-2.25} startZ={-18.1} endX={-2.25} endZ={-18} bold />
      <RopeBarrier startX={2.25} startZ={-18.1} endX={2.25} endZ={-18} bold />
      <ProfileActivationCircle />

      {/* ===== PICTURES ===== */}
      {exhibits.map((exhibit) => (
        <group key={exhibit.id}>
          <Picture exhibit={exhibit} />
          <ActivationCircle exhibit={exhibit} />
        </group>
      ))}

      {/* ===== LIGHTING ===== */}
      <ambientLight intensity={0.62} color="#fff3e2" />
      <directionalLight
        position={[4, 9, -4]}
        intensity={0.5}
        color="#fffaf0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-3, 6, 5]} intensity={0.3} color="#ffffff" />

      <Character />
    </group>
  );
};
