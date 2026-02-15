"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { getDocuments, getClinics } from "@/lib/db";

export default function DashboardPage() {
  const [docs, setDocs] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [d, c] = await Promise.all([getDocuments(supabase, user.id), getClinics(supabase, user.id)]);
      setDocs(d);
      setClinics(c);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="text-gray-400 text-sm p-8">Loading...</div>;

  const thisMonth = docs.filter(d => {
    const created = new Date(d.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  });

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your MDR documentation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: "Total Documents", value: docs.length, icon: "📄", color: "text-blue-600" },
          { label: "This Month", value: thisMonth.length, icon: "📅", color: "text-green-600" },
          { label: "Saved Clinics", value: clinics.length, icon: "🏥", color: "text-purple-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{s.label}</span>
              <span className="text-lg">{s.icon}</span>
            </div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-7">
        <a href="/mdr" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition cursor-pointer block">
          <div className="text-2xl mb-2">📄</div>
          <div className="font-semibold text-gray-800 text-sm">New MDR Statement + Delivery Note</div>
          <div className="text-xs text-gray-500 mt-1">Create EU MDR Annex XIII documentation for a new case</div>
        </a>
        <a href="/settings" className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition cursor-pointer block">
          <div className="text-2xl mb-2">⚙️</div>
          <div className="font-semibold text-gray-800 text-sm">Settings</div>
          <div className="text-xs text-gray-500 mt-1">Company info, signatory, clinics, materials</div>
        </a>
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-700">Recent Documents</h3>
        </div>
        {docs.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No documents yet. <a href="/mdr" className="text-blue-500 font-medium">Create your first MDR form →</a>
          </div>
        ) : (
          docs.slice(0, 10).map(d => (
            <div key={d.id} className="flex items-center gap-3 px-5 py-3 border-b border-gray-50 hover:bg-gray-50">
              <span className="text-base">{d.doc_type === "mdr_statement" ? "📄" : "📦"}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-800 font-mono">{d.doc_ref}</div>
                <div className="text-xs text-gray-500 truncate">
                  {d.clinics?.name || "—"} · {d.patient_code || "—"} · {d.device_types?.join(", ") || "—"}
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${d.status === "final" ? "bg-green-50 text-green-600" : d.status === "voided" ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-500"}`}>
                {d.status}
              </span>
              <span className="text-xs text-gray-400">{new Date(d.created_at).toLocaleDateString("de-DE")}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
