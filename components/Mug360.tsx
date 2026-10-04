'use client';
import {Canvas, useThree} from '@react-three/fiber';
import {OrbitControls, Environment} from '@react-three/drei';
import * as THREE from 'three';
import {Suspense,useEffect,useMemo,useRef,useState} from 'react';

type Props={image:string|null; autoRotate?:boolean; targetAngle?:number};
function Mug({image,targetAngle=0}:{image:string|null;targetAngle?:number}){
 const group=useRef<THREE.Group>(null); const {gl}=useThree();
 const texture=useMemo(()=>{if(!image)return null;const t=new THREE.TextureLoader().load(image);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=THREE.RepeatWrapping;t.flipY=false;t.needsUpdate=true;return t},[image]);
 useEffect(()=>{if(group.current) group.current.rotation.y=targetAngle},[targetAngle]);
 useEffect(()=>()=>{texture?.dispose()},[texture]);
 return <group ref={group} rotation={[0,targetAngle,0]}>
  <mesh castShadow receiveShadow><cylinderGeometry args={[1.45,1.35,2.7,96,1,true]}/><meshPhysicalMaterial color="#fff" roughness={0.22} metalness={0} clearcoat={.55} side={THREE.DoubleSide}/></mesh>
  <mesh position={[0,0,0]}><cylinderGeometry args={[1.465,1.365,2.25,96,1,true,0,Math.PI*2]}/><meshStandardMaterial map={texture||undefined} color={texture?'#fff':'#f7fbfd'} roughness={.38} side={THREE.DoubleSide}/></mesh>
  <mesh position={[0,1.35,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[1.39,.075,20,96]}/><meshPhysicalMaterial color="#fff" roughness={.2} clearcoat={.6}/></mesh>
  <mesh position={[0,-1.35,0]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[1.34,1.34,.12,96]}/><meshPhysicalMaterial color="#fff" roughness={.28}/></mesh>
  <mesh position={[1.58,.05,0]} rotation={[0,Math.PI/2,0]}><torusGeometry args={[.72,.18,24,72,Math.PI*1.55]}/><meshPhysicalMaterial color="#fff" roughness={.24} clearcoat={.55}/></mesh>
 </group>
}
export default function Mug360({image,autoRotate=false,targetAngle=0}:Props){
 return <div className="mug360"><Canvas shadows camera={{position:[0,0.15,5.6],fov:37}} gl={{antialias:true,alpha:true}}><ambientLight intensity={1.25}/><directionalLight position={[4,6,5]} intensity={2.4} castShadow/><directionalLight position={[-4,2,-3]} intensity={.8}/><Suspense fallback={null}><Mug image={image} targetAngle={targetAngle}/><Environment preset="studio"/></Suspense><OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI/2.25} maxPolarAngle={Math.PI/1.8} autoRotate={autoRotate} autoRotateSpeed={2.2}/></Canvas><div className="drag360">↔ Arraste para girar 360°</div></div>
}