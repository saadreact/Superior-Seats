'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Chair3DModelProps {
  selectedTexture: string;
  selectedColor: string;
  currentObjectIndex: number;
}

// Simple chair geometry component
function ChairGeometry({ selectedTexture, selectedColor }: { selectedTexture: string; selectedColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Rotate the chair slowly
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Create a chair-like geometry
  const chairGeometry = new THREE.BoxGeometry(2, 0.2, 2); // Seat
  const backGeometry = new THREE.BoxGeometry(2, 1.5, 0.2); // Back
  const legGeometry = new THREE.BoxGeometry(0.2, 1, 0.2); // Legs

  // Create material with texture and color
  const material = new THREE.MeshStandardMaterial({
    color: selectedColor,
    roughness: selectedTexture === 'leather' ? 0.3 : 0.7,
    metalness: selectedTexture === 'leather' ? 0.1 : 0.0,
  });

  return (
    <group>
      {/* Seat */}
      <mesh ref={meshRef} position={[0, 0.25, 0]} castShadow receiveShadow>
        <primitive object={chairGeometry} />
        <primitive object={material} attach="material" />
      </mesh>
      
      {/* Back */}
      <mesh position={[0, 1, -0.9]} castShadow receiveShadow>
        <primitive object={backGeometry} />
        <primitive object={material} attach="material" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.8, -0.25, -0.8]} castShadow>
        <primitive object={legGeometry} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.8, -0.25, -0.8]} castShadow>
        <primitive object={legGeometry} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.8, -0.25, 0.8]} castShadow>
        <primitive object={legGeometry} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.8, -0.25, 0.8]} castShadow>
        <primitive object={legGeometry} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

// Different chair types
const chairTypes = [
  { name: 'Sofa', scale: 1.2, position: [0, 0, 0] },
  { name: 'Car Seat', scale: 0.8, position: [0, 0, 0] },
  { name: 'Truck Seat', scale: 1.0, position: [0, 0, 0] },
  { name: 'Racing Seat', scale: 0.9, position: [0, 0, 0] },
  { name: 'Office Chair', scale: 0.7, position: [0, 0, 0] },
  { name: 'Gaming Chair', scale: 0.8, position: [0, 0, 0] },
];

export default function Chair3DModel({ selectedTexture, selectedColor, currentObjectIndex }: Chair3DModelProps) {
  const currentChair = chairTypes[currentObjectIndex];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        shadows
        style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        {/* Chair Model */}
        <group
          scale={currentChair.scale}
          position={currentChair.position as [number, number, number]}
        >
          <ChairGeometry selectedTexture={selectedTexture} selectedColor={selectedColor} />
        </group>
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
        />
        
        {/* Ground plane for shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </Canvas>
    </div>
  );
} 