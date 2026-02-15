"use client";
import { useState } from "react";

const DEVICE_TYPES = [
  { key: "surgical_guide_3d", label: "3D Printed Surgical Guide", class: "I" },
  { key: "crown_3d", label: "3D Printed Crown(s)", class: "IIa" },
  { key: "bridge_3d", label: "3D Printed Bridge(s)", class: "IIa" },
  { key: "crown_zirconia", label: "Milled Zirconia Crown(s)", class: "IIa" },
  { key: "bridge_zirconia", label: "Milled Zirconia Bridge(s)", class: "IIa" },
  { key: "crown_pmma", label: "Milled PMMA Crown(s)", class: "IIa" },
  { key: "bridge_pmma", label: "Milled PMMA Bridge(s)", class: "IIa" },
  { key: "titanium_bar", label: "Titanium Milled Bar", class: "IIa" },
  { key: "ti_denture", label: "Ti-Reinforced Denture (PMMA + Ti)", class: "IIa" },
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

const DESIGN_SOFTWARE = [
  "coDiagnostiX (Dental Wings / Straumann)",
  "exocad DentalCAD (exocad GmbH)",
  "exocad exoplan (Guided Surgery)",
  "RealGUIDE (3DIEMME Srl)",
  "BlueSkyPlan (Blue Sky Bio, LLC)",
  "Navident (ClaroNav Inc.)",
  "DTX Studio Implant (Nobel Biocare)",
  "R2GATE (MegaGen)",
  "3Shape Implant Studio",
  "Other (specify in notes)",
];

const FIXATION_PIN_SYSTEMS = [
  "Straumann",
  "Neodent",
  "Megagen",
  "J Dental Care",
];

const DEVICE_WARNINGS = {
  surgical_guide_3d: [
    "Single-use only. Reuse or reprocessing beyond one clinical use is not permitted.",
    "Intended for temporary intra-oral contact during the surgical procedure only.",
    "Intra-operative verification of correct seating, stability, and fit is the responsibility of the prescribing clinician.",
    "The manufacturer does not perform clinical assessment, surgical decision-making, or intra-operative adjustments.",
  ],
  crown_3d: [
    "Custom-made restorative device. Not intended for mass production or serial manufacture.",
    "Verify occlusion, marginal fit, and shade match before final cementation.",
    "For temporary / semi-permanent use only unless material is indicated for definitive restoration per manufacturer's IFU.",
    "The prescribing clinician is responsible for assessing clinical suitability, tooth preparation adequacy, and final placement.",
  ],
  bridge_3d: [
    "Custom-made restorative device. Not intended for mass production or serial manufacture.",
    "Verify occlusion, marginal fit, shade match, and pontic contact before final cementation.",
    "For temporary / semi-permanent use only unless material is indicated for definitive restoration per manufacturer's IFU.",
    "The prescribing clinician is responsible for assessing abutment suitability, span length, and final placement.",
  ],
  crown_zirconia: [
    "Custom-made restorative device. Not intended for mass production or serial manufacture.",
    "Verify occlusion, marginal fit, and shade match before final cementation.",
    "Intended for definitive (permanent) restoration. Cementation with resin cement recommended per manufacturer's IFU.",
    "The prescribing clinician is responsible for assessing clinical suitability and final placement.",
  ],
  bridge_zirconia: [
    "Custom-made restorative device. Not intended for mass production or serial manufacture.",
    "Verify occlusion, marginal fit, shade match, and pontic contact before final cementation.",
    "Intended for definitive (permanent) restoration. Cementation with resin cement recommended per manufacturer's IFU.",
    "The prescribing clinician is responsible for assessing abutment suitability, span length, and final placement.",
  ],
  crown_pmma: [
    "Custom-made restorative device. Not intended for mass production or serial manufacture.",
    "Intended as temporary / provisional restoration only.",
    "Do not use as a definitive (permanent) restoration. Maximum service life per material manufacturer's IFU.",
    "The prescribing clinician is responsible for assessing clinical suitability and scheduling definitive treatment.",
  ],
  bridge_pmma: [
    "Custom-made restorative device. Not intended for mass production or serial manufacture.",
    "Intended as temporary / provisional restoration only.",
    "Do not use as a definitive (permanent) restoration. Maximum service life per material manufacturer's IFU.",
    "The prescribing clinician is responsible for assessing abutment suitability, span length, and scheduling definitive treatment.",
  ],
  titanium_bar: [
    "Custom-made implant-supported framework. Not intended for mass production or serial manufacture.",
    "Verify passive fit on implants before final prosthesis assembly. Use screw-retained protocol per implant system IFU.",
    "Long-term implantable device (Class IIa). Torque values per implant system manufacturer's IFU.",
    "The prescribing clinician is responsible for assessing implant integration, fit verification, and final assembly.",
  ],
  ti_denture: [
    "Custom-made implant-supported hybrid prosthesis. Not intended for mass production or serial manufacture.",
    "Verify passive fit of titanium framework on implants before bonding prosthetic component.",
    "The resin component is intended as temporary / semi-permanent. Schedule replacement per material manufacturer's IFU.",
    "The prescribing clinician is responsible for implant assessment, fit verification, occlusal adjustment, and patient follow-up.",
  ],
};

const MATERIAL_DETAILS = {
  // ── SprintRay Pro 55S — OEM Resins ──
  "SprintRay Surgical Guide 3 — Biocompatible, Autoclavable": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay OnX Tough 2 — NanoFusion™ Hybrid (MDR/FDA, Fixed Hybrids)": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay Ceramic Crown — Nanoceramic (>50% ceramic, Class II, Definitive)": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay Crown™ (VarseoSmile Crown Plus) — Ceramic-filled (Definitive)": {
    manufacturer: "BEGO GmbH & Co. KG, Bremen, Germany", ecosystem: "sprintray",
  },
  "SprintRay EU Temporary Crown & Teeth — Biocompatible": {
    manufacturer: "SprintRay Europe GmbH, Iserlohn, Germany", ecosystem: "sprintray",
  },
  "SprintRay EU High Impact Denture Base": {
    manufacturer: "SprintRay Europe GmbH, Iserlohn, Germany", ecosystem: "sprintray",
  },
  "SprintRay Apex Base — Denture Base Resin": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay Apex Teeth — Denture Teeth Resin": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay NightGuard Flex — Occlusal Guard (FDA 510(k))": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay EU Splint Flex — Occlusal Splint": {
    manufacturer: "SprintRay Europe GmbH, Iserlohn, Germany", ecosystem: "sprintray",
  },
  "SprintRay Die & Model 2 Tan — Dental Model": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay Die & Model 2 Gray — Aligner/Ortho Model": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay Try-in 2 — Try-in Dentures": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay IDB 2 — Indirect Bonding Tray": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay Gingiva Mask — Soft Tissue Replica": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay Castable 2 — Investment Casting": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay EU Castable Red — Investment Casting": {
    manufacturer: "SprintRay Europe GmbH, Iserlohn, Germany", ecosystem: "sprintray",
  },
  "SprintRay Retainer — Direct 3D-Printed Retainer": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  "SprintRay Study Model White 2 — Patient Presentation": {
    manufacturer: "SprintRay Inc., Los Angeles, CA, USA", ecosystem: "sprintray",
  },
  // ── SprintRay Pro 55S — Certified Partner Resins ──
  "DENTCA Crown & Bridge — Temporary C&B Resin": {
    manufacturer: "DENTCA Inc., Torrance, CA, USA", ecosystem: "sprintray",
  },
  "DENTCA Denture Base 2 — Denture Base": {
    manufacturer: "DENTCA Inc., Torrance, CA, USA", ecosystem: "sprintray",
  },
  "DENTCA Denture Teeth — Denture Teeth": {
    manufacturer: "DENTCA Inc., Torrance, CA, USA", ecosystem: "sprintray",
  },
  "BEGO VarseoSmile Temp — Temporary Restorations": {
    manufacturer: "BEGO GmbH & Co. KG, Bremen, Germany", ecosystem: "sprintray",
  },
  "BEGO VarseoSmile Teeth — Denture Teeth": {
    manufacturer: "BEGO GmbH & Co. KG, Bremen, Germany", ecosystem: "sprintray",
  },
  "KeyStone KeyGuide — Surgical Guide": {
    manufacturer: "KeyStone Industries, Gibbstown, NJ, USA", ecosystem: "sprintray",
  },
  "KeyStone KeySplint Soft — Flexible Splint": {
    manufacturer: "KeyStone Industries, Gibbstown, NJ, USA", ecosystem: "sprintray",
  },
  "KeyStone KeySplint Hard — Rigid Splint": {
    manufacturer: "KeyStone Industries, Gibbstown, NJ, USA", ecosystem: "sprintray",
  },
  // ── Formlabs Form 4B — Validated Resins ──
  "Formlabs Surgical Guide Resin — Biocompatible, Autoclavable": {
    manufacturer: "Formlabs Inc., Somerville, MA, USA", ecosystem: "formlabs",
  },
  "Formlabs Premium Teeth Resin — Nano-Ceramic (Temp C&B / All-on-X / Denture Teeth)": {
    manufacturer: "Formlabs Inc., Somerville, MA, USA", ecosystem: "formlabs",
  },
  "BEGO VarseoSmile TriniQ Resin — Ceramic-filled (Permanent + Temp C&B, Denture Teeth)": {
    manufacturer: "BEGO GmbH & Co. KG, Bremen, Germany", ecosystem: "formlabs",
  },
  "Formlabs Denture Base Resin — Denture Base (Class II)": {
    manufacturer: "Formlabs Inc., Somerville, MA, USA", ecosystem: "formlabs",
  },
  "Formlabs Dental LT Clear Resin V2 — Hard Splints/Night Guards": {
    manufacturer: "Formlabs Inc., Somerville, MA, USA", ecosystem: "formlabs",
  },
  "Formlabs Dental LT Comfort Resin — Flexible Splints/Guards": {
    manufacturer: "Formlabs Inc., Somerville, MA, USA", ecosystem: "formlabs",
  },
  "Formlabs Precision Model Resin — Restorative Models (>99% accuracy)": {
    manufacturer: "Formlabs Inc., Somerville, MA, USA", ecosystem: "formlabs",
  },
  "Formlabs Fast Model Resin — Aligner/Thermoforming Models": {
    manufacturer: "Formlabs Inc., Somerville, MA, USA", ecosystem: "formlabs",
  },
  "Formlabs Grey Resin V5 — Diagnostic/General Models": {
    manufacturer: "Formlabs Inc., Somerville, MA, USA", ecosystem: "formlabs",
  },
  "Formlabs Custom Tray Resin — Custom Impression Trays": {
    manufacturer: "Formlabs Inc., Somerville, MA, USA", ecosystem: "formlabs",
  },
  "Formlabs IBT Flex Resin — Indirect Bonding Trays": {
    manufacturer: "Formlabs Inc., Somerville, MA, USA", ecosystem: "formlabs",
  },
  "Formlabs Castable Wax Resin — 20% Wax Fill, Investment Casting": {
    manufacturer: "Formlabs Inc., Somerville, MA, USA", ecosystem: "formlabs",
  },
  "Lucitone Digital Print 3D Denture Base (BAM™ High Impact)": {
    manufacturer: "Dentsply Sirona Inc., Charlotte, NC, USA", ecosystem: "formlabs",
  },
  "Lucitone Digital IPN 3D Premium Tooth — Denture Teeth": {
    manufacturer: "Dentsply Sirona Inc., Charlotte, NC, USA", ecosystem: "formlabs",
  },
  "Lucitone Digital Value 3D — Economy Tooth & Try-in": {
    manufacturer: "Dentsply Sirona Inc., Charlotte, NC, USA", ecosystem: "formlabs",
  },
  // ── Milling Materials (ecosystem-independent) ──
  "Zirconia Disc (e.g. Ivoclar IPS e.max ZirCAD / Kuraray Noritake)": {
    manufacturer: "", ecosystem: "milling",
  },
  "PMMA Disc (e.g. Ivoclar Ivotion / VITA VIONIC)": {
    manufacturer: "", ecosystem: "milling",
  },
  "Grade 5 Titanium (Ti-6Al-4V) Disc": {
    manufacturer: "", ecosystem: "milling",
  },
};

const ECOSYSTEMS = {
  sprintray: {
    printer: "SprintRay Pro 55S (DLP, 55µm XY resolution, 385nm UV)",
    wash: "SprintRay ProWash S",
    cure: "SprintRay ProCure 2",
    software: "RayWare",
  },
  formlabs: {
    printer: "Formlabs Form 4B (MSLA, 405nm)",
    wash: "Formlabs Form Wash",
    cure: "Formlabs Form Cure V2",
    software: "PreForm",
  },
  milling: {
    printer: "",
    wash: "",
    cure: "",
    software: "exocad DentalCAD",
  },
};

const DEVICE_MATERIAL_PRESETS = {
  surgical_guide_3d: [
    {
      label: "SprintRay",
      material: "SprintRay Surgical Guide 3 — Biocompatible, Autoclavable",
      manufacturer: "SprintRay Inc., Los Angeles, CA, USA",
      ecosystem: "sprintray",
      processes: ["3D Printing (DLP — SprintRay Pro 55S)", "IPA Wash", "UV Post-Curing (ProCure 2)", "Support Removal / Finishing"],
      postProcess: "1) IPA 99% wash in SprintRay ProWash S — 5 min\n2) Air dry completely\n3) UV post-cure in SprintRay ProCure 2 — 30 min at 60°C\n4) Support removal & finishing\n5) Insert metal drill sleeves\n6) Optional: sterilisation per resin manufacturer's IFU and clinic protocol."
    },
    {
      label: "Formlabs",
      material: "Formlabs Surgical Guide Resin — Biocompatible, Autoclavable",
      manufacturer: "Formlabs Inc., Somerville, MA, USA",
      ecosystem: "formlabs",
      processes: ["3D Printing (MSLA — Formlabs Form 4B)", "IPA Wash", "UV Post-Curing (Form Cure V2)", "Support Removal / Finishing"],
      postProcess: "1) IPA 99% wash in Formlabs Form Wash — 5 min\n2) Remove from build platform\n3) Air dry completely — at least 30 min\n4) UV post-cure in Formlabs Form Cure V2 — 30 min at 60°C\n5) Support removal & finishing\n6) Insert metal drill sleeves\n7) Optional: autoclave sterilisation per Formlabs IFU (prevacuum, 134°C/3 min or 121°C/15 min)."
    },
  ],
  crown_3d: [
    {
      label: "SprintRay",
      material: "SprintRay OnX Tough 2 — NanoFusion™ Hybrid (MDR/FDA, Fixed Hybrids)",
      manufacturer: "SprintRay Inc., Los Angeles, CA, USA",
      ecosystem: "sprintray",
      processes: ["3D Printing (DLP — SprintRay Pro 55S)", "IPA Wash", "UV Post-Curing (ProCure 2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA wash in SprintRay ProWash S — OnX Tough profile\n2) Spray screw channels with IPA\n3) Post-cure in SprintRay ProCure 2 — 5 min (385nm, auto-heat)\n   Alt: ProCure 1 — 60 min at 60°C\n4) Post-cure IPA spray + dry towel wipe (30 sec)\n5) Support removal with carbide bur / fibre disc\n6) Polish for aesthetics\n7) Optional: characterise with VITA Akzent LC (tack cure between layers, final cure 5 min in ProCure 2)"
    },
    {
      label: "Formlabs",
      material: "Formlabs Premium Teeth Resin — Nano-Ceramic (Temp C&B / All-on-X / Denture Teeth)",
      manufacturer: "Formlabs Inc., Somerville, MA, USA",
      ecosystem: "formlabs",
      processes: ["3D Printing (MSLA — Formlabs Form 4B)", "IPA Wash", "UV Post-Curing (Form Cure V2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA 99% wash in Formlabs Form Wash — per Premium Teeth IFU\n2) Air dry completely\n3) UV post-cure in Formlabs Form Cure V2 — per Premium Teeth IFU settings\n4) Support removal with carbide bur / fibre disc\n5) Polish for aesthetics\n6) Note: Use dedicated resin tank & build platform for biocompatible resins"
    },
  ],
  bridge_3d: [
    {
      label: "SprintRay",
      material: "SprintRay OnX Tough 2 — NanoFusion™ Hybrid (MDR/FDA, Fixed Hybrids)",
      manufacturer: "SprintRay Inc., Los Angeles, CA, USA",
      ecosystem: "sprintray",
      processes: ["3D Printing (DLP — SprintRay Pro 55S)", "IPA Wash", "UV Post-Curing (ProCure 2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA wash in SprintRay ProWash S — OnX Tough profile\n2) Spray screw channels with IPA\n3) Post-cure in SprintRay ProCure 2 — 5 min (385nm, auto-heat)\n   Alt: ProCure 1 — 60 min at 60°C\n4) Post-cure IPA spray + dry towel wipe (30 sec)\n5) Support removal with carbide bur / fibre disc\n6) Polish for aesthetics\n7) Optional: characterise with VITA Akzent LC"
    },
    {
      label: "Formlabs",
      material: "Formlabs Premium Teeth Resin — Nano-Ceramic (Temp C&B / All-on-X / Denture Teeth)",
      manufacturer: "Formlabs Inc., Somerville, MA, USA",
      ecosystem: "formlabs",
      processes: ["3D Printing (MSLA — Formlabs Form 4B)", "IPA Wash", "UV Post-Curing (Form Cure V2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA 99% wash in Formlabs Form Wash — per Premium Teeth IFU\n2) Air dry completely\n3) UV post-cure in Formlabs Form Cure V2 — per Premium Teeth IFU settings\n4) Support removal\n5) Polish for aesthetics\n6) Note: Use dedicated resin tank & build platform for biocompatible resins"
    },
  ],
  crown_zirconia: [
    {
      label: "Milled Zirconia",
      material: "Zirconia Disc (e.g. Ivoclar IPS e.max ZirCAD / Kuraray Noritake)",
      manufacturer: "",
      ecosystem: "milling",
      processes: ["CAD/CAM Milling (Wet)", "Sintering", "Glazing / Staining"],
      postProcess: "1) CAD/CAM milling (wet, 5-axis)\n2) Sintering — per manufacturer's IFU (typically 1450–1550°C, 6–8h cycle)\n3) Staining / characterisation\n4) Glaze firing\n5) Final inspection & fit check"
    },
  ],
  bridge_zirconia: [
    {
      label: "Milled Zirconia",
      material: "Zirconia Disc (e.g. Ivoclar IPS e.max ZirCAD / Kuraray Noritake)",
      manufacturer: "",
      ecosystem: "milling",
      processes: ["CAD/CAM Milling (Wet)", "Sintering", "Glazing / Staining"],
      postProcess: "1) CAD/CAM milling (wet, 5-axis)\n2) Sintering — per manufacturer's IFU\n3) Staining / characterisation\n4) Glaze firing\n5) Final inspection & fit check"
    },
  ],
  crown_pmma: [
    {
      label: "Milled PMMA",
      material: "PMMA Disc (e.g. Ivoclar Ivotion / VITA VIONIC)",
      manufacturer: "",
      ecosystem: "milling",
      processes: ["CAD/CAM Milling (Dry)", "Polishing / Finishing"],
      postProcess: "1) CAD/CAM milling (dry)\n2) Support removal & finishing\n3) Polish for aesthetics\n4) Final inspection & fit check"
    },
  ],
  bridge_pmma: [
    {
      label: "Milled PMMA",
      material: "PMMA Disc (e.g. Ivoclar Ivotion / VITA VIONIC)",
      manufacturer: "",
      ecosystem: "milling",
      processes: ["CAD/CAM Milling (Dry)", "Polishing / Finishing"],
      postProcess: "1) CAD/CAM milling (dry)\n2) Support removal & finishing\n3) Polish for aesthetics\n4) Final inspection & fit check"
    },
  ],
  titanium_bar: [
    {
      label: "Milled Titanium Bar",
      material: "Grade 5 Titanium (Ti-6Al-4V) Disc",
      manufacturer: "",
      ecosystem: "milling",
      processes: ["CAD/CAM Milling (Wet)", "Polishing / Finishing"],
      postProcess: "1) CAD/CAM milling (wet, 5-axis)\n2) Support removal & finishing\n3) Sandblasting\n4) Polish for aesthetics\n5) Final inspection & screw-fit check"
    },
  ],
  ti_denture: [
    {
      label: "SprintRay + Ti Bar",
      material: "SprintRay OnX Tough 2 — NanoFusion™ Hybrid (MDR/FDA, Fixed Hybrids)",
      manufacturer: "SprintRay Inc., Los Angeles, CA, USA",
      ecosystem: "sprintray",
      processes: ["3D Printing (DLP — SprintRay Pro 55S)", "IPA Wash", "UV Post-Curing (ProCure 2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA wash in SprintRay ProWash S — OnX Tough profile\n2) Post-cure in SprintRay ProCure 2 — 5 min\n3) Support removal\n4) Bond to milled titanium bar\n5) Polish for aesthetics"
    },
    {
      label: "Formlabs + Ti Bar",
      material: "Formlabs Premium Teeth Resin — Nano-Ceramic (Temp C&B / All-on-X / Denture Teeth)",
      manufacturer: "Formlabs Inc., Somerville, MA, USA",
      ecosystem: "formlabs",
      processes: ["3D Printing (MSLA — Formlabs Form 4B)", "IPA Wash", "UV Post-Curing (Form Cure V2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA 99% wash in Formlabs Form Wash — per Premium Teeth IFU\n2) Air dry completely\n3) UV post-cure in Formlabs Form Cure V2 — per IFU settings\n4) Support removal\n5) Bond to milled titanium bar\n6) Polish for aesthetics"
    },
  ],
};

const MFG_PROCESSES = [
  "3D Printing (DLP — SprintRay Pro 55S)", "3D Printing (MSLA — Formlabs Form 4B)",
  "3D Printing (SLA)", "3D Printing (SLS/SLM)",
  "CAD/CAM Milling (Wet)", "CAD/CAM Milling (Dry)", "Sintering",
  "IPA Wash", "UV Post-Curing (ProCure 2)", "UV Post-Curing (Form Cure V2)",
  "Support Removal / Finishing", "Polishing / Finishing", "Glazing / Staining",
  "Cementation", "Sandblasting",
];

const MAT_OPTIONS = Object.entries(MATERIAL_DETAILS).map(([name, d]) => ({ name, eco: d.ecosystem }));

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
  const [device, setDevice] = useState({ types:[],teeth:[],shade:"A2",software:"",labRef:"",notes:"",designDate:"",implantSystem:"",implantDetails:"",sleeveType:"",fixationSleeve:"",fixationPinSystem:"" });
  const [materials, setMaterials] = useState({ rows:[{material:"",manufacturer:"",batch:"",ceMarked:true}], printer:"",postProcess:"",processes:[],wash:"",cure:"",slicingSoftware:"",postProcessProtocol:"" });
  const [sign, setSign] = useState({ signerName:settings.signer_name||"", signerTitle:settings.signer_title||"Managing Director", credentials:settings.signer_credentials||"", date:new Date().toISOString().split("T")[0], gsprExceptions:"" });
  const [docRef] = useState(()=>{ const y=new Date().getFullYear(); const c=(settings.doc_counter||0)+1; return `CMD-${y}-${String(c).padStart(4,"0")}`; });
  const [downloading, setDownloading] = useState(false);
  const [clinicSaved, setClinicSaved] = useState("");

  const selectClinic = (id) => { const c=clinics.find(x=>x.id===id); if(c) setPrescriber(p=>({...p,name:c.name,big:c.big,practice:c.practice,address:c.address,phone:c.phone,email:c.email})); };
  const toggleDevice = (key) => {
    setDevice(p=>({...p,types:p.types.includes(key)?p.types.filter(t=>t!==key):[...p.types,key]}));
    // Auto-fill materials when adding a device type
    if(!device.types.includes(key)) {
      const presets = DEVICE_MATERIAL_PRESETS[key];
      if(presets && presets.length>0) {
        const preset = presets[0]; // default to first option
        const eco = ECOSYSTEMS[preset.ecosystem] || {};
        setMaterials(p => {
          const alreadyHas = p.rows.some(r=>r.material===preset.material);
          let rows = [...p.rows];
          if(!alreadyHas) {
            const newRow = {material:preset.material,manufacturer:preset.manufacturer,batch:"",ceMarked:true};
            rows = rows.length===1&&!rows[0].material ? [newRow] : [...rows,newRow];
          }
          const newProcesses = [...new Set([...p.processes,...(preset.processes||[])])];
          return {
            ...p, rows,
            processes: newProcesses,
            printer: p.printer||eco.printer||"",
            wash: p.wash||eco.wash||"",
            cure: p.cure||eco.cure||"",
            slicingSoftware: p.slicingSoftware||eco.software||"",
            postProcessProtocol: p.postProcessProtocol||preset.postProcess||"",
          };
        });
      }
    }
  };
  const applyPreset = (preset) => {
    const eco = ECOSYSTEMS[preset.ecosystem] || {};
    setMaterials(p => {
      // Replace all material rows with just the preset material
      const rows = [{material:preset.material,manufacturer:preset.manufacturer,batch:"",ceMarked:true}];
      return {
        ...p, rows,
        processes: [...new Set([...(preset.processes||[])])],
        printer: eco.printer||"",
        wash: eco.wash||"",
        cure: eco.cure||"",
        slicingSoftware: eco.software||"",
        postProcessProtocol: preset.postProcess||"",
      };
    });
  };
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
  const upMat = (i,k,v) => setMaterials(p=>{const rows=[...p.rows];rows[i]={...rows[i],[k]:v};if(k==="material"&&MATERIAL_DETAILS[v]){rows[i].manufacturer=MATERIAL_DETAILS[v].manufacturer;const eco=ECOSYSTEMS[MATERIAL_DETAILS[v].ecosystem];if(eco){return{...p,rows,printer:eco.printer,wash:eco.wash,cure:eco.cure,slicingSoftware:eco.software};}}return{...p,rows};});
  const esc = (s) => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const fmtDate = (iso) => { if(!iso) return ""; const p=iso.split("-"); return p.length===3?`${p[2]}-${p[1]}-${p[0]}`:iso; };
  const highestClass = device.types.some(t=>DEVICE_TYPES.find(d=>d.key===t)?.class==="IIa")?"IIa":"I";
  const deviceLabel = device.types.map(t=>DEVICE_TYPES.find(d=>d.key===t)?.label||t).join(", ")||"Custom dental device";
  const canProceed = () => { switch(step){case 0:return prescriber.name;case 1:return patient.identifier;case 2:return device.types.length>0;case 3:return materials.rows.some(r=>r.material);case 4:return sign.signerName;default:return true;} };

  const generateMDR = () => {
    const matRows = materials.rows.filter(r=>r.material);
    const retention = highestClass==="I"?"10 years":"15 years (implantable)";
    const showPractice = prescriber.practice && prescriber.practice.trim().toLowerCase()!==prescriber.name.trim().toLowerCase();
    const isRestorative = device.types.some(t=>["crown_3d","bridge_3d","crown_zirconia","bridge_zirconia","crown_pmma","bridge_pmma"].includes(t));
    // Collect device-specific warnings (deduplicated)
    const warningSet = new Set();
    device.types.forEach(t => { (DEVICE_WARNINGS[t]||DEVICE_WARNINGS.surgical_guide_3d).forEach(w => warningSet.add(w)); });
    const warnings = [...warningSet];
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>EU MDR Annex XIII — ${docRef}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;font-size:9px;color:#1a2a3a;line-height:1.4}@page{size:A4;margin:7mm 12mm}@media print{body{font-size:8.5px;color:#000!important}.no-print{display:none!important}.declaration,.warn-box,.biocompat-box{page-break-inside:avoid}}.header{background:#1a3a5c;color:#fff;padding:8px 14px 7px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center;-webkit-print-color-adjust:exact;print-color-adjust:exact}.header h1{font-size:12.5px;font-weight:700;letter-spacing:-0.01em}.header p{font-size:7.5px;opacity:0.85;margin-top:1px}.logo-area{display:flex;align-items:center;gap:8px}.logo-area svg{flex-shrink:0}.tag{display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.3);padding:1.5px 8px;border-radius:3px;font-size:7px;margin-left:3px;font-weight:600}.doc-ref-bar{display:flex;justify-content:space-between;padding:4px 10px;border:1.5px solid #1a3a5c;border-radius:4px;margin-bottom:5px;font-size:7.5px}.cards{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-bottom:5px}.card{border:1px solid #c0cdd8;border-radius:5px;padding:7px 10px;border-left:3px solid #2a6fdb}.card.green{border-left-color:#1a7a3a}.card.amber{border-left-color:#c47a0a}.card-title{font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#3a5a7a;margin-bottom:4px}.card-row{font-size:8px;line-height:1.45;color:#2a3a4a;margin-bottom:1px}.mat-table{width:100%;border-collapse:collapse;margin:5px 0}.mat-table th{text-align:left;padding:3px 6px;font-size:7px;font-weight:700;color:#3a5a7a;border-bottom:1.5px solid #1a3a5c}.mat-table td{padding:3px 6px;font-size:8px;border-bottom:1px solid #d0dbe8}.section-box{border:1px solid #c0cdd8;border-radius:5px;padding:8px 12px;margin:5px 0}.section-title{font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#3a5a7a;margin-bottom:4px}.declaration{border:2px solid #1a3a5c;border-radius:6px;padding:10px 14px;margin:6px 0;page-break-inside:avoid}.declaration h3{font-size:10px;font-weight:700;color:#1a3a5c;margin-bottom:6px}.declaration p{font-size:8px;line-height:1.55;margin-bottom:3px}.sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:5px 0}.sig-grid .section-box{margin:0}.sig-label{font-size:7px;color:#5a7a9a;display:block;margin-bottom:1px}.sig-val{font-size:8.5px;font-weight:600;color:#1a2a3a}.footer-info{border-radius:4px;padding:5px 10px;margin-top:5px;font-size:7px;color:#3a5a6a;border:1px solid #c0cdd8}.footer-line{border-top:1px solid #d0dbe8;margin-top:3px;padding-top:2px;font-size:6.5px;color:#7a8a9a;display:flex;justify-content:space-between}.footer-note{font-size:6.5px;color:#8a9aaa;text-align:center;margin-top:2px}</style></head><body>
<div class="header"><div class="logo-area"><svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="16" fill="#ffffff" fill-opacity="0.15"/><path d="M50 15C38 15 28 25 28 40C28 58 50 85 50 85C50 85 72 58 72 40C72 25 62 15 50 15Z" fill="#ffffff" fill-opacity="0.9"/><circle cx="50" cy="38" r="10" fill="#1a3a5c"/></svg><div><h1>EU MDR 2017/745 — Annex XIII</h1><p>Custom-Made Dental Device Statement</p></div></div><div style="text-align:right"><div style="font-size:10px;font-weight:700;margin-bottom:2px">${esc(mfr.name)}</div><span class="tag">Custom-made device</span><span class="tag">EU MDR 2017/745</span><span class="tag">Annex XIII</span></div></div>
<div class="doc-ref-bar"><div>Ref: <strong>${docRef}</strong>${device.labRef?` &middot; Lab: <strong>${esc(device.labRef)}</strong>`:""}${prescriber.orderRef?` &middot; Rx: <strong>${esc(prescriber.orderRef)}</strong>`:""} &middot; Date: <strong>${fmtDate(sign.date)}</strong></div><div style="font-weight:600">Indicative: Class ${highestClass} &middot; Form v1.0</div></div>
<div class="cards"><div class="card"><div class="card-title">Manufacturer (Annex XIII §1)</div><div class="card-row"><strong>${esc(mfr.name)}</strong></div><div class="card-row">${esc(mfr.street)}, ${esc(mfr.postal)} ${esc(mfr.city)}, ${esc(mfr.country)}</div>${mfr.phone?`<div class="card-row">☎ ${esc(mfr.phone)}</div>`:""} ${mfr.prrcName?`<div style="margin-top:3px;border-top:1px solid #d0dbe8;padding-top:3px"><div style="font-size:7px;color:#5a7a9a">Person Responsible for Regulatory Compliance (Art. 15)</div><div style="font-size:8.5px;font-weight:700;color:#1a3a5c">${esc(mfr.prrcName)}</div>${mfr.prrcQual?`<div style="font-size:7px;color:#5a7a9a;font-style:italic">${esc(mfr.prrcQual)}</div>`:""}</div>`:""}</div>
<div class="card green"><div class="card-title">Prescribing Health Professional</div><div class="card-row"><strong>${esc(prescriber.name)}</strong></div><div class="card-row">BIG Register: <strong>${esc(prescriber.big)}</strong></div>${showPractice?`<div class="card-row">${esc(prescriber.practice)}</div>`:""} ${prescriber.address?`<div class="card-row">${esc(prescriber.address)}</div>`:""} ${prescriber.phone?`<div class="card-row">☎ ${esc(prescriber.phone)}</div>`:""}<div class="card-row">Prescription: ${fmtDate(prescriber.prescDate)}</div></div></div>
<div class="cards"><div class="card amber"><div class="card-title">Patient Identification</div><div class="card-row">${esc(patient.method==="code"?"Patient Code":"Initials")}: <strong>${esc(patient.identifier)}</strong></div></div>
<div class="card"><div class="card-title">Device Description</div><div class="card-row"><strong>${esc(deviceLabel)}</strong> &rarr; <em>Indicative: Class ${highestClass} (Rule ${highestClass==="I"?"5":"8"} — custom-made device)</em></div><div class="card-row">Teeth/Region: <strong>${esc(device.teeth.filter(t=>t.length===2).sort().join(", ")||"—")}</strong></div>${device.implantSystem?`<div class="card-row">Implant System: ${esc(device.implantSystem==="Other (specify in notes)"?device.implantDetails:device.implantSystem)}</div>`:""} ${device.sleeveType?`<div class="card-row">Sleeve System: ${esc(device.sleeveType)}</div>`:""} ${device.fixationSleeve?`<div class="card-row">Fixation Sleeve: ${esc(device.fixationSleeve)}</div>`:""} ${device.fixationPinSystem?`<div class="card-row">Fixation Pin System: ${esc(device.fixationPinSystem)}</div>`:""} ${isRestorative&&device.shade?`<div class="card-row">Shade: ${esc(device.shade)}</div>`:""} ${device.software?`<div class="card-row">Design: ${esc(device.software)}${device.designDate?` &middot; Completed: ${fmtDate(device.designDate)}`:""}</div>`:""} ${device.notes?`<div class="card-row" style="font-style:italic">Notes: ${esc(device.notes)}</div>`:""}</div></div>
<div class="section-box"><div class="section-title">Materials &amp; Traceability (Annex XIII §2(a))</div><table class="mat-table"><thead><tr><th>Material</th><th>Manufacturer</th><th>Lot / Batch</th><th>CE</th><th>Expiry</th></tr></thead><tbody>${matRows.map(r=>`<tr><td>${esc(r.material)}</td><td>${esc(r.manufacturer)}</td><td>${esc(r.batch||"Available in manufacturer records")}</td><td>${r.ceMarked?"✓ CE":"✗"}</td><td>—</td></tr>`).join("")}</tbody></table></div>
<div class="cards"><div class="section-box" style="margin:0"><div class="section-title">Manufacturing Processes</div><div style="font-size:7.5px;line-height:1.6">${materials.processes.map(p=>`✓ ${esc(p)}`).join("<br/>")}</div></div>
<div class="section-box" style="margin:0"><div class="section-title">Equipment</div><div style="font-size:7.5px;line-height:1.6">${materials.printer?`<strong>Printer:</strong> ${esc(materials.printer)}<br/>`:""} ${materials.wash?`<strong>Wash:</strong> ${esc(materials.wash)}<br/>`:""} ${materials.cure?`<strong>Cure:</strong> ${esc(materials.cure)}<br/>`:""} ${materials.slicingSoftware?`<strong>Software:</strong> ${esc(materials.slicingSoftware)}`:""}</div></div></div>
${materials.postProcessProtocol?`<div class="section-box"><div class="section-title">Post-Processing Protocol</div><div style="font-size:7.5px;line-height:1.6;white-space:pre-line">${esc(materials.postProcessProtocol).replace(/\n/g,"<br/>")}</div></div>`:""}
<div class="section-box biocompat-box"><div class="section-title">Biocompatibility Confirmation (Annex I GSPR)</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:2px;font-size:7.5px;line-height:1.5"><div>☑ CE-marked biocompatible materials used for intended purpose</div><div>☑ ISO 10993 biological safety covered by material manufacturer</div><div>☑ Manufacturer IFU followed</div><div>☑ No known allergens / hazards</div></div></div>
<div class="section-box warn-box"><div class="section-title">Warnings &amp; Limitations</div><div style="font-size:7.5px;line-height:1.6">${warnings.map(w=>`<div>● ${esc(w)}</div>`).join("")}</div><div style="font-size:7px;color:#5a7a9a;text-align:right;margin-top:3px;font-style:italic">Case data consistency verified prior to manufacturing.</div></div>
<div class="declaration"><h3>Manufacturer's Declaration — EU MDR 2017/745 Annex XIII §1</h3><p>The undersigned declares that the custom-made device described herein:</p><p><strong>1.</strong> Is specifically made following a written prescription by a duly qualified medical practitioner, per Article 2(3) of EU MDR 2017/745;</p><p><strong>2.</strong> Is intended for the sole use of patient: <strong>${esc(patient.identifier)}</strong>;</p><p><strong>3.</strong> Conforms to the General Safety and Performance Requirements (GSPR) set out in Annex I;</p><p><strong>4.</strong> Has been manufactured in accordance with a documented Quality Management System (Article 10(9));</p><p><strong>5.</strong> Uses CE-marked materials and components per their intended purpose and manufacturer's IFU;</p><p><strong>6.</strong> Does not bear a CE marking (per Article 20(1) for custom-made devices);</p><p><strong>7.</strong> Is labelled as &ldquo;custom-made device&rdquo; / &ldquo;Sonderanfertigung&rdquo;;</p><p><strong>8.</strong> Is exempt from UDI requirements per Article 27(1) as a custom-made device.</p>${sign.gsprExceptions?`<p style="margin-top:4px"><strong>GSPR Exceptions:</strong> ${esc(sign.gsprExceptions)}</p>`:""}</div>
<div class="sig-grid"><div class="section-box"><div class="section-title">Substances / Tissues (Annex XIII §1(c))</div><div style="font-size:7.5px;line-height:1.7"><div>☐ Medicinal substance &nbsp;&nbsp;&nbsp; ☐ Human blood / plasma</div><div>☐ Human tissue / cells &nbsp;&nbsp;&nbsp; ☐ Animal tissue / cells</div><div>☑ None of the above</div></div></div><div class="section-box"><div class="section-title">Authorised Signatory</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 8px"><div><div class="sig-label">NAME (PRINT)</div><div class="sig-val">${esc(sign.signerName)}${sign.credentials?`<br/><span style="font-size:7px;font-weight:400;color:#5a7a9a">${esc(sign.credentials)}</span>`:""}</div></div><div><div class="sig-label">TITLE / FUNCTION</div><div class="sig-val">${esc(sign.signerTitle)}</div></div><div><div class="sig-label">DATE</div><div class="sig-val">${fmtDate(sign.date)}</div></div><div><div class="sig-label">SIGNATURE</div><div style="border-bottom:1.5px dashed #666;min-height:20px;margin-top:2px"></div></div></div></div></div>
<div class="footer-info">📋 <strong>Retention:</strong> ${retention} after placing on market (Annex XIII §4). Report incidents to <strong>BfArM:</strong> medizinprodukte@bfarm.de &middot; ℹ Exempt from UDI (Art. 27(1)) &amp; CE marking (Art. 20(1)) as custom-made device.</div>
<div class="footer-line"><span>${esc(mfr.name)} &middot; ${esc(mfr.city)}, ${esc(mfr.country)}</span><span>${docRef} &middot; EU MDR 2017/745 &middot; Form v1.0</span></div>
<div class="footer-note">Controlled document — changes require version update &middot; Terminology: &ldquo;Custom-made device&rdquo; as defined in Article 2(3), Regulation (EU) 2017/745.</div></body></html>`;
  };

  const generateDeliveryNote = () => {
    const matRows = materials.rows.filter(r=>r.material);
    const showPractice = prescriber.practice && prescriber.practice.trim().toLowerCase()!==prescriber.name.trim().toLowerCase();
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Delivery Note — ${docRef}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;font-size:10px;color:#2a3e52;line-height:1.4}@page{size:A4;margin:8mm 12mm}@media print{body{font-size:9px;color:#000!important}.no-print{display:none!important}}.header{background:#1a3a5c;color:#fff;padding:10px 18px;margin-bottom:6px;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:flex;justify-content:space-between;align-items:center}.header h1{font-size:14px;font-weight:700}.header p{font-size:8px;opacity:0.85;margin-top:2px}.ref-bar{padding:5px 10px;border:1px solid #d0dbe8;border-radius:5px;margin-bottom:6px;font-size:8.5px;display:flex;justify-content:space-between}.cards{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px}.card{border:1px solid #d0dbe8;border-radius:6px;padding:8px 12px}.card-title{font-size:8px;font-weight:700;text-transform:uppercase;color:#4a6fa5;margin-bottom:5px}.card-row{font-size:9px;line-height:1.5;margin-bottom:1px}.mat-table{width:100%;border-collapse:collapse;margin:6px 0}.mat-table th{text-align:left;padding:4px 8px;font-size:8px;font-weight:700;color:#4a6fa5;border-bottom:2px solid #c8ddf0}.mat-table td{padding:4px 8px;font-size:9px;border-bottom:1px solid #e8eef5}.qc-box{border:2px solid #1a7a3a;border-radius:8px;padding:10px 14px;margin:8px 0;background:#f0faf4}.qc-box h3{font-size:11px;color:#1a5a2c;margin-bottom:6px}.qc-row{display:flex;gap:20px;margin-top:6px}.qc-field label{font-size:7px;color:#6a8fa5;display:block}.qc-field .val{font-size:9px;font-weight:600;border-bottom:1px solid #999;padding-bottom:2px;min-height:16px;min-width:120px}.handling{border:2px solid #e8a000;border-radius:8px;padding:10px 14px;margin:8px 0;background:#fffbf0}.handling h3{font-size:10px;color:#8a6000;margin-bottom:6px}.footer{border-top:1.5px solid #d0dae4;margin-top:8px;padding-top:4px;font-size:7px;color:#6a7a8a;display:flex;justify-content:space-between}</style></head><body>
<div class="header"><div><h1>Delivery Note</h1><p>Custom-Made Dental Device</p></div><div style="text-align:right;font-size:10px;font-weight:600">${esc(mfr.name)}<br><span style="font-size:7.5px;opacity:0.7">Delivery Note</span></div></div>
<div class="ref-bar"><div>MDR Ref: <strong>${docRef}</strong>${device.labRef?` · Lab: <strong>${esc(device.labRef)}</strong>`:""}${prescriber.orderRef?` · Rx: <strong>${esc(prescriber.orderRef)}</strong>`:""}</div><div>Delivery Date: <strong>${fmtDate(sign.date)}</strong></div></div>
<div class="cards"><div class="card"><div class="card-title">From — Manufacturer</div><div class="card-row"><strong>${esc(mfr.name)}</strong></div><div class="card-row">${esc(mfr.street)}, ${esc(mfr.postal)} ${esc(mfr.city)}</div>${mfr.phone?`<div class="card-row">☎ ${esc(mfr.phone)}</div>`:""}</div>
<div class="card"><div class="card-title">To — Clinic / Prescriber</div><div class="card-row"><strong>${esc(prescriber.name)}</strong></div>${showPractice?`<div class="card-row">${esc(prescriber.practice)}</div>`:""} ${prescriber.address?`<div class="card-row">${esc(prescriber.address)}</div>`:""} ${prescriber.phone?`<div class="card-row">☎ ${esc(prescriber.phone)}</div>`:""}</div></div>
<div class="card" style="margin-bottom:6px"><div class="card-title">Device Details</div><table style="font-size:9px;line-height:1.6"><tr><td style="color:#4a6fa5;width:120px">Patient</td><td><strong>${esc(patient.identifier)}</strong></td></tr><tr><td style="color:#4a6fa5">Device</td><td><strong>${esc(deviceLabel)}</strong></td></tr><tr><td style="color:#4a6fa5">Teeth / Region</td><td>${esc(device.teeth.filter(t=>t.length===2).sort().join(", ")||"—")}</td></tr>${device.implantSystem?`<tr><td style="color:#4a6fa5">Implant System</td><td>${esc(device.implantSystem==="Other (specify in notes)"?device.implantDetails:device.implantSystem)}</td></tr>`:""} ${device.sleeveType?`<tr><td style="color:#4a6fa5">Guided Sleeve</td><td>${esc(device.sleeveType)}</td></tr>`:""} ${device.fixationSleeve?`<tr><td style="color:#4a6fa5">Fixation Sleeve</td><td>${esc(device.fixationSleeve)}</td></tr>`:""} ${device.fixationPinSystem?`<tr><td style="color:#4a6fa5">Fixation Pin System</td><td>${esc(device.fixationPinSystem)}</td></tr>`:""} ${device.software?`<tr><td style="color:#4a6fa5">Design Software</td><td>${esc(device.software)}</td></tr>`:""} ${device.shade?`<tr><td style="color:#4a6fa5">Shade</td><td>${esc(device.shade)}</td></tr>`:""}</table></div>
<table class="mat-table"><thead><tr><th>Material</th><th>Manufacturer</th><th>Lot/Batch</th><th>CE</th></tr></thead><tbody>${matRows.map(r=>`<tr><td>${esc(r.material)}</td><td>${esc(r.manufacturer)}</td><td>${esc(r.batch||"Per mfr records")}</td><td>${r.ceMarked?"✓":"✗"}</td></tr>`).join("")}</tbody></table>
<div class="handling"><h3>⚠ Important — Handling & Storage Instructions</h3><div style="font-size:9px;line-height:1.6"><div>🚫 <strong>Single use only.</strong> Do not reuse, resterilise, or modify.</div><div>✅ <strong>Before use:</strong> Disinfect or sterilise per the resin manufacturer's IFU and clinic protocol.</div><div>📦 <strong>Storage:</strong> Keep in protective packaging, avoid direct sunlight and heat.</div><div>⏱ <strong>Shelf life:</strong> Use within 6 months of manufacturing date.</div></div></div>
<div class="qc-box"><h3>✅ Quality Control — Release for Clinical Use</h3><div style="font-size:9px">This device has been manufactured in accordance with the prescription, inspected for dimensional accuracy and surface quality, and is released for clinical use.</div><div class="qc-row"><div class="qc-field"><label>Inspected by</label><div class="val">${esc(sign.signerName)}${sign.credentials?`, ${esc(sign.credentials)}`:""}</div></div><div class="qc-field"><label>Date</label><div class="val">${fmtDate(sign.date)}</div></div><div class="qc-field"><label>Signature</label><div class="val" style="border-bottom-style:dashed;min-height:22px"></div></div></div></div>
<div class="footer"><span>${esc(mfr.name)} · ${esc(mfr.city)}, ${esc(mfr.country)}</span><span>${docRef} · Generated ${new Date().toLocaleDateString()}</span></div></body></html>`;
  };

  const download = (html, suffix) => {
    const win = window.open("","_blank");
    if(!win) { alert("Please allow popups to download PDF."); return; }
    win.document.write(html);
    win.document.close();
    // Add print button + auto-trigger
    const btn = win.document.createElement("div");
    btn.className = "no-print";
    btn.innerHTML = `<div style="position:fixed;top:0;left:0;right:0;background:#1a3a5c;color:#fff;padding:10px 20px;display:flex;justify-content:space-between;align-items:center;z-index:99999;font-family:system-ui">
      <span style="font-size:13px;font-weight:700">📄 ${docRef}${suffix} — Use "Save as PDF" in the print dialog</span>
      <button onclick="window.print()" style="background:#fff;color:#1a3a5c;border:none;padding:8px 24px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px">🖨 Print / Save PDF</button>
    </div><div style="height:50px"></div>`;
    win.document.body.insertBefore(btn, win.document.body.firstChild);
    setTimeout(() => win.print(), 500);
  };
  const handleDownloadMDR = async () => { setDownloading(true); download(generateMDR(),""); await onSaveCase(docRef,{mfr,prescriber,patient,device,materials,sign}); setDownloading(false); };
  const handleDownloadDelivery = () => { download(generateDeliveryNote(),"_DeliveryNote"); };
  const handleSaveClinic = async () => { if(!prescriber.name)return; setClinicSaved("saving"); const result=await onSaveClinic({name:prescriber.name,big:prescriber.big,practice:prescriber.practice,address:prescriber.address,phone:prescriber.phone,email:prescriber.email}); if(result?.error){setClinicSaved("error");console.error("Clinic save failed:",result.error);}else{setClinicSaved("done");} setTimeout(()=>setClinicSaved(""),3000); };

  
  const up=(setter,key)=>(e)=>setter(p=>({...p,[key]:e.target.value}));

  return (
    <div>
      <div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold text-gray-900">New MDR Form</h1><p className="text-gray-500 text-sm mt-1">EU MDR Annex XIII — {docRef}</p></div></div>
      <div className="flex gap-1 mb-6">{STEPS.map((s,i)=><button key={s.key} onClick={()=>i<=step?setStep(i):null} className={`flex-1 py-2.5 text-center text-xs font-medium transition ${i===0?"rounded-l-lg":""} ${i===STEPS.length-1?"rounded-r-lg":""} ${i===step?"bg-blue-600 text-white font-bold":i<step?"bg-blue-400 text-white cursor-pointer":"bg-gray-200 text-gray-500"}`}><span className="block text-base">{s.icon}</span>{s.label}</button>)}</div>
      <div className="bg-white rounded-xl border border-gray-200 p-7 min-h-[400px]">

        {step===0&&<div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Prescriber / Clinic</h2><p className="text-sm text-gray-500 mb-5">Select a saved clinic or enter new prescriber details.</p>
          {clinics.length>0&&<div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 mb-2">Saved Clinics</label>
            <div className="grid grid-cols-2 gap-2">
              {clinics.map(c=><button key={c.id} onClick={()=>selectClinic(c.id)} className={`text-left p-3 rounded-lg border transition ${prescriber.name===c.name?"border-blue-500 bg-blue-50":"border-gray-200 hover:bg-gray-50"}`}>
                <div className="text-sm font-semibold text-gray-800">{c.name}</div>
                {c.practice&&c.practice!==c.name&&<div className="text-xs text-gray-500">{c.practice}</div>}
                {c.big&&<div className="text-[10px] text-gray-400 mt-0.5">BIG: {c.big}</div>}
              </button>)}
            </div>
          </div>}
          <div className="grid grid-cols-2 gap-4"><FormInput label="Dentist / Prescriber Name *" value={prescriber.name} onChange={up(setPrescriber,"name")}/><FormInput label="BIG Register Number" value={prescriber.big} onChange={up(setPrescriber,"big")}/><FormInput label="Practice / Clinic" value={prescriber.practice} onChange={up(setPrescriber,"practice")}/><FormInput label="Phone" value={prescriber.phone} onChange={up(setPrescriber,"phone")}/><FormInput label="Address" value={prescriber.address} onChange={up(setPrescriber,"address")} span={2}/><FormInput label="Rx Order Reference" value={prescriber.orderRef} onChange={up(setPrescriber,"orderRef")}/><FormInput label="Prescription Date" type="date" value={prescriber.prescDate} onChange={up(setPrescriber,"prescDate")}/></div>
          {prescriber.name&&!clinics.some(c=>c.name===prescriber.name)&&<button onClick={handleSaveClinic} disabled={clinicSaved==="saving"} className={`mt-4 px-4 py-2 rounded-lg border text-sm font-medium transition ${clinicSaved==="done"?"border-green-300 bg-green-50 text-green-700":clinicSaved==="error"?"border-red-300 bg-red-50 text-red-700":"border-blue-200 text-blue-600 hover:bg-blue-50"}`}>{clinicSaved==="saving"?"⏳ Saving...":clinicSaved==="done"?"✅ Clinic saved!":clinicSaved==="error"?"❌ Error — check console":"💾 Save this clinic for future use"}</button>}
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
          {(device.types.includes("surgical_guide_3d"))&&<div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-200">
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
              <label className="block text-xs font-semibold text-blue-700 mb-2">Fixation Pin System</label>
              <select value={device.fixationPinSystem} onChange={e=>setDevice(p=>({...p,fixationPinSystem:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">— None / Not applicable —</option>
                {FIXATION_PIN_SYSTEMS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>}
          </div>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-500 mb-1">Design Software</label>
              <select value={device.software} onChange={e=>setDevice(p=>({...p,software:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">— Select design software —</option>
                {DESIGN_SOFTWARE.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <FormInput label="Design Date" type="date" value={device.designDate} onChange={up(setDevice,"designDate")}/><FormInput label="Lab Reference" value={device.labRef} onChange={up(setDevice,"labRef")}/><FormInput label="Shade" value={device.shade} onChange={up(setDevice,"shade")}/><FormInput label="Clinical Notes" value={device.notes} onChange={up(setDevice,"notes")} span={2}/></div>
        </div>}

        {step===3&&<div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Materials & Processing</h2><p className="text-sm text-gray-500 mb-5">Specify all materials, equipment, and protocols.</p>

          {/* Ecosystem quick-switch */}
          {device.types.some(t=>DEVICE_MATERIAL_PRESETS[t]&&DEVICE_MATERIAL_PRESETS[t].length>1)&&<div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 mb-5">
            <label className="block text-xs font-semibold text-indigo-700 mb-2">🔄 Quick Switch — Printer Ecosystem</label>
            <p className="text-xs text-indigo-500 mb-2">Choose your printer ecosystem to auto-fill matching materials, equipment & protocol.</p>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const allPresets = [];
                device.types.forEach(t => { (DEVICE_MATERIAL_PRESETS[t]||[]).forEach(p => { if(!allPresets.find(x=>x.ecosystem===p.ecosystem)) allPresets.push(p); }); });
                return allPresets.map(p=><button key={p.label} onClick={()=>applyPreset(p)} className={`px-4 py-2 rounded-lg text-xs font-bold transition border ${materials.printer.includes(p.ecosystem==="sprintray"?"SprintRay":"Formlabs")?"bg-indigo-600 text-white border-indigo-600":"bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-100"}`}>{p.label}</button>);
              })()}
            </div>
          </div>}

          {materials.rows.map((r,i)=><div key={i} className="grid grid-cols-4 gap-3 mb-3">
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-500 mb-1">Material {i+1}</label>
              <select value={r.material} onChange={e=>upMat(i,"material",e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"><option value="">Select...</option>{MAT_OPTIONS.filter(m=>{const activeEco=materials.printer.includes("SprintRay")?"sprintray":materials.printer.includes("Formlabs")?"formlabs":"";return !activeEco||m.eco===activeEco||m.eco==="milling";}).map(m=><option key={m.name} value={m.name}>{m.name}</option>)}<option value="_custom">— Custom —</option></select>
              {r.material==="_custom"&&<input placeholder="Enter material" onChange={e=>upMat(i,"material",e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mt-1 outline-none focus:ring-2 focus:ring-blue-500"/>}</div>
            <FormInput label="Manufacturer" value={r.manufacturer} onChange={e=>upMat(i,"manufacturer",e.target.value)}/><FormInput label="Lot/Batch" value={r.batch} onChange={e=>upMat(i,"batch",e.target.value)}/></div>)}
          <button onClick={addMatRow} className="text-sm text-blue-600 font-medium hover:underline mb-5">+ Add material row</button>

          {/* MANUFACTURING PROCESSES */}
          <div className="border-t border-gray-100 pt-4 mb-4">
            <label className="block text-xs font-semibold text-gray-500 mb-2">Manufacturing Processes</label>
            <div className="flex flex-wrap gap-2">{MFG_PROCESSES.map(proc=>
              <button key={proc} onClick={()=>setMaterials(p=>({...p,processes:p.processes.includes(proc)?p.processes.filter(x=>x!==proc):[...p.processes,proc]}))} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${materials.processes.includes(proc)?"bg-green-100 border-green-400 text-green-800 border":"border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>{materials.processes.includes(proc)?"✓ ":""}{proc}</button>
            )}</div>
          </div>

          {/* EQUIPMENT */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-4">
            <label className="block text-xs font-semibold text-blue-700 mb-3">Equipment</label>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Printer</label>
                <input value={materials.printer} onChange={e=>setMaterials(p=>({...p,printer:e.target.value}))} placeholder="Auto-filled by ecosystem" className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Wash Machine</label>
                <input value={materials.wash} onChange={e=>setMaterials(p=>({...p,wash:e.target.value}))} placeholder="e.g. SprintRay ProWash S" className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Cure Machine</label>
                <input value={materials.cure} onChange={e=>setMaterials(p=>({...p,cure:e.target.value}))} placeholder="e.g. SprintRay ProCure 2" className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"/></div>
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Slicing Software</label>
                <input value={materials.slicingSoftware} onChange={e=>setMaterials(p=>({...p,slicingSoftware:e.target.value}))} placeholder="e.g. RayWare" className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"/></div>
            </div>
          </div>

          {/* POST-PROCESSING PROTOCOL */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <label className="block text-xs font-semibold text-amber-700 mb-2">Post-Processing Protocol</label>
            <textarea value={materials.postProcessProtocol} onChange={e=>setMaterials(p=>({...p,postProcessProtocol:e.target.value}))} rows={6} placeholder="Step-by-step post-processing protocol..." className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 resize-y font-mono"/>
          </div>
        </div>}

        {step===4&&<div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Review & Sign</h2><p className="text-sm text-gray-500 mb-5">Verify details, then download.</p>
          <div className="grid grid-cols-2 gap-4 mb-6">{[["Prescriber",`${prescriber.name} · BIG: ${prescriber.big}`],["Patient",patient.identifier],["Device",deviceLabel],["Teeth",device.teeth.filter(t=>t.length===2).sort().join(", ")||"—"],["Materials",materials.rows.filter(r=>r.material).map(r=>r.material).join("; ")||"—"],["Class",highestClass],...(device.implantSystem?[["Implant System",device.implantSystem==="Other (specify in notes)"?device.implantDetails:device.implantSystem]]:[]),(device.sleeveType?[["Sleeve",device.sleeveType]]:[]),(device.fixationSleeve?[["Fixation Sleeve",device.fixationSleeve]]:[]),(device.fixationPinSystem?[["Fixation Pin System",device.fixationPinSystem]]:[])].map(([l,v])=><div key={l} className="p-3 bg-gray-50 rounded-lg"><div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{l}</div><div className="text-sm text-gray-800 font-medium truncate">{v}</div></div>)}</div>
          <div className="border-t border-gray-100 pt-5"><h3 className="text-sm font-semibold text-gray-700 mb-3">Signature</h3>
            <div className="grid grid-cols-3 gap-4"><FormInput label="Name *" value={sign.signerName} onChange={up(setSign,"signerName")}/><FormInput label="Title" value={sign.signerTitle} onChange={up(setSign,"signerTitle")}/><FormInput label="Date" type="date" value={sign.date} onChange={up(setSign,"date")}/></div>
            <div className="mt-3"><FormInput label="Credentials" value={sign.credentials} onChange={up(setSign,"credentials")} placeholder="e.g. DDS · MSc Periodontics"/><p className="text-xs text-gray-400 mt-1">Appears after name on documents.</p></div></div>
          <div className="flex gap-3 mt-8">
            <button onClick={handleDownloadMDR} disabled={downloading||!sign.signerName} className="px-6 py-3 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 disabled:opacity-40 transition shadow-sm">{downloading?"⏳ Generating...":"📄 Download MDR PDF"}</button>
            <button onClick={handleDownloadDelivery} disabled={!sign.signerName} className="px-6 py-3 rounded-lg bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 disabled:opacity-40 transition shadow-sm">📦 Download Delivery PDF</button></div>
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
