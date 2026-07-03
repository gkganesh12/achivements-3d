import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { playFootstep } from '../utils/footsteps';

const MOVE_SPEED = 3.5;
const PUFF_COUNT = 8;
const PUFF_LIFE = 0.45; // seconds

type Puff = { x: number; z: number; age: number; active: boolean };
const ROOM_BOUNDS = {
  minX: -2.0,
  maxX: 2.0,
  minZ: -17.8,
  maxZ: 2.0
};

export const Character = () => {
  const groupRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  
  const { characterPosition, keysPressed, setCharacterPosition, setCharacterRotation, isMenuOpen } = useStore();
  
  const currentPosition = useRef(new THREE.Vector3(characterPosition.x, 0, characterPosition.z));
  const currentRotation = useRef(Math.PI);
  const walkCycle = useRef(0);
  const gait = useRef(0); // 0 = standing, 1 = full stride
  const wasMovingClip = useRef(false);
  const stepSign = useRef(1); // which foot is planted (sign of the stride wave)
  const puffs = useRef<Puff[]>(Array.from({ length: PUFF_COUNT }, () => ({ x: 0, z: 0, age: 0, active: false })));
  const puffMeshes = useRef<(THREE.Mesh | null)[]>([]);
  const nextPuff = useRef(0);

  // Load the businessman 3D model with animations
  const { scene, animations } = useGLTF('/businessman.glb');
  const { actions, names } = useAnimations(animations, modelRef);

  // Clone once — cloning per render made every movement frame re-clone the GLB
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // If the GLB ships real clips (e.g. after auto-rigging on Mixamo), use them;
  // otherwise the procedural gait below takes over.
  const walkClip = useMemo(() => names.find((n) => /walk|run|jog/i.test(n)) ?? null, [names]);
  const idleClip = useMemo(
    () => names.find((n) => /idle|stand|breath/i.test(n)) ?? (walkClip ? null : names[0] ?? null),
    [names, walkClip]
  );

  useEffect(() => {
    // Setup shadows
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    if (idleClip) {
      actions[idleClip]?.reset().play();
    }
  }, [clonedScene, idleClip, actions]);

  // Hide character when viewing an exhibit
  const { isAmplified } = useStore();

  useFrame((state, delta) => {
    if (isMenuOpen) return;
    
    // ... existing movement logic ...
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
      walkCycle.current += delta * 9.5; // ~3 footfalls per second at full speed
    }

    if (groupRef.current) {
      // Smooth position following
      currentPosition.current.lerp(
        new THREE.Vector3(characterPosition.x, 0, characterPosition.z),
        0.15
      );
      groupRef.current.position.x = currentPosition.current.x;
      groupRef.current.position.z = currentPosition.current.z;
      
      // Smooth rotation
      const targetRot = useStore.getState().characterRotation;
      let diff = targetRot - currentRotation.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      currentRotation.current += diff * 0.12;
      groupRef.current.rotation.y = currentRotation.current;
      
      // WALK ANIMATION
      if (modelRef.current) {
        const model = modelRef.current;

        if (walkClip) {
          // The GLB ships real clips — crossfade walk <-> idle
          if (wasMovingClip.current !== isMoving) {
            const walk = actions[walkClip];
            const idle = idleClip ? actions[idleClip] : null;
            if (isMoving) {
              walk?.reset().fadeIn(0.2).play();
              idle?.fadeOut(0.2);
            } else {
              walk?.fadeOut(0.25);
              idle?.reset().fadeIn(0.25).play();
            }
            wasMovingClip.current = isMoving;
          }
        } else {
          // PROCEDURAL GAIT (no rig in the GLB — fake a believable stride)
          // Ease the gait in/out so starting and stopping look weighted
          gait.current = THREE.MathUtils.lerp(gait.current, isMoving ? 1 : 0, isMoving ? 0.09 : 0.13);
          const g = gait.current;
          const t = walkCycle.current;
          const time = state.clock.elapsedTime;

          // Footfalls: two per cycle, sharpened so each step visibly lands
          const footfall = Math.pow(Math.abs(Math.sin(t)), 0.8);
          // Idle breathing keeps him alive while standing still
          const breathe = (1 - g) * Math.sin(time * 1.7) * 0.006;
          model.position.y = footfall * 0.045 * g + breathe;

          // Weight shifts onto each foot in turn
          model.position.x = Math.sin(t) * 0.028 * g;

          // Hips roll with the weight shift, banking extra into turns
          const turnBank = THREE.MathUtils.clamp(-diff * 0.6, -0.15, 0.15) * g;
          model.rotation.z = Math.sin(t) * 0.05 * g + turnBank + (1 - g) * Math.sin(time * 0.9) * 0.008;

          // Torso counter-sways against the stride, like arm swing
          model.rotation.y = Math.sin(t) * 0.085 * g;

          // Lean into the walk, with a small per-step pulse
          model.rotation.x = (0.06 + Math.sin(t * 2) * 0.012) * g;

          // Squash on landing, stretch mid-stride — sells the weight
          const compress = Math.pow(1 - footfall, 2) * g;
          model.scale.y = 1 - compress * 0.022;
          const bulge = 1 + compress * 0.012;
          model.scale.x = bulge;
          model.scale.z = bulge;

          // Footfall event: the stride wave changes sign each time a foot lands
          const sign = Math.sin(t) >= 0 ? 1 : -1;
          if (isMoving && g > 0.5 && sign !== stepSign.current) {
            stepSign.current = sign;
            playFootstep(sign * 0.18);

            // Spawn a golden step ripple under the landing foot
            const rot = currentRotation.current;
            const footX = characterPosition.x + Math.cos(rot) * sign * 0.09;
            const footZ = characterPosition.z - Math.sin(rot) * sign * 0.09;
            const puff = puffs.current[nextPuff.current];
            puff.x = footX;
            puff.z = footZ;
            puff.age = 0;
            puff.active = true;
            nextPuff.current = (nextPuff.current + 1) % PUFF_COUNT;
          }
        }
      }

      // Animate the step ripples
      for (let i = 0; i < PUFF_COUNT; i++) {
        const puff = puffs.current[i];
        const mesh = puffMeshes.current[i];
        if (!mesh) continue;
        if (!puff.active) {
          mesh.visible = false;
          continue;
        }
        puff.age += delta;
        if (puff.age >= PUFF_LIFE) {
          puff.active = false;
          mesh.visible = false;
          continue;
        }
        const progress = puff.age / PUFF_LIFE;
        mesh.visible = true;
        mesh.position.set(puff.x, 0.016, puff.z);
        mesh.scale.setScalar(0.08 + progress * 0.24);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.4 * (1 - progress);
      }
    }
  });

  if (isAmplified) return null; // Hide character when zoomed in

  return (
    <>
      <group ref={groupRef} position={[characterPosition.x, 0, characterPosition.z]}>
        {/* Businessman 3D Model - larger and straight */}
        <group ref={modelRef}>
          <primitive
            object={clonedScene}
            scale={2.2}
            position={[0, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
          />
        </group>
      </group>

      {/* Golden step-ripple pool (world space — ripples stay where feet land) */}
      {Array.from({ length: PUFF_COUNT }, (_, i) => (
        <mesh
          key={`puff-${i}`}
          ref={(mesh) => { puffMeshes.current[i] = mesh; }}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <ringGeometry args={[0.7, 1, 24]} />
          <meshBasicMaterial color="#e3bd6a" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
};

// Preload the model
useGLTF.preload('/businessman.glb');
