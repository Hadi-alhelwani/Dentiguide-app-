"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase-browser";
import Link from "next/link";
export default function DashboardPage() {
  const supabase = createClient();
  const [cases, setCases] = useState([]); const [clinicCount, setClinicCount] = useState(0); const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      const { data: cd } = await supabase.from("cases").select("*").order("created_at", { ascending: false }).limit(10);
      if (cd) setCases(cd);
      const { count } = await supabase.from("clinics").select("*", { count: "exact", head: true });
      setClinicCount(count || 0); setLoading(false);
    } load();
  }, []);
  const thisMonth = cases.filter(c => { const d = new Date(c.created_at), n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); });
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="text-gray-500 text-sm mt-1">Dentiguide MDR Documentation System</p></div>
        <Link href="/dashboard/new" className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition shadow-sm">+ New MDR Form</Link>
      </div>
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[{l:"Total Cases",v:loading?"...":cases.length,i:"📋"},{l:"This Month",v:loading?"...":thisMonth.length,i:"📅"},{l:"Saved Clinics",v:loading?"...":clinicCount,i:"🏥"}].map(s=>
          <div key={s.l} className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex justify-between items-start mb-3"><span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.l}</span><span className="text-xl">{s.i}</span></div><div className="text-3xl font-bold text-gray-900">{s.v}</div></div>
        )}
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center"><h2 className="font-semibold text-gray-800">Recent Cases</h2><Link href="/dashboard/cases" className="text-sm text-blue-600 hover:underline">View all →</Link></div>
        {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> : cases.length === 0 ?
          <div className="p-8 text-center"><p className="text-gray-400 mb-3">No cases yet.</p><Link href="/dashboard/new" className="text-blue-600 font-medium hover:underline">Create your first MDR form →</Link></div> :
          <div>{cases.slice(0,5).map(c => { const fd = c.form_data||{}; return (
            <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50"><span className="text-lg">📄</span>
              <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-gray-800 font-mono">{c.doc_ref}</div><div className="text-xs text-gray-500 truncate">{fd.prescriber?.name||"—"} · {fd.patient?.identifier||"—"}</div></div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.status==="final"?"bg-green-50 text-green-700":"bg-gray-100 text-gray-600"}`}>{c.status}</span>
              <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span></div>); })}</div>}
      </div>
    </div>);
}
