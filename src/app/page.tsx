'use client'
import Image from 'next/image'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, useCursor } from '@react-three/drei'
import { useRef, useState } from 'react'
export default function Home() {
  return (


    <main className="flex min-h-screen flex-col items-center justify-between">



      <div className="hash-lines min-h-screen w-full h-full z-20 fixed left-0 right-0 top-0 bottom-0"></div>
      <div className="layer1 min-h-screen w-full h-full z-20 fixed left-0 right-0 top-0 bottom-0"></div>
      <div id="canvas-container" className='w-full h-screen z-30'>
        <Canvas shadows camera={{ fov: 75, position: [0, 0, 20] }} className='canvas1 w-full h-screen'>

          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          {/* <Frame id="01" name={`pick\nles`} author="Omar Faruq Tawsif" bg="#e4cdac" position={[-1.15, 0, 0]} rotation={[0, 0.5, 0]}>
      <Gltf src="pickles_3d_version_of_hyuna_lees_illustration-transformed.glb" scale={8} position={[0, -0.7, -2]} />
    </Frame> */}
        </Canvas>
      </div>

      <Image
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/corner-leopard.png"
        alt="Corner Leopard"
        width={500}
        height={300}
        className='z-30 fixed top-0 right-0'
      />
      {/* <Image
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/clark-tape.png"
        alt="Clark Tape"
        width={500}
        height={300}
        className='z-30 relative'
      />

      <Image
        src="https://wp.clarksglassworks.com/wp-content/uploads/2023/12/gameboy-7.png"
        alt="Gameboy"
        width={500}
        height={300}
        className='z-30 relative'
      /> */}
    </main>
  )
}
