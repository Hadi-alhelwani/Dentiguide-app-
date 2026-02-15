"use client";
import { useState } from "react";

const DEVICE_TYPES = [
  { key: "surgical_guide_3d", label: "3D-Printed Surgical Guide", class: "I" },
  { key: "fixation_pin_guide", label: "Fixation Pin Guide", class: "I" },
  { key: "immediate_provisional", label: "Immediate Provisional Prosthesis", class: "IIa" },
  { key: "verification_jig", label: "Verification Jig", class: "I" },
  { key: "wax_rim", label: "Wax Rim / Bite Block", class: "I" },
  { key: "custom_tray", label: "Custom Impression Tray", class: "I" },
  { key: "model", label: "Diagnostic / Surgical Model", class: "I" },
];

const TOOTH_POSITIONS = [
  "18","17","16","15","14","13","12","11",
  "21","22","23","24","25","26","27","28",
  "48","47","46","45","44","43","42","41",
  "31","32","33","34","35","36","37","38",
];
const UPPER_RIGHT = ["18","17","16","15","14","13","12","11"];
const UPPER_LEFT = ["21","22","23","24","25","26","27","28"];
const LOWER_RIGHT = ["48","47","46","45","44","43","42","41"];
const LOWER_LEFT = ["31","32","33","34","35","36","37","38"];
const ALL_UPPER = [...UPPER_RIGHT,...UPPER_LEFT];
const ALL_LOWER = [...LOWER_RIGHT,...LOWER_LEFT];

const IMPLANT_SYSTEMS = [
  "Straumann (BLT / BLX / TLX)",
  "Nobel Biocare (NobelActive / NobelParallel / NobelReplace)",
  "Dentsply Sirona (Astra Tech / Xive / Ankylos)",
  "Camlog / iSy",
  "Neodent (Grand Morse / Helix)",
  "Megagen (AnyRidge / AnyOne)",
  "Osstem (TS / MS / SS)",
  "BioHorizons (Tapered Internal)",
  "Zimmer Biomet (T3 / TSV)",
  "J Dental Care (JDentalCare)",
  "Southern Implants",
  "BTI",
  "ICX-Templant (medentis medical)",
  "Other (specify in notes)",
];

const SLEEVE_OPTIONS = {
  "Straumann (BLT / BLX / TLX)": ["Straumann Guided Surgery Cassette","coDiagnostiX Fully Guided Sleeve — BLT","coDiagnostiX Fully Guided Sleeve — BLX","Pilot Drill Sleeve 2.2mm"],
  "Nobel Biocare (NobelActive / NobelParallel / NobelReplace)": ["Nobel Guided Surgery Sleeve — NobelActive","Nobel Guided Surgery Sleeve — NobelParallel","NobelGuide Pilot Drill Sleeve","DTX Studio Implant Sleeve"],
  "Neodent (Grand Morse / Helix)": ["Neodent Guided Surgery Kit Sleeve — GM","Neodent Guided Surgery Kit Sleeve — Helix","Pilot Drill Sleeve 2.0mm"],
  "Megagen (AnyRidge / AnyOne)": ["Megagen R2GATE Sleeve — AnyRidge","Megagen R2GATE Sleeve — AnyOne","Pilot Drill Sleeve 2.0mm"],
  "Camlog / iSy": ["Camlog Guide Sleeve","iSy Guided Sleeve","Pilot Drill Sleeve 2.0mm"],
  "default": ["Pilot Drill Sleeve 2.0mm","Pilot Drill Sleeve 2.2mm","Fully Guided Sleeve (specify in notes)","Open Guide (no sleeve)"],
};

const MAT_OPTIONS = [
  "NextDent SG — Surgical Guide Resin (Class I Biocompatible, Translucent Orange)",
  "Formlabs Surgical Guide V1 Resin","BEGO VarseoWax Surgical Guide",
  "SprintRay Surgical Guide 3 Resin","Dental LT Clear V2 (Formlabs)",
  "NextDent C&B MFH — Crown & Bridge","NextDent Denture 3D+",
];

const STEPS = [
  { key:"prescriber", label:"Prescriber", icon:"🩺" },
  { key:"patient", label:"Patient", icon:"👤" },
  { key:"device", label:"Device", icon:"🦷" },
  { key:"materials", label:"Materials", icon:"🧪" },
  { key:"review", label:"Review & Sign", icon:"✍️" },
];

function FormInput({label,value,onChange,type,placeholder,span}) {
  return <div className={span===2?"col-span-2":""}><label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label><input type={type||"text"} value={value||""} onChange={onChange} placeholder={placeholder||""} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"/></div>;
}

export default function MDRForm({ settings, clinics, onSaveCase, onSaveClinic }) {
  const [step, setStep] = useState(0);
  const mfr = { name:settings.company_name, street:settings.street, postal:settings.postal, city:settings.city, country:settings.country, phone:settings.phone, email:settings.email, prrcName:settings.prrc_name, prrcQual:settings.prrc_qual, site2Name:settings.site2_name, site2Address:settings.site2_address };
  const [prescriber, setPrescriber] = useState({ name:"",big:"",practice:"",address:"",phone:"",email:"",orderRef:"",prescDate:new Date().toISOString().split("T")[0] });
  const [patient, setPatient] = useState({ method:"code", identifier:"" });
  const [device, setDevice] = useState({ types:[],teeth:[],shade:"A2",software:"",labRef:"",notes:"",designDate:"",implantSystem:"",implantDetails:"",sleeveType:"",fixationSleeve:"" });
  const [materials, setMaterials] = useState({ rows:[{material:"",manufacturer:"",batch:"",ceMarked:true}], printer:"",postProcess:"" });
  const [sign, setSign] = useState({ signerName:settings.signer_name||"", signerTitle:settings.signer_title||"Managing Director", credentials:settings.signer_credentials||"", date:new Date().toISOString().split("T")[0], gsprExceptions:"" });
  const [docRef] = useState(()=>{ const y=new Date().getFullYear(); const c=(settings.doc_counter||0)+1; return `CMD-${y}-${String(c).padStart(4,"0")}`; });
  const [downloading, setDownloading] = useState(false);

  const selectClinic = (id) => { const c=clinics.find(x=>x.id===id); if(c) setPrescriber(p=>({...p,name:c.name,big:c.big,practice:c.practice,address:c.address,phone:c.phone,email:c.email})); };
  const toggleDevice = (key) => setDevice(p=>({...p,types:p.types.includes(key)?p.types.filter(t=>t!==key):[...p.types,key]}));
  const toggleTooth = (t) => {
    setDevice(p => {
      const has = p.teeth.includes(t);
      if (t === "Full Upper Arch") {
        return { ...p, teeth: has ? p.teeth.filter(x => !ALL_UPPER.includes(x) && x !== t && x !== "Full Mouth") : [...new Set([...p.teeth, ...ALL_UPPER, t])] };
      }
      if (t === "Full Lower Arch") {
        return { ...p, teeth: has ? p.teeth.filter(x => !ALL_LOWER.includes(x) && x !== t && x !== "Full Mouth") : [...new Set([...p.teeth, ...ALL_LOWER, t])] };
      }
      if (t === "Full Mouth") {
        const allTeeth = [...ALL_UPPER, ...ALL_LOWER];
        return { ...p, teeth: has ? [] : [...allTeeth, "Full Upper Arch", "Full Lower Arch", "Full Mouth"] };
      }
      return { ...p, teeth: has ? p.teeth.filter(x => x !== t && x !== "Full Upper Arch" && x !== "Full Lower Arch" && x !== "Full Mouth") : [...p.teeth, t] };
    });
  };
  const addMatRow = () => setMaterials(p=>({...p,rows:[...p.rows,{material:"",manufacturer:"",batch:"",ceMarked:true}]}));
  const upMat = (i,k,v) => setMaterials(p=>{const rows=[...p.rows];rows[i]={...rows[i],[k]:v};return{...p,rows};});
  const esc = (s) => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const fmtDate = (iso) => { if(!iso) return ""; const p=iso.split("-"); return p.length===3?`${p[2]}-${p[1]}-${p[0]}`:iso; };
  const highestClass = device.types.some(t=>DEVICE_TYPES.find(d=>d.key===t)?.class==="IIa")?"IIa":"I";
  const deviceLabel = device.types.map(t=>DEVICE_TYPES.find(d=>d.key===t)?.label||t).join(", ")||"Custom dental device";
  const canProceed = () => { switch(step){case 0:return prescriber.name;case 1:return patient.identifier;case 2:return device.types.length>0;case 3:return materials.rows.some(r=>r.material);case 4:return sign.signerName;default:return true;} };

  const generateMDR = () => {
    const matRows = materials.rows.filter(r=>r.material);
    const retention = highestClass==="I"?"10 years":"15 years (implantable)";
    const showPractice = prescriber.practice && prescriber.practice.trim().toLowerCase()!==prescriber.name.trim().toLowerCase();
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>EU MDR Annex XIII — ${docRef}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;font-size:9px;color:#2a3e52;line-height:1.35}@page{size:A4;margin:6mm 11mm}@media print{body{font-size:8.5px;color:#000!important}.no-print{display:none!important}}.header{background:linear-gradient(135deg,#1a3a5c,#24506e);color:#fff;padding:7px 14px 6px;margin-bottom:4px;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:flex;justify-content:space-between;align-items:center}.header h1{font-size:12px;font-weight:700}.header p{font-size:7.5px;opacity:0.8;margin-top:1px}.tag{display:inline-block;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);padding:1px 7px;border-radius:3px;font-size:7px;margin-left:3px}.doc-ref-bar{display:flex;justify-content:space-between;padding:3px 8px;border:1px solid #d0dbe8;border-radius:4px;margin-bottom:4px;font-size:7.5px}.cards{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:4px}.card{border:1px solid #d0dbe8;border-radius:6px;padding:7px 10px;border-left:3px solid #2a6fdb}.card.green{border-left-color:#1a7a3a}.card.amber{border-left-color:#c47a0a}.card-title{font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#4a6fa5;margin-bottom:4px}.card-row{font-size:8px;line-height:1.4;color:#3a4a5a;margin-bottom:1px}.mat-table{width:100%;border-collapse:collapse;margin:4px 0}.mat-table th{text-align:left;padding:3px 6px;font-size:7px;font-weight:700;color:#4a6fa5;border-bottom:1.5px solid #c8ddf0}.mat-table td{padding:3px 6px;font-size:8px;border-bottom:1px solid #e8eef5}.declaration{border:2px solid #1a3a5c;border-radius:8px;padding:10px 14px;margin:6px 0}.declaration h3{font-size:10px;font-weight:700;color:#1a3a5c;margin-bottom:6px}.declaration p{font-size:8px;line-height:1.5;margin-bottom:4px}.sig-section{margin-top:6px}.sig-section .title{font-size:8px;font-weight:700;color:#1a3a5c;border-bottom:1px solid #d0dbe8;padding-bottom:3px;margin-bottom:6px}.sig-field{display:inline-block;width:32%;margin-right:1%}.sig-field label{font-size:6.5px;color:#7a8fa5;display:block}.sig-field .val{font-size:8.5px;font-weight:600;border-bottom:1px solid #999;padding-bottom:2px;min-height:14px}.footer{border-top:1px solid #e0e6ec;margin-top:4px;padding-top:2px;font-size:6px;color:#a0aab4;display:flex;justify-content:space-between}</style></head><body>
<div class="header"><div><h1>EU MDR Annex XIII Statement</h1><p>Regulation (EU) 2017/745 — Custom-Made Device</p></div><div style="text-align:right"><div style="font-size:9px;font-weight:600;margin-bottom:2px">${esc(mfr.name)}</div><span class="tag">Annex XIII</span><span class="tag">Class ${highestClass}</span></div></div>
<div class="doc-ref-bar"><div>Doc: <strong>${docRef}</strong> &middot; Lab: <strong>${esc(device.labRef||"—")}</strong>${prescriber.orderRef?` &middot; Rx: <strong>${esc(prescriber.orderRef)}</strong>`:""} &middot; Date: <strong>${fmtDate(sign.date)}</strong></div><div>Retention: ${retention}</div></div>
<div class="cards"><div class="card"><div class="card-title">From — Manufacturer</div><div class="card-row"><strong>${esc(mfr.name)}</strong></div><div class="card-row">${esc(mfr.street)}, ${esc(mfr.postal)} ${esc(mfr.city)}, ${esc(mfr.country)}</div>${mfr.phone?`<div class="card-row">☎ ${esc(mfr.phone)}</div>`:""} ${mfr.prrcName?`<div style="margin-top:3px;border-top:1px solid #d0dbe8;padding-top:3px"><div style="font-size:6.5px;color:#7a8fa5">Person Responsible for Regulatory Compliance (Art. 15)</div><div style="font-size:8.5px;font-weight:700;color:#1a3a5c">${esc(mfr.prrcName)}</div>${mfr.prrcQual?`<div style="font-size:6.5px;color:#6a8aaa">${esc(mfr.prrcQual)}</div>`:""}</div>`:""}</div>
<div class="card green"><div class="card-title">To — Clinic / Prescriber</div><div class="card-row"><strong>${esc(prescriber.name)}</strong></div><div class="card-row">BIG: <strong>${esc(prescriber.big)}</strong></div>${showPractice?`<div class="card-row">${esc(prescriber.practice)}</div>`:""} ${prescriber.address?`<div class="card-row">${esc(prescriber.address)}</div>`:""}<div class="card-row">Prescription: ${fmtDate(prescriber.prescDate)}</div></div></div>
<div class="cards"><div class="card amber"><div class="card-title">Patient</div><div class="card-row">${esc(patient.method==="code"?"Patient Code":"Patient Name")}: <strong>${esc(patient.identifier)}</strong></div></div>
<div class="card"><div class="card-title">Device</div><div class="card-row"><strong>${esc(deviceLabel)}</strong></div><div class="card-row">Region: ${esc(device.teeth.filter(t=>t.length===2).sort().join(", ")||"—")}</div>${device.implantSystem?`<div class="card-row">Implant: ${esc(device.implantSystem==="Other (specify in notes)"?device.implantDetails:device.implantSystem)}</div>`:""} ${device.sleeveType?`<div class="card-row">Sleeve: ${esc(device.sleeveType)}</div>`:""} ${device.fixationSleeve?`<div class="card-row">Fixation: ${esc(device.fixationSleeve)}</div>`:""} ${device.software?`<div class="card-row">Design: ${esc(device.software)}${device.designDate?` · ${fmtDate(device.designDate)}`:""}</div>`:""} ${device.notes?`<div class="card-row">Notes: ${esc(device.notes)}</div>`:""}</div></div>
<table class="mat-table"><thead><tr><th>Material</th><th>Manufacturer</th><th>Lot/Batch</th><th>CE</th></tr></thead><tbody>${matRows.map(r=>`<tr><td>${esc(r.material)}</td><td>${esc(r.manufacturer)}</td><td>${esc(r.batch||"Per mfr records")}</td><td>${r.ceMarked?"✓":"✗"}</td></tr>`).join("")}</tbody></table>
${materials.printer?`<div style="font-size:7.5px;color:#4a6fa5;margin-top:3px">Printer: ${esc(materials.printer)}${materials.postProcess?` · Post-process: ${esc(materials.postProcess)}`:""}</div>`:""}
<div class="declaration"><h3>MDR Statement — Annex XIII Section 1</h3><p>The undersigned declares that the custom-made device described herein:</p><p><strong>(a)</strong> is intended for the sole use of patient <strong>${esc(patient.identifier)}</strong>, as prescribed by <strong>${esc(prescriber.name)}</strong> (BIG: ${esc(prescriber.big)});</p><p><strong>(b)</strong> has specific design characteristics as specified in the prescription;</p><p><strong>(c)</strong> conforms to the general safety and performance requirements of Annex I that are applicable, and where not fully met, justification is documented;</p><p><strong>(d)</strong> the device has been manufactured in accordance with the prescription under appropriate quality management.</p>${sign.gsprExceptions?`<p><strong>GSPR Exceptions:</strong> ${esc(sign.gsprExceptions)}</p>`:""}</div>
<div class="sig-section"><div class="title">Authorised Signature — Manufacturer</div><div class="sig-field"><label>Name (print)</label><div class="val">${esc(sign.signerName)}${sign.credentials?`, ${esc(sign.credentials)}`:""}</div></div><div class="sig-field"><label>Title / Function</label><div class="val">${esc(sign.signerTitle)}</div></div><div class="sig-field"><label>Date</label><div class="val">${fmtDate(sign.date)}</div></div></div>
<div class="footer"><span>${esc(mfr.name)} · ${esc(mfr.city)}, ${esc(mfr.country)}</span><span>${docRef} · Generated ${new Date().toLocaleDateString()}</span></div></body></html>`;
  };

  const generateDeliveryNote = () => {
    const matRows = materials.rows.filter(r=>r.material);
    const showPractice = prescriber.practice && prescriber.practice.trim().toLowerCase()!==prescriber.name.trim().toLowerCase();
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Delivery Note — ${docRef}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;font-size:10px;color:#2a3e52;line-height:1.4}@page{size:A4;margin:8mm 12mm}@media print{body{font-size:9px;color:#000!important}.no-print{display:none!important}}.header{background:linear-gradient(135deg,#1a3a5c,#24506e);color:#fff;padding:10px 18px;margin-bottom:6px;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:flex;justify-content:space-between;align-items:center}.header h1{font-size:14px;font-weight:700}.header p{font-size:8px;opacity:0.8;margin-top:2px}.ref-bar{padding:5px 10px;border:1px solid #d0dbe8;border-radius:5px;margin-bottom:6px;font-size:8.5px;display:flex;justify-content:space-between}.cards{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px}.card{border:1px solid #d0dbe8;border-radius:6px;padding:8px 12px}.card-title{font-size:8px;font-weight:700;text-transform:uppercase;color:#4a6fa5;margin-bottom:5px}.card-row{font-size:9px;line-height:1.5;margin-bottom:1px}.mat-table{width:100%;border-collapse:collapse;margin:6px 0}.mat-table th{text-align:left;padding:4px 8px;font-size:8px;font-weight:700;color:#4a6fa5;border-bottom:2px solid #c8ddf0}.mat-table td{padding:4px 8px;font-size:9px;border-bottom:1px solid #e8eef5}.qc-box{border:2px solid #1a7a3a;border-radius:8px;padding:10px 14px;margin:8px 0;background:#f0faf4}.qc-box h3{font-size:11px;color:#1a5a2c;margin-bottom:6px}.qc-row{display:flex;gap:20px;margin-top:6px}.qc-field label{font-size:7px;color:#6a8fa5;display:block}.qc-field .val{font-size:9px;font-weight:600;border-bottom:1px solid #999;padding-bottom:2px;min-height:16px;min-width:120px}.handling{border:2px solid #e8a000;border-radius:8px;padding:10px 14px;margin:8px 0;background:#fffbf0}.handling h3{font-size:10px;color:#8a6000;margin-bottom:6px}.footer{border-top:1.5px solid #d0dae4;margin-top:8px;padding-top:4px;font-size:7px;color:#6a7a8a;display:flex;justify-content:space-between}</style></head><body>
<div class="header"><div><h1>Delivery Note</h1><p>Custom-Made Dental Device</p></div><div style="text-align:right;font-size:10px;font-weight:600">${esc(mfr.name)}<br><span style="font-size:7.5px;opacity:0.7">Delivery Note</span></div></div>
<div class="ref-bar"><div>MDR Ref: <strong>${docRef}</strong>${device.labRef?` · Lab: <strong>${esc(device.labRef)}</strong>`:""}${prescriber.orderRef?` · Rx: <strong>${esc(prescriber.orderRef)}</strong>`:""}</div><div>Delivery Date: <strong>${fmtDate(sign.date)}</strong></div></div>
<div class="cards"><div class="card"><div class="card-title">From — Manufacturer</div><div class="card-row"><strong>${esc(mfr.name)}</strong></div><div class="card-row">${esc(mfr.street)}, ${esc(mfr.postal)} ${esc(mfr.city)}</div>${mfr.phone?`<div class="card-row">☎ ${esc(mfr.phone)}</div>`:""}</div>
<div class="card"><div class="card-title">To — Clinic / Prescriber</div><div class="card-row"><strong>${esc(prescriber.name)}</strong></div>${showPractice?`<div class="card-row">${esc(prescriber.practice)}</div>`:""} ${prescriber.address?`<div class="card-row">${esc(prescriber.address)}</div>`:""} ${prescriber.phone?`<div class="card-row">☎ ${esc(prescriber.phone)}</div>`:""}</div></div>
<div class="card" style="margin-bottom:6px"><div class="card-title">Device Details</div><table style="font-size:9px;line-height:1.6"><tr><td style="color:#4a6fa5;width:120px">Patient</td><td><strong>${esc(patient.identifier)}</strong></td></tr><tr><td style="color:#4a6fa5">Device</td><td><strong>${esc(deviceLabel)}</strong></td></tr><tr><td style="color:#4a6fa5">Teeth / Region</td><td>${esc(device.teeth.filter(t=>t.length===2).sort().join(", ")||"—")}</td></tr>${device.implantSystem?`<tr><td style="color:#4a6fa5">Implant System</td><td>${esc(device.implantSystem==="Other (specify in notes)"?device.implantDetails:device.implantSystem)}</td></tr>`:""} ${device.sleeveType?`<tr><td style="color:#4a6fa5">Guided Sleeve</td><td>${esc(device.sleeveType)}</td></tr>`:""} ${device.fixationSleeve?`<tr><td style="color:#4a6fa5">Fixation Sleeve</td><td>${esc(device.fixationSleeve)}</td></tr>`:""} ${device.software?`<tr><td style="color:#4a6fa5">Design Software</td><td>${esc(device.software)}</td></tr>`:""} ${device.shade?`<tr><td style="color:#4a6fa5">Shade</td><td>${esc(device.shade)}</td></tr>`:""}</table></div>
<table class="mat-table"><thead><tr><th>Material</th><th>Manufacturer</th><th>Lot/Batch</th><th>CE</th></tr></thead><tbody>${matRows.map(r=>`<tr><td>${esc(r.material)}</td><td>${esc(r.manufacturer)}</td><td>${esc(r.batch||"Per mfr records")}</td><td>${r.ceMarked?"✓":"✗"}</td></tr>`).join("")}</tbody></table>
<div class="handling"><h3>⚠ Important — Handling & Storage Instructions</h3><div style="font-size:9px;line-height:1.6"><div>🚫 <strong>Single use only.</strong> Do not reuse, resterilise, or modify.</div><div>✅ <strong>Before use:</strong> Disinfect or sterilise per the resin manufacturer's IFU and clinic protocol.</div><div>📦 <strong>Storage:</strong> Keep in protective packaging, avoid direct sunlight and heat.</div><div>⏱ <strong>Shelf life:</strong> Use within 6 months of manufacturing date.</div></div></div>
<div class="qc-box"><h3>✅ Quality Control — Release for Clinical Use</h3><div style="font-size:9px">This device has been manufactured in accordance with the prescription, inspected for dimensional accuracy and surface quality, and is released for clinical use.</div><div class="qc-row"><div class="qc-field"><label>Inspected by</label><div class="val">${esc(sign.signerName)}${sign.credentials?`, ${esc(sign.credentials)}`:""}</div></div><div class="qc-field"><label>Date</label><div class="val">${fmtDate(sign.date)}</div></div><div class="qc-field"><label>Signature</label><div class="val" style="border-bottom-style:dashed;min-height:22px"></div></div></div></div>
<div class="footer"><span>${esc(mfr.name)} · ${esc(mfr.city)}, ${esc(mfr.country)}</span><span>${docRef} · Generated ${new Date().toLocaleDateString()}</span></div></body></html>`;
  };

  const download = (html, suffix) => { const blob=new Blob([html],{type:"text/html"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`${docRef}${suffix}.html`; a.click(); };
  const handleDownloadMDR = async () => { setDownloading(true); download(generateMDR(),""); await onSaveCase(docRef,{mfr,prescriber,patient,device,materials,sign}); setDownloading(false); };
  const handleDownloadDelivery = () => download(generateDeliveryNote(),"_DeliveryNote");
  const handleSaveClinic = async () => { if(!prescriber.name)return; await onSaveClinic({name:prescriber.name,big:prescriber.big,practice:prescriber.practice,address:prescriber.address,phone:prescriber.phone,email:prescriber.email}); };

  
  const up=(setter,key)=>(e)=>setter(p=>({...p,[key]:e.target.value}));

  return (
    <div>
      <div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold text-gray-900">New MDR Form</h1><p className="text-gray-500 text-sm mt-1">EU MDR Annex XIII — {docRef}</p></div></div>
      <div className="flex gap-1 mb-6">{STEPS.map((s,i)=><button key={s.key} onClick={()=>i<=step?setStep(i):null} className={`flex-1 py-2.5 text-center text-xs font-medium transition ${i===0?"rounded-l-lg":""} ${i===STEPS.length-1?"rounded-r-lg":""} ${i===step?"bg-blue-600 text-white font-bold":i<step?"bg-blue-400 text-white cursor-pointer":"bg-gray-200 text-gray-500"}`}><span className="block text-base">{s.icon}</span>{s.label}</button>)}</div>
      <div className="bg-white rounded-xl border border-gray-200 p-7 min-h-[400px]">

        {step===0&&<div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Prescriber / Clinic</h2><p className="text-sm text-gray-500 mb-5">Select a saved clinic or enter new prescriber details.</p>
          {clinics.length>0&&<div className="mb-5"><label className="block text-xs font-semibold text-gray-500 mb-1">Quick Select</label>
            <select onChange={e=>e.target.value&&selectClinic(e.target.value)} defaultValue="" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"><option value="">— Select saved clinic —</option>{clinics.map(c=><option key={c.id} value={c.id}>{c.name}{c.practice&&c.practice!==c.name?` (${c.practice})`:""}</option>)}</select></div>}
          <div className="grid grid-cols-2 gap-4"><FormInput label="Dentist / Prescriber Name *" value={prescriber.name} onChange={up(setPrescriber,"name")}/><FormInput label="BIG Register Number" value={prescriber.big} onChange={up(setPrescriber,"big")}/><FormInput label="Practice / Clinic" value={prescriber.practice} onChange={up(setPrescriber,"practice")}/><FormInput label="Phone" value={prescriber.phone} onChange={up(setPrescriber,"phone")}/><FormInput label="Address" value={prescriber.address} onChange={up(setPrescriber,"address")} span={2}/><FormInput label="Rx Order Reference" value={prescriber.orderRef} onChange={up(setPrescriber,"orderRef")}/><FormInput label="Prescription Date" type="date" value={prescriber.prescDate} onChange={up(setPrescriber,"prescDate")}/></div>
          {prescriber.name&&!clinics.some(c=>c.name===prescriber.name)&&<button onClick={handleSaveClinic} className="mt-4 px-4 py-2 rounded-lg border border-blue-200 text-blue-600 text-sm font-medium hover:bg-blue-50 transition">💾 Save this clinic for future use</button>}
        </div>}

        {step===1&&<div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Patient Identification</h2><p className="text-sm text-gray-500 mb-5">Use a patient code for privacy (GDPR).</p>
          <div className="flex gap-3 mb-4">{[["code","Patient Code"],["name","Full Name"]].map(([v,l])=><button key={v} onClick={()=>setPatient(p=>({...p,method:v}))} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${patient.method===v?"bg-blue-600 text-white":"border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{l}</button>)}</div>
          <FormInput label={patient.method==="code"?"Patient Code *":"Patient Name *"} value={patient.identifier} onChange={up(setPatient,"identifier")} placeholder={patient.method==="code"?"e.g. PT-8821":"e.g. Jan de Vries"}/>
        </div>}

        {step===2&&<div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Device Details</h2><p className="text-sm text-gray-500 mb-5">Select device type(s), tooth positions, and implant specifications.</p>
          <div className="grid grid-cols-2 gap-2 mb-5">{DEVICE_TYPES.map(d=><button key={d.key} onClick={()=>toggleDevice(d.key)} className={`text-left px-4 py-3 rounded-lg border text-sm transition ${device.types.includes(d.key)?"border-blue-500 bg-blue-50 text-blue-800 font-semibold":"border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{device.types.includes(d.key)?"☑":"☐"} {d.label}<span className="ml-2 text-xs opacity-60">Class {d.class}</span></button>)}</div>

          {/* TOOTH CHART */}
          <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 mb-3">Tooth Positions (FDI)</label>
            {/* Upper Jaw */}
            <div className="text-center mb-1"><span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">Upper Jaw</span></div>
            <div className="flex justify-center items-center mb-1">
              <div className="text-right mr-1"><span className="text-[9px] text-gray-400 font-semibold">Q1 (UR)</span></div>
              <div className="flex gap-[2px]">{UPPER_RIGHT.map(t=><button key={t} onClick={()=>toggleTooth(t)} className={`w-[32px] h-[32px] rounded-md text-[11px] font-semibold transition-all ${device.teeth.includes(t)?"border-2 border-blue-500 bg-blue-100 text-blue-800":"border border-gray-300 bg-white text-gray-500 hover:bg-gray-100"}`}>{t}</button>)}</div>
              <div className="w-[8px]"/>
              <div className="flex gap-[2px]">{UPPER_LEFT.map(t=><button key={t} onClick={()=>toggleTooth(t)} className={`w-[32px] h-[32px] rounded-md text-[11px] font-semibold transition-all ${device.teeth.includes(t)?"border-2 border-blue-500 bg-blue-100 text-blue-800":"border border-gray-300 bg-white text-gray-500 hover:bg-gray-100"}`}>{t}</button>)}</div>
              <div className="ml-1"><span className="text-[9px] text-gray-400 font-semibold">Q2 (UL)</span></div>
            </div>
            {/* Divider */}
            <div className="flex justify-center my-1"><div className="w-[280px] border-t border-dashed border-gray-300"/></div>
            {/* Lower Jaw */}
            <div className="flex justify-center items-center mb-1">
              <div className="text-right mr-1"><span className="text-[9px] text-gray-400 font-semibold">Q4 (LR)</span></div>
              <div className="flex gap-[2px]">{LOWER_RIGHT.map(t=><button key={t} onClick={()=>toggleTooth(t)} className={`w-[32px] h-[32px] rounded-md text-[11px] font-semibold transition-all ${device.teeth.includes(t)?"border-2 border-blue-500 bg-blue-100 text-blue-800":"border border-gray-300 bg-white text-gray-500 hover:bg-gray-100"}`}>{t}</button>)}</div>
              <div className="w-[8px]"/>
              <div className="flex gap-[2px]">{LOWER_LEFT.map(t=><button key={t} onClick={()=>toggleTooth(t)} className={`w-[32px] h-[32px] rounded-md text-[11px] font-semibold transition-all ${device.teeth.includes(t)?"border-2 border-blue-500 bg-blue-100 text-blue-800":"border border-gray-300 bg-white text-gray-500 hover:bg-gray-100"}`}>{t}</button>)}</div>
              <div className="ml-1"><span className="text-[9px] text-gray-400 font-semibold">Q3 (LL)</span></div>
            </div>
            <div className="text-center mt-1"><span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">Lower Jaw</span></div>
            {/* Arch Shortcuts */}
            <div className="flex justify-center gap-2 mt-3">
              {[["Full Upper Arch","🦷 Full Upper"],["Full Lower Arch","🦷 Full Lower"],["Full Mouth","🦷 Full Mouth"]].map(([key,lbl])=>
                <button key={key} onClick={()=>toggleTooth(key)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${device.teeth.includes(key)?"bg-blue-600 text-white":"border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"}`}>{lbl}</button>
              )}
            </div>
            {device.teeth.length>0&&<div className="mt-2 text-center text-xs text-blue-600 font-medium">Selected: {device.teeth.filter(t=>t.length===2).sort().join(", ")}{device.teeth.includes("Full Upper Arch")?" · Full Upper Arch":""}{device.teeth.includes("Full Lower Arch")?" · Full Lower Arch":""}</div>}
          </div>

          {/* IMPLANT SYSTEM — show if surgical guide or fixation pin guide selected */}
          {(device.types.includes("surgical_guide_3d")||device.types.includes("fixation_pin_guide"))&&<div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <label className="block text-xs font-semibold text-blue-700 mb-2">Implant System</label>
            <select value={device.implantSystem} onChange={e=>setDevice(p=>({...p,implantSystem:e.target.value,sleeveType:""}))} className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 mb-3">
              <option value="">— Select implant system —</option>
              {IMPLANT_SYSTEMS.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            {device.implantSystem==="Other (specify in notes)"&&<FormInput label="Implant System Details" value={device.implantDetails} onChange={e=>setDevice(p=>({...p,implantDetails:e.target.value}))} placeholder="Enter implant system name and specifications"/>}

            {/* SLEEVE SPECIFICATIONS */}
            {device.implantSystem&&device.implantSystem!=="Other (specify in notes)"&&<div className="mt-3">
              <label className="block text-xs font-semibold text-blue-700 mb-2">Guided Surgery Sleeve</label>
              <select value={device.sleeveType} onChange={e=>setDevice(p=>({...p,sleeveType:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">— Select sleeve type —</option>
                {(SLEEVE_OPTIONS[device.implantSystem]||SLEEVE_OPTIONS["default"]).map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>}
            {device.implantSystem&&<div className="mt-3">
              <label className="block text-xs font-semibold text-blue-700 mb-2">Fixation Pin Sleeve</label>
              <select value={device.fixationSleeve} onChange={e=>setDevice(p=>({...p,fixationSleeve:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">— None / Not applicable —</option>
                <option value="Fixation Pin Sleeve 1.5mm">Fixation Pin Sleeve 1.5mm</option>
                <option value="Fixation Pin Sleeve 1.2mm">Fixation Pin Sleeve 1.2mm</option>
                <option value="Custom (specify in notes)">Custom (specify in notes)</option>
              </select>
            </div>}
          </div>}

          <div className="grid grid-cols-2 gap-4"><FormInput label="Design Software" value={device.software} onChange={up(setDevice,"software")} placeholder="e.g. coDiagnostiX"/><FormInput label="Design Date" type="date" value={device.designDate} onChange={up(setDevice,"designDate")}/><FormInput label="Lab Reference" value={device.labRef} onChange={up(setDevice,"labRef")}/><FormInput label="Shade" value={device.shade} onChange={up(setDevice,"shade")}/><FormInput label="Clinical Notes" value={device.notes} onChange={up(setDevice,"notes")} span={2}/></div>
        </div>}

        {step===3&&<div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Materials & Processing</h2><p className="text-sm text-gray-500 mb-5">Specify all materials used.</p>
          {materials.rows.map((r,i)=><div key={i} className="grid grid-cols-4 gap-3 mb-3">
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-500 mb-1">Material {i+1}</label>
              <select value={r.material} onChange={e=>upMat(i,"material",e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"><option value="">Select...</option>{MAT_OPTIONS.map(m=><option key={m} value={m}>{m}</option>)}<option value="_custom">— Custom —</option></select>
              {r.material==="_custom"&&<input placeholder="Enter material" onChange={e=>upMat(i,"material",e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mt-1 outline-none focus:ring-2 focus:ring-blue-500"/>}</div>
            <FormInput label="Manufacturer" value={r.manufacturer} onChange={e=>upMat(i,"manufacturer",e.target.value)}/><FormInput label="Lot/Batch" value={r.batch} onChange={e=>upMat(i,"batch",e.target.value)}/></div>)}
          <button onClick={addMatRow} className="text-sm text-blue-600 font-medium hover:underline mb-5">+ Add material row</button>
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4"><FormInput label="3D Printer" value={materials.printer} onChange={e=>setMaterials(p=>({...p,printer:e.target.value}))} placeholder="e.g. Formlabs Form 3B"/><FormInput label="Post-Processing" value={materials.postProcess} onChange={e=>setMaterials(p=>({...p,postProcess:e.target.value}))} placeholder="e.g. IPA wash, UV cure"/></div>
        </div>}

        {step===4&&<div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Review & Sign</h2><p className="text-sm text-gray-500 mb-5">Verify details, then download.</p>
          <div className="grid grid-cols-2 gap-4 mb-6">{[["Prescriber",`${prescriber.name} · BIG: ${prescriber.big}`],["Patient",patient.identifier],["Device",deviceLabel],["Teeth",device.teeth.filter(t=>t.length===2).sort().join(", ")||"—"],["Materials",materials.rows.filter(r=>r.material).map(r=>r.material).join("; ")||"—"],["Class",highestClass],...(device.implantSystem?[["Implant System",device.implantSystem==="Other (specify in notes)"?device.implantDetails:device.implantSystem]]:[]),(device.sleeveType?[["Sleeve",device.sleeveType]]:[]),(device.fixationSleeve?[["Fixation Sleeve",device.fixationSleeve]]:[])].map(([l,v])=><div key={l} className="p-3 bg-gray-50 rounded-lg"><div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{l}</div><div className="text-sm text-gray-800 font-medium truncate">{v}</div></div>)}</div>
          <div className="border-t border-gray-100 pt-5"><h3 className="text-sm font-semibold text-gray-700 mb-3">Signature</h3>
            <div className="grid grid-cols-3 gap-4"><FormInput label="Name *" value={sign.signerName} onChange={up(setSign,"signerName")}/><FormInput label="Title" value={sign.signerTitle} onChange={up(setSign,"signerTitle")}/><FormInput label="Date" type="date" value={sign.date} onChange={up(setSign,"date")}/></div>
            <div className="mt-3"><FormInput label="Credentials" value={sign.credentials} onChange={up(setSign,"credentials")} placeholder="e.g. DDS · MSc Periodontics"/><p className="text-xs text-gray-400 mt-1">Appears after name on documents.</p></div></div>
          <div className="flex gap-3 mt-8">
            <button onClick={handleDownloadMDR} disabled={downloading||!sign.signerName} className="px-6 py-3 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 disabled:opacity-40 transition shadow-sm">📄 Download MDR Statement</button>
            <button onClick={handleDownloadDelivery} disabled={!sign.signerName} className="px-6 py-3 rounded-lg bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 disabled:opacity-40 transition shadow-sm">📦 Download Delivery Note</button></div>
          <p className="text-xs text-gray-400 mt-3">Both download as HTML — open in browser, then Print → Save as PDF.</p>
        </div>}
      </div>

      <div className="flex justify-between mt-5">
        <button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm disabled:opacity-30 hover:bg-gray-50 transition">← Back</button>
        {step<4&&<button onClick={()=>canProceed()&&setStep(step+1)} disabled={!canProceed()} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 transition shadow-sm">Continue →</button>}
      </div>
    </div>
  );
}
