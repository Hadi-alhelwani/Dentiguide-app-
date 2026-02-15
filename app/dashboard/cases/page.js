"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase-browser";
import Link from "next/link";
export default function CasesPage() {
  const supabase = createClient();
  const [cases, setCases] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { supabase.from("cases").select("*").order("created_at",{ascending:false}).then(({data})=>{ if(data) setCases(data); setLoading(false); }); }, []);
  const remove = async (id) => { if(!confirm("Delete this case?")) return; await supabase.from("cases").delete().eq("id",id); setCases(p=>p.filter(c=>c.id!==id)); };
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold text-gray-900">Cases</h1><p className="text-gray-500 text-sm mt-1">{cases.length} documents</p></div>
        <Link href="/dashboard/new" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition">+ New MDR Form</Link></div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm"><thead><tr className="border-b-2 border-gray-100">
          {["Reference","Clinic","Patient","Device","Status","Date",""].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>)}</tr></thead>
        <tbody>{loading?<tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>:cases.length===0?<tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No cases yet</td></tr>:
          cases.map(c=>{const fd=c.form_data||{};const devs=(fd.device?.types||[]).map(t=>t.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())).join(", ");
            return <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3 font-mono font-semibold text-blue-600 text-xs">{c.doc_ref}</td>
              <td className="px-4 py-3 text-gray-800">{fd.prescriber?.name||"—"}</td>
              <td className="px-4 py-3 text-gray-500 font-mono text-xs">{fd.patient?.identifier||"—"}</td>
              <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px] truncate">{devs||"—"}</td>
              <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.status==="final"?"bg-green-50 text-green-700":"bg-gray-100 text-gray-600"}`}>{c.status}</span></td>
              <td className="px-4 py-3 text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3"><button onClick={()=>remove(c.id)} className="text-red-400 hover:text-red-600 text-xs">🗑️</button></td></tr>})}</tbody></table></div>
    </div>);
}
