'use client';
import {Canvas, useFrame} from '@react-three/fiber';
import {OrbitControls, Environment, ContactShadows, useGLTF} from '@react-three/drei';
import * as THREE from 'three';
import {Suspense,useEffect,useMemo,useRef} from 'react';

type Props={image:string|null;autoRotate?:boolean;targetAngle?:number};
const MUG_MODEL_URL='https://raw.githubusercontent.com/contatodize-creator/CaneKids/main/plain_mug.glb';

function RealMug({image,targetAngle=0}:{image:string|null;targetAngle:number}){
 const group=useRef<THREE.Group>(null);
 const {scene}=useGLTF(MUG_MODEL_URL);
 const model=useMemo(()=>scene.clone(true),[scene]);
 const texture=useMemo(()=>{
   if(!image)return null;
   const t=new THREE.TextureLoader().load(image);
   t.colorSpace=THREE.SRGBColorSpace;
   // GLB UVs use bottom-left origin; uploaded browser images use top-left.
   t.flipY=true;
   t.wrapS=THREE.ClampToEdgeWrapping;
   t.wrapT=THREE.ClampToEdgeWrapping;
   t.anisotropy=16;
   t.needsUpdate=true;
   return t;
 },[image]);

 useEffect(()=>{
   const meshes:THREE.Mesh[]=[];
   const box=new THREE.Box3().setFromObject(model);
   const size=new THREE.Vector3();
   box.getSize(size);
   model.traverse((obj)=>{
     if(obj instanceof THREE.Mesh){
       meshes.push(obj);
       obj.castShadow=true;
       obj.receiveShadow=true;
     }
   });

   // The downloaded GLB is a single mug mesh, so replacing its material paints
   // the inside too. Keep the GLB as white ceramic and add a separate printable
   // sleeve only around the OUTSIDE wall. This matches sublimation behavior.
   meshes.forEach((obj)=>{
     obj.material=new THREE.MeshPhysicalMaterial({
       color:0xffffff,roughness:.18,metalness:0,clearcoat:.9,
       clearcoatRoughness:.10,side:THREE.FrontSide
     });
   });
   return ()=>meshes.forEach((obj)=>((obj.material as THREE.Material).dispose()));
 },[model]);
 useEffect(()=>()=>texture?.dispose(),[texture]);
 useFrame(()=>{if(group.current){const d=targetAngle-group.current.rotation.y;group.current.rotation.y+=d*.09;}});

 return <group ref={group} rotation={[0,targetAngle,0]} position={[0,-1.30,0]} scale={18}>
   <primitive object={model}/>
   {texture&&<mesh rotation={[0,Math.PI,0]} position={[0,0,0]} castShadow>
     <cylinderGeometry args={[0.0822,0.0822,0.087,192,1,true]}/>
     <meshPhysicalMaterial map={texture} color={0xffffff} roughness={.25} metalness={0} clearcoat={.48} clearcoatRoughness={.14} side={THREE.FrontSide}/>
   </mesh>}
 </group>;
}
useGLTF.preload(MUG_MODEL_URL);

function Pedestal(){return <><mesh receiveShadow position={[0,-1.62,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[2.15,96]}/><meshStandardMaterial color="#eee9e2" roughness={.92}/></mesh><ContactShadows position={[0,-1.58,0]} opacity={.34} scale={5.2} blur={2.5} far={3.8}/></>}

export default function Mug360({image,autoRotate=false,targetAngle=0}:Props){return <div className="mug360"><Canvas shadows dpr={[1,2]} camera={{position:[0,.35,6.9],fov:31}} gl={{antialias:true,alpha:true,toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.08}}><color attach="background" args={['#f6f3ee']}/><ambientLight intensity={.7}/><directionalLight position={[4.5,7,5]} intensity={2.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}/><directionalLight position={[-4,3,-2]} intensity={1.0}/><pointLight position={[-2,4,4]} intensity={1.0}/><Suspense fallback={null}><RealMug image={image} targetAngle={targetAngle}/><Pedestal/><Environment preset="apartment" environmentIntensity={.65}/></Suspense><OrbitControls makeDefault enablePan={false} enableZoom={true} minDistance={5.4} maxDistance={8.4} minPolarAngle={Math.PI*.30} maxPolarAngle={Math.PI*.70} autoRotate={autoRotate} autoRotateSpeed={1.45}/></Canvas><div className="viewerBadge"><b>360°</b><span>Arraste para girar • role para aproximar</span></div></div>;}