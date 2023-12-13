'use client'
import Image from 'next/image'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, extend, MeshProps } from '@react-three/fiber'
import { OrbitControls, useCursor } from '@react-three/drei'
import { useRef, useState } from 'react'
// import THREE from 'three'
import { BufferGeometry, BoxGeometry } from 'three'
import {Mesh, Euler, MathUtils} from 'three'
import * as THREE from 'three'

extend({ OrbitControls, BufferGeometry })


export default function Home() {
  const gameboyRef = useRef();
  const [gameboyRotation, setGameboyRotation] = useState([-Math.PI / 3, 0, -Math.PI / 4]);
  const [isGameboyRotated, setIsGameboyRotated] = useState(false);

  const handleGameboyClick = () => {
    if (isGameboyRotated) {
      setGameboyRotation([-Math.PI / 3, 0, -Math.PI / 4]);
    } else {
      setGameboyRotation([0, 0, 0]);
    }
    setIsGameboyRotated(!isGameboyRotated);
  };
  return (


    <main className="flex min-h-screen flex-col items-center justify-between">



      <div className="hash-lines min-h-screen w-full h-full z-20 fixed left-0 right-0 top-0 bottom-0"></div>
      <div className="layer1 min-h-screen w-full h-full z-20 fixed left-0 right-0 top-0 bottom-0"></div>
      <div id="canvas-container" className='w-full h-screen z-30'>
        <Canvas shadows camera={{ fov: 75, position: [0, 0, 20] }} onCreated={({ gl }) => {
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap; // or other types based on your preference
   }} className='canvas1 w-full h-screen'>

          <ambientLight />
          <directionalLight position={[0, 10, 0]} intensity={1}  castShadow />
          {/* <Box ref={gameboyRef} args={[8, 16, 1]}   position={[14, -10, 0]} rotation={gameboyRotation} 
        onClick={handleGameboyClick} castShadow receiveShadow />
          */}
        </Canvas>
      </div>

      <Image
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/corner-leopard.png"
        alt="Corner Leopard"
        width={500}
        height={300}
        className='z-30 fixed top-0 right-0'
      />
      <Image
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/clark-tape.png"
        alt="Clark Tape"
        width={500}
        height={300}
        className='z-30 fixed bottom-[50px] left-[90px] animate-float'
      />

      {/*  <Image
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/gameboy-7.png"
        alt="Gameboy"
        width={500}
        height={300}
        className='z-30 relative'
      /> */}
    </main>
  )
}
// function Box(props) {
//   const mesh = useRef();
//   // const gradient = new THREE.MeshBasicMaterial({
//   //   color: 'orange',
//   //   gradientMap: new THREE.TextureLoader().load('path/to/gradient.png'),
//   // });

//   return (
//     <mesh {...props} ref={mesh} material={globalMaterial} castShadow receiveShadow>
//       <boxBufferGeometry args={props.args} />
//     </mesh>
//   );
// }
