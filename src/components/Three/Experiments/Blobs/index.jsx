/* eslint-disable no-param-reassign */
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { EffectComposer, SSAO } from '@react-three/postprocessing';

function Box({ position }) {
  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

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

function Light() {
  const light = useRef();
  const { viewport, mouse } = useThree();

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    light.current.position.set((mouse.x * viewport.width) / 2, (mouse.y * viewport.height) / 2, 0);
  });

  return (
    <pointLight ref={light} position={[10, 10, 10]} />
  );
}

export default function Blobs() {
  return (
    <Canvas
      shadowMap
      gl={{ alpha: false, antialias: false }}
      onCreated={(state) => state.gl.setClearColor('#444444')}
    >
      <ambientLight />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <Light />
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
