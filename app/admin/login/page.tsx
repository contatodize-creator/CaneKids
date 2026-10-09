'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {supabase} from '../../../lib/supabase';
export default function AdminLogin(){
const router=useRouter();
const [email,setEmail]=useState('contatodize@gmail.com');
const [password,setPassword]=useState('');
const [error,setError]=useState('');
const [loading,setLoading]=useState(false);
async function submit(e:React.FormEvent<HTMLFormElement>){
e.preventDefault();setLoading(true);setError('');
if(!supabase){setError('Conexão indisponível');setLoading(false);return;}
const result=await supabase.auth.signInWithPassword({email,password});
if(result.error){setError('E-mail ou senha inválidos');setLoading(false);return;}
const access=await supabase.rpc('is_admin');
if(access.error||!access.data){await supabase.auth.signOut();setError('Conta sem autorização administrativa');setLoading(false);return;}
router.replace('/admin');router.refresh();
}
return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#f6f8fb',padding:20}}><form onSubmit={submit} style={{maxWidth:420,width:'100%',padding:30,background:'#fff',border:'1px solid #dbe5ec',borderRadius:18}}><h1 style={{color:'#123b59'}}>CaneKids Admin</h1><p>Acesso restrito à administração da loja.</p><label>E-mail<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} style={field}/></label><label>Senha<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} style={field}/></label>{error&&<p role="alert" style={{color:'#b42318'}}>{error}</p>}<button disabled={loading} style={{padding:14,background:'#087bc1',color:'#fff',border:0,borderRadius:10,width:'100%',fontWeight:800}}>{loading?'Entrando...':'Entrar'}</button></form></main>}
const field={display:'block',width:'100%',boxSizing:'border-box' as const,padding:12,border:'1px solid #cbdbe6',borderRadius:8,margin:'8px 0 18px'};