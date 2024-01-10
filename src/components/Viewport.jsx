import React, { useRef, useState, Suspense } from 'react';
// import { Canvas, useFrame, useLoader } from 'react-three-fiber';
import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
extend({ GLTFLoader });
const Loading = () => {
    return (
      <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry attach="geometry" args={[1, 16, 16]} />
        <meshStandardMaterial
          attach="material"
          color="white"
          transparent
          opacity={1}
          roughness={1}
          metalness={0}
        />
      </mesh>
    );
  };
  

const LogoScreen = () => {
    const { nodes } = useLoader(GLTFLoader, 'gameboy.glb');
    const group = useRef();
    const [color, setColor] = useState('#3700e9');
    const [scaledUp, setScaledUp] = useState(false);
  
    useFrame(() => {
      // Have logo scale up until it is 50% larger
      const scale = group.current.scale;
  
      if (scale.x < 1.5) {
        group.current.scale.set(scale.x + 0.01, scale.y + 0.01, scale.z + 0.01);
      } else {
        setScaledUp(true);
      }
  
      // Rotate once per frame once scaling is complete
      if (scaledUp) {
        group.current.rotation.x += 0.01;
      }
    });
  
    return (
      <group ref={group}>
        <mesh visible geometry={nodes.Text.geometry}>
          <meshStandardMaterial
            attach="material"
            color={color}
            roughness={0.3}
            metalness={0.3}
          />
        </mesh>
      </group>
    );
  };

const Viewport = () => {
    return (
      <>
        <Canvas style={{ background: 'white' }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={<Loading />}>
            <LogoScreen />
          </Suspense>
        </Canvas>
      </>
    );
  };
  
  export default Viewport;
