import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { exhibits, profileData } from '../data/exhibits';
import { Character } from '../components/Character';
import { ActivationCircle, Picture, RopeBarrier, ProfileActivationCircle } from '../components/MuseumElements';

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
      {/* ===== FLOOR ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -7.75]} receiveShadow>
        <planeGeometry args={[5.25, 21]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Entry floor - extends outward */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 7]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial color="#ffffff" />
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

      {/* Profile wall lighting - shifted back */}
      <spotLight
        position={[0, 4.5, -15]}
        angle={0.6}
        penumbra={0.6}
        intensity={0.7}
        distance={10}
        color="#ffffff"
      />
      <spotLight
        position={[-1.5, 4, -15.5]}
        angle={0.5}
        penumbra={0.7}
        intensity={0.3}
        distance={8}
        color="#ffffff"
      />
      <spotLight
        position={[1.5, 4, -15.5]}
        angle={0.5}
        penumbra={0.7}
        intensity={0.3}
        distance={8}
        color="#ffffff"
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

      {/* RIDGE BEAM - runs along the peak */}
      <mesh position={[0, 5.1, -8]}>
        <boxGeometry args={[0.12, 0.12, 22]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
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


      {/* ===== ELEGANT CHANDELIERS - Added one more for length ===== */}
      {[-3, -9, -15].map((z, i) => (
        <group key={`chandelier-${i}`} position={[0, 4.8, z]}>
          {/* Main hanging chain/rod */}
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.8} />
          </mesh>
          
          {/* Chandelier base ring */}
          <mesh position={[0, -0.65, 0]}>
            <torusGeometry args={[0.2, 0.02, 8, 24]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
          </mesh>
          
          {/* Central ornament */}
          <mesh position={[0, -0.75, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
          </mesh>
          
          {/* Hanging crystals/drops around the ring */}
          {[0, 1, 2, 3, 4, 5].map((j) => {
            const angle = (j / 6) * Math.PI * 2;
            const x = Math.cos(angle) * 0.2;
            const zPos = Math.sin(angle) * 0.2;
            return (
              <group key={`crystal-${j}`} position={[x, -0.65, zPos]}>
                <mesh position={[0, -0.12, 0]}>
                  <cylinderGeometry args={[0.005, 0.005, 0.15, 6]} />
                  <meshStandardMaterial color="#333333" metalness={0.7} />
                </mesh>
                <mesh position={[0, -0.22, 0]}>
                  <octahedronGeometry args={[0.035]} />
                  <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.3} />
                </mesh>
              </group>
            );
          })}
          
          {/* Light from chandelier */}
          <pointLight position={[0, -0.8, 0]} intensity={0.4} distance={6} color="#fff5e6" />
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

      {/* ===== BARRIERS - Extended ===== */}
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
      <ambientLight intensity={0.9} />
      <directionalLight position={[0, 5, 3]} intensity={0.6} />
      <directionalLight position={[0, 4, -2]} intensity={0.3} />
      <pointLight position={[0, 4, -3]} intensity={0.4} distance={10} />
      <pointLight position={[0, 4, -7]} intensity={0.3} distance={8} />
      <pointLight position={[0, 4, -13]} intensity={0.3} distance={8} />

      <Character />
    </group>
  );
};
