'use client';
import {Canvas, useFrame} from '@react-three/fiber';
import {OrbitControls, Environment, ContactShadows, RoundedBox} from '@react-three/drei';
import * as THREE from 'three';
import {Suspense,useEffect,useMemo,useRef} from 'react';

type Props={image:string|null;autoRotate?:boolean;targetAngle?:number};
const ceramic={color:'#fffdf9',roughness:.16,metalness:0,clearcoat:1,clearcoatRoughness:.08,ior:1.5};
function Mug({image,targetAngle=0}:{image:string|null;targetAngle:number}){
 const group=useRef<THREE.Group>(null);
 const texture=useMemo(()=>{if(!image)return null;const t=new THREE.TextureLoader().load(image);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.ClampToEdgeWrapping;t.repeat.set(-1,1);t.offset.set(1,0);t.flipY=false;t.anisotropy=16;t.needsUpdate=true;return t},[image]);
 useEffect(()=>()=>texture?.dispose(),[texture]);
 useFrame(()=>{if(group.current){const d=targetAngle-group.current.rotation.y;group.current.rotation.y+=d*.09}});
 return <group ref={group} rotation={[0,targetAngle,0]} position={[0,-.05,0]}>
   {/* ceramic body, subtly tapered like an 11oz sublimation mug */}
   <mesh castShadow receiveShadow><cylinderGeometry args={[1.38,1.31,2.72,128,8,true]}/><meshPhysicalMaterial {...ceramic} side={THREE.DoubleSide}/></mesh>
   {/* printable wrap: 20.5 x 9.5 ratio mapped continuously around the body */}
   {texture&&<mesh position={[0,.01,0]}><cylinderGeometry args={[1.386,1.316,2.30,160,1,true]}/><meshPhysicalMaterial map={texture} transparent roughness={.27} clearcoat={.42} clearcoatRoughness={.12} side={THREE.DoubleSide}/></mesh>}
   {/* top lip */}
   <mesh position={[0,1.36,0]} rotation={[Math.PI/2,0,0]} castShadow><torusGeometry args={[1.345,.055,24,128]}/><meshPhysicalMaterial {...ceramic}/></mesh>
   {/* dark inner cavity gives real depth */}
   <mesh position={[0,1.345,0]} rotation={[Math.PI/2,0,0]}><circleGeometry args={[1.29,128]}/><meshStandardMaterial color="#dfe4e5" roughness={.48}/></mesh>
   <mesh position={[0,1.365,0]} rotation={[Math.PI/2,0,0]}><ringGeometry args={[1.27,1.37,128]}/><meshPhysicalMaterial {...ceramic}/></mesh>
   {/* rounded ceramic base */}
   <mesh position={[0,-1.345,0]} rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[1.30,1.25,.10,128]}/><meshPhysicalMaterial {...ceramic}/></mesh>
   {/* handle: more natural C profile */}
   <mesh position={[1.47,.03,0]} rotation={[0,Math.PI/2,0]} castShadow><torusGeometry args={[.73,.19,32,96,Math.PI*1.58]}/><meshPhysicalMaterial {...ceramic}/></mesh>
   <mesh position={[1.31,.66,0]} rotation={[0,0,-.12]} castShadow><capsuleGeometry args={[.19,.38,12,24]}/><meshPhysicalMaterial {...ceramic}/></mesh>
   <mesh position={[1.31,-.62,0]} rotation={[0,0,.12]} castShadow><capsuleGeometry args={[.19,.38,12,24]}/><meshPhysicalMaterial {...ceramic}/></mesh>
 </group>
}
function Pedestal(){return <><mesh receiveShadow position={[0,-1.62,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[2.15,96]}/><meshStandardMaterial color="#eee9e2" roughness={.92}/></mesh><ContactShadows position={[0,-1.58,0]} opacity={.34} scale={5.2} blur={2.5} far={3.8}/></>}
export default function Mug360({image,autoRotate=false,targetAngle=0}:Props){return <div className="mug360"><Canvas shadows dpr={[1,2]} camera={{position:[0,.35,6.9],fov:31}} gl={{antialias:true,alpha:true,toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.08}}><color attach="background" args={['#f6f3ee']}/><ambientLight intensity={.55}/><directionalLight position={[4.5,7,5]} intensity={2.8} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}/><directionalLight position={[-4,3,-2]} intensity={1.15}/><pointLight position={[-2,4,4]} intensity={1.2}/><Suspense fallback={null}><Mug image={image} targetAngle={targetAngle}/><Pedestal/><Environment preset="apartment" environmentIntensity={.65}/></Suspense><OrbitControls makeDefault enablePan={false} enableZoom={true} minDistance={5.4} maxDistance={8.4} minPolarAngle={Math.PI*.38} maxPolarAngle={Math.PI*.59} autoRotate={autoRotate} autoRotateSpeed={1.45}/></Canvas><div className="viewerBadge"><b>360°</b><span>Arraste para girar • role para aproximar</span></div></div>