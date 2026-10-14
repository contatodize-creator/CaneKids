'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {supabase} from '../../../lib/supabase';
const states=[['received','Recebido'],['designing','Criando arte'],['awaiting_approval','Aguardando aprovação'],['approved','Aprovado'],['cancelled','Cancelado']];
export default function Page(){const [items,setItems]=useState<any[]>([]),[msg,setMsg]=useState('');
async function load(){if(!supabase)return;const r=await supabase.rpc('admin_art_requests');if(r.error)setMsg(r.error.message);else setItems(r.data||[])}
useEffect(()=>{load()},[]);
async function change(id:string,status:string){const r=await supabase!.rpc('admin_update_art_request',{p_id:id,p_status:status});if(r.error)setMsg(r.error.message);else await load()}
async function photo(path:string){const r=await supabase!.storage.from('customer-art').createSignedUrl(path,120);if(r.error)setMsg(r.error.message);else if(r.data?.signedUrl)window.open(r.data.signedUrl,'_blank','noopener,noreferrer')}
return <main className="artAdmin"><Link href="/admin">Voltar ao painel</Link><h1>Solicitações de criação de arte</h1><p>Fotos enviadas pelos clientes são privadas. Abra os arquivos apenas para preparar a arte solicitada.</p>{msg&&<p role="alert">{msg}</p>}{items.length===0?<p>Nenhuma solicitação recebida.</p>:items.map(x=><article key={x.id}><h2>{x.customer_name}</h2><p><b>Telefone:</b> {x.customer_phone}</p><p><b>Instruções:</b> {x.instructions}</p><p><b>Pedido:</b> {x.id}</p><div className="artAdminPhotos">{(x.photo_paths||[]).map((path:string,i:number)=><button key={path} onClick={()=>photo(path)}>Abrir foto {i+1}</button>)}</div><label>Status <select value={x.status} onChange={e=>change(x.id,e.target.value)}>{states.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label></article>)}</main>}
