'use client';
import {useEffect,useState} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {supabase} from '../../lib/supabase';
export default function AdminLayout({children}:{children:React.ReactNode}){
const pathname=usePathname();const router=useRouter();
const login=pathname==='/admin/login';
const [allowed,setAllowed]=useState(false);
const [checking,setChecking]=useState(true);
useEffect(()=>{
if(login){setChecking(false);return;}
let active=true;
async function verify(){
if(!supabase){router.replace('/admin/login');return;}
const user=await supabase.auth.getUser();
if(!active)return;
if(!user.data.user){setAllowed(false);router.replace('/admin/login');setChecking(false);return;}
const result=await supabase.rpc('is_admin');
if(!active)return;
setAllowed(result.data===true&&!result.error);
setChecking(false);
if(result.error||result.data!==true)router.replace('/admin/login');
}
setChecking(true);verify();
const subscription=supabase?.auth.onAuthStateChange((event)=>{
if(event==='SIGNED_OUT'){setAllowed(false);router.replace('/admin/login');}
});
return()=>{active=false;subscription?.data.subscription.unsubscribe()};
},[login,router]);
if(login)return <>{children}</>;
if(checking||!allowed)return <main style={{padding:40,textAlign:'center'}}>Verificando acesso administrativo...</main>;
return <>{children}</>;
}