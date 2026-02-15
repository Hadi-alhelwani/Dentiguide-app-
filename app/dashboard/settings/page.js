"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase-browser";
export default function SettingsPage() {
  const supabase = createClient();
  const [s, setS] = useState(null); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState("");
  useEffect(()=>{async function load(){const{data:{user}}=await supabase.auth.getUser();if(!user)return;let{data}=await supabase.from("settings").select("*").eq("user_id",user.id).single();if(!data){const{data:c}=await supabase.from("settings").insert({user_id:user.id}).select().single();data=c;}setS(data);}load();},[]);
  const save=async()=>{setSaving(true);setMsg("");await supabase.from("settings").update({company_name:s.company_name,street:s.street,postal:s.postal,city:s.city,country:s.country,phone:s.phone,email:s.email,site2_name:s.site2_name,site2_address:s.site2_address,prrc_name:s.prrc_name,prrc_qual:s.prrc_qual,signer_name:s.signer_name,signer_title:s.signer_title,signer_credentials:s.signer_credentials}).eq("id",s.id);setSaving(false);setMsg("Saved ✓");setTimeout(()=>setMsg(""),2000);};
  const up=(k)=>(e)=>setS(p=>({...p,[k]:e.target.value}));
  if(!s)return<div className="p-8 text-gray-400">Loading...</div>;
  const F=({label,field,span})=><div className={span===2?"col-span-2":""}><label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label><input value={s[field]||""} onChange={up(field)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"/></div>;
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="text-gray-500 text-sm mt-1">Company and signatory info for all documents.</p></div>
        <div className="flex items-center gap-3">{msg&&<span className="text-sm text-green-600 font-medium">{msg}</span>}<button onClick={save} disabled={saving} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition">{saving?"Saving...":"Save Changes"}</button></div></div>
      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-gray-200 p-6"><h2 className="text-base font-semibold text-gray-800 mb-4">🏭 Manufacturer</h2>
          <div className="grid grid-cols-2 gap-4"><F label="Company Name" field="company_name"/><F label="Street" field="street"/><F label="Postal Code" field="postal"/><F label="City" field="city"/><F label="Country" field="country"/><F label="Phone" field="phone"/><F label="Email" field="email"/></div></section>
        <section className="bg-white rounded-xl border border-gray-200 p-6"><h2 className="text-base font-semibold text-gray-800 mb-4">🛡️ PRRC (Art. 15)</h2>
          <div className="grid grid-cols-2 gap-4"><F label="Full Name" field="prrc_name"/><F label="Qualifications" field="prrc_qual"/></div></section>
        <section className="bg-white rounded-xl border border-gray-200 p-6"><h2 className="text-base font-semibold text-gray-800 mb-4">✍️ Signatory</h2>
          <div className="grid grid-cols-2 gap-4"><F label="Name" field="signer_name"/><F label="Title" field="signer_title"/><F label="Credentials" field="signer_credentials" span={2}/></div>
          <p className="text-xs text-gray-400 mt-2">Credentials appear after your name on signatures.</p></section>
        <section className="bg-white rounded-xl border border-gray-200 p-6"><h2 className="text-base font-semibold text-gray-800 mb-4">🏭 Additional Site (optional)</h2>
          <div className="grid grid-cols-2 gap-4"><F label="Site Name" field="site2_name"/><F label="Site Address" field="site2_address"/></div></section>
      </div>
    </div>);
}
