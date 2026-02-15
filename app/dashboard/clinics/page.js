"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase-browser";
const EMPTY = { name:"",big:"",practice:"",address:"",phone:"",email:"",notes:"",status:"active" };
export default function ClinicsPage() {
  const supabase = createClient();
  const [clinics, setClinics] = useState([]); const [selected, setSelected] = useState(null); const [editing, setEditing] = useState(null); const [loading, setLoading] = useState(true);
  const load = async () => { const {data}=await supabase.from("clinics").select("*").order("name"); if(data) setClinics(data); setLoading(false); };
  useEffect(()=>{ load(); },[]);
  const save = async () => { const {data:{user}}=await supabase.auth.getUser(); if(editing.id){await supabase.from("clinics").update(editing).eq("id",editing.id);}else{await supabase.from("clinics").insert({...editing,user_id:user.id});} setEditing(null); setSelected(null); load(); };
  const remove = async (id) => { if(!confirm("Delete this clinic?")) return; await supabase.from("clinics").delete().eq("id",id); setSelected(null); load(); };
  const clinic = clinics.find(c=>c.id===selected);
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold text-gray-900">Clinics</h1><p className="text-gray-500 text-sm mt-1">{clinics.length} clinics saved</p></div>
        <button onClick={()=>setEditing({...EMPTY})} className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition">+ Add Clinic</button></div>
      {editing && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e=>e.target===e.currentTarget&&setEditing(null)}>
        <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
          <h2 className="text-lg font-semibold mb-4">{editing.id?"Edit Clinic":"Add Clinic"}</h2>
          <div className="grid grid-cols-2 gap-3">
            {[["Clinic / Dentist Name *","name"],["BIG Register","big"],["Practice","practice"],["Phone","phone"],["Address","address"],["Email","email"]].map(([label,key])=>
              <div key={key} className={key==="address"?"col-span-2":""}><label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                <input value={editing[key]||""} onChange={e=>setEditing(p=>({...p,[key]:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" /></div>)}
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-500 mb-1">Notes</label>
              <textarea value={editing.notes||""} onChange={e=>setEditing(p=>({...p,notes:e.target.value}))} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-vertical" /></div>
          </div>
          <div className="flex justify-end gap-3 mt-5"><button onClick={()=>setEditing(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={save} disabled={!editing.name} className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-40">Save</button></div></div></div>}
      <div className={`grid gap-5 ${selected?"grid-cols-2":"grid-cols-1"}`}>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading?<div className="p-8 text-center text-gray-400">Loading...</div>:clinics.length===0?<div className="p-8 text-center text-gray-400">No clinics yet.</div>:
            clinics.map(c=><div key={c.id} onClick={()=>setSelected(c.id)} className={`flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 cursor-pointer transition ${selected===c.id?"bg-blue-50 border-l-[3px] border-l-blue-600":"hover:bg-gray-50 border-l-[3px] border-l-transparent"}`}>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-lg shrink-0">🏥</div>
              <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-gray-800 truncate">{c.name}</div><div className="text-xs text-gray-500 truncate">{c.practice||c.big||"—"}</div></div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.status==="active"?"bg-green-50 text-green-700":c.status==="trial"?"bg-amber-50 text-amber-700":"bg-gray-100 text-gray-600"}`}>{c.status}</span></div>)}
        </div>
        {clinic && <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-5"><div><h2 className="text-lg font-bold text-gray-800">{clinic.name}</h2><p className="text-sm text-gray-500 mt-1">{clinic.practice}{clinic.big?` · BIG: ${clinic.big}`:""}</p></div>
            <div className="flex gap-2"><button onClick={()=>setEditing({...clinic})} className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium hover:bg-gray-50">Edit</button>
              <button onClick={()=>remove(clinic.id)} className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50">Delete</button></div></div>
          {[["Address",clinic.address],["Phone",clinic.phone],["Email",clinic.email],["Notes",clinic.notes]].map(([l,v])=>v?<div key={l} className="mb-3"><div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{l}</div><div className="text-sm text-gray-700">{v}</div></div>:null)}
        </div>}
      </div>
    </div>);
}
