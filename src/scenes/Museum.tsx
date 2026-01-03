import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { exhibits, profileData } from '../data/exhibits';
import { Character } from '../components/Character';
import { ActivationCircle, Picture, RopeBarrier, ProfileActivationCircle } from '../components/MuseumElements';

export const Museum = () => {
  const backGableShape = new THREE.Shape();
  backGableShape.moveTo(-3.4, 0);
  backGableShape.lineTo(3.4, 0);
  backGableShape.lineTo(0, 0.9);
  backGableShape.lineTo(-3.4, 0);



  return (
    <group>
      {/* ===== FLOOR - VERY SHORT ===== */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4]} receiveShadow>
        <planeGeometry args={[7, 14]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Entry floor threshold to hide exterior gap */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 7]} receiveShadow>
        <planeGeometry args={[12, 10]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Backdrop shell to hide exterior gaps - match wall color exactly */}
      <mesh position={[-5.5, 5, -4]}>
        <boxGeometry args={[0.1, 12, 22]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>
      <mesh position={[5.5, 5, -4]}>
        <boxGeometry args={[0.1, 12, 22]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>
      <mesh position={[0, 10, -4]}>
        <boxGeometry args={[11.2, 0.1, 22]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>
      <mesh position={[0, 5, -14.8]}>
        <boxGeometry args={[11.2, 12, 0.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>

      {/* ===== NARROW WALLS ===== */}
      {/* Left wall - with gap from back wall */}
      <mesh position={[-3.5, 4, -4]}>
        <boxGeometry args={[0.08, 8, 13.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>
      
      {/* Right wall - with gap from back wall */}
      <mesh position={[3.5, 4, -4]}>
        <boxGeometry args={[0.08, 8, 13.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>
      
      {/* Back wall - Profile with white color, separated from side walls */}
      <mesh position={[0, 4, -10.5]}>
        <boxGeometry args={[6.8, 8, 0.08]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>

      {/* Profile wall lighting - Enhanced */}
      <spotLight
        position={[0, 7.2, -7.5]}
        angle={0.6}
        penumbra={0.6}
        intensity={0.7}
        distance={15}
        color="#ffffff"
      />
      <spotLight
        position={[-2, 6.5, -8]}
        angle={0.5}
        penumbra={0.7}
        intensity={0.3}
        distance={10}
        color="#ffffff"
      />
      <spotLight
        position={[2, 6.5, -8]}
        angle={0.5}
        penumbra={0.7}
        intensity={0.3}
        distance={10}
        color="#ffffff"
      />
      
      {/* Front wall removed to keep entry open */}

      {/* ===== TRIANGULAR CEILING - FIXED ===== */}
      {/* Left sloped */}
      <mesh position={[-1.75, 8.1, -4.3]} rotation={[0, 0, Math.PI / 8]}>
        <boxGeometry args={[3.8, 0.08, 15]} />
        <meshStandardMaterial color="#fbfbfb" />
      </mesh>
      
      {/* Right sloped */}
      <mesh position={[1.75, 8.1, -4.3]} rotation={[0, 0, -Math.PI / 8]}>
        <boxGeometry args={[3.8, 0.08, 15]} />
        <meshStandardMaterial color="#fbfbfb" />
      </mesh>
      
      {/* Ridge */}
      <mesh position={[0, 8.7, -4.3]}>
        <boxGeometry args={[0.1, 0.1, 15]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Fill front triangle - matches room width */}
      <mesh position={[0, 8.3, 2.9]}>
        <planeGeometry args={[6.8, 1.6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Fill back triangle - matches profile wall width (6.8 units) */}
      <mesh position={[0, 8, -10.45]} rotation={[0, Math.PI, 0]}>
        <shapeGeometry args={[backGableShape]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Ceiling arrow */}
      <group position={[0, 8.5, -2]}>
        <mesh>
          <boxGeometry args={[0.07, 0.025, 1.2]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.12, 0.25, 3]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* ===== HANGING LIGHTS ===== */}
      {[-3, -7].map((z, i) => (
        <group key={`light-${i}`} position={[0, 8.3, z]}>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.6, 8]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
          <mesh position={[0, -0.7, 0]}>
            <coneGeometry args={[0.18, 0.25, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <pointLight position={[0, -0.8, 0]} intensity={0.5} distance={6} color="#ffffff" />
        </group>
      ))}
      

      {/* ===== PROFILE WALL ===== */}
      <group position={[0, 0, -10.46]}>
        <Html
          transform
          position={[0, 4.45, 0.06]}
          distanceFactor={5.5}
          style={{ pointerEvents: 'none' }}
        >
          <div className="profile-panel">
            <div className="profile-name">{profileData.name}</div>
            <div className="profile-tagline">{profileData.tagline}</div>
            <div className="profile-bio">{profileData.bio[0]}</div>
          </div>
        </Html>
      </group>

      {/* ===== COMPACT BARRIERS ===== */}
      {/* Side wall barricades - connected to profile wall barricades */}
      <RopeBarrier startX={-3.0} startZ={1} endX={-3.0} endZ={-11} />
      <RopeBarrier startX={3.0} startZ={1} endX={3.0} endZ={-11} />
      
      {/* Profile barrier - bold, connected to side wall barricades */}
      {/* Profile wall is 6.8 units wide (x: -3.4 to 3.4), positioned at z: -10.5 */}
      {/* Bottom horizontal - connects left and right wall barricades */}
      <RopeBarrier startX={-3.0} startZ={-10.3} endX={3.0} endZ={-10.3} bold />
      {/* Left vertical - connects to left wall barricade */}
      <RopeBarrier startX={-3.0} startZ={-10.3} endX={-3.0} endZ={-11} bold />
      {/* Right vertical - connects to right wall barricade */}
      <RopeBarrier startX={3.0} startZ={-10.3} endX={3.0} endZ={-11} bold />
      <ProfileActivationCircle />

      {/* ===== PICTURES ===== */}
      {exhibits.map((exhibit) => (
        <group key={exhibit.id}>
          <Picture exhibit={exhibit} />
          <ActivationCircle exhibit={exhibit} />
        </group>
      ))}

      {/* ===== LIGHTING - ENHANCED ===== */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[0, 8, 3]} intensity={0.6} />
      <directionalLight position={[0, 6, -2]} intensity={0.3} />
      <pointLight position={[0, 7, -3]} intensity={0.4} distance={15} />
      <pointLight position={[0, 7, -7]} intensity={0.3} distance={12} />

      <Character />
    </group>
  );
};
