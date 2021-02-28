/* eslint-disable no-param-reassign */
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { EffectComposer, SSAO } from '@react-three/postprocessing';

function Box({ position }) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    mesh.current.rotation.y += 0.01;
    mesh.current.rotation.x += 0.01;
  });

  return (
    <mesh
      position={position}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

export default function Blobs() {
  return (
    <Canvas
      shadowMap
      gl={{ alpha: false, antialias: false }}
      // camera={{
      //   fov: 75, position: [0, 0, 70], near: 10, far: 150,
      // }}
      onCreated={(state) => state.gl.setClearColor('#f0f0f0')}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />

      <ambientLight intensity={1.5} />
      <pointLight position={[100, 100, 100]} intensity={2} castShadow />
      <pointLight position={[-100, -100, -100]} intensity={5} color="red" />
      {/* <Blob count={150} /> */}
      <EffectComposer multisampling={0}>
        <SSAO samples={31} radius={20} intensity={40} luminanceInfluence={0.1} color="black" />
      </EffectComposer>
    </Canvas>
  );
}
