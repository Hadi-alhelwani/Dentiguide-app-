"use client";
import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase-browser";
import MDRForm from "../../../components/MDRForm";
export default function NewFormPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState(null); const [clinics, setClinics] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(()=>{async function load(){const{data:{user}}=await supabase.auth.getUser();if(!user)return;
    let{data:s}=await supabase.from("settings").select("*").eq("user_id",user.id).single();
    if(!s){const{data:c}=await supabase.from("settings").insert({user_id:user.id}).select().single();s=c;}setSettings(s);
    const{data:cl}=await supabase.from("clinics").select("*").order("name");if(cl)setClinics(cl);setLoading(false);}load();},[]);
  const saveCase=async(docRef,formData)=>{const{data:{user}}=await supabase.auth.getUser();
    const{error}=await supabase.from("cases").insert({user_id:user.id,doc_ref:docRef,form_data:formData,status:"final"});
    await supabase.from("settings").update({doc_counter:(settings.doc_counter||0)+1}).eq("id",settings.id);return!error;};
  const saveClinic=async(clinic)=>{const{data:{user}}=await supabase.auth.getUser();
    const{data}=await supabase.from("clinics").insert({...clinic,user_id:user.id}).select().single();if(data)setClinics(p=>[...p,data]);return data;};
  if(loading) return <div className="p-8 text-gray-400">Loading...</div>;
  return <MDRForm settings={settings} clinics={clinics} onSaveCase={saveCase} onSaveClinic={saveClinic}/>;
}
