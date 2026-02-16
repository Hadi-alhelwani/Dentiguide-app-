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
    "Verify marginal fit, proximal contacts, and occlusion before definitive cementation.",
    "Not indicated for patients with severe bruxism unless a protective nightguard is provided.",
    "3D-printed resin crowns are intended as long-term provisional or semi-permanent restorations; clinical longevity depends on occlusal load, oral hygiene, and periodic review.",
    "The manufacturer does not perform clinical assessment, surgical decision-making, or intra-oral adjustments.",
    "Periodic clinical and radiographic follow-up is recommended per the prescriber\u2019s protocol.",
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
      postProcess: "1) IPA 99% wash in SprintRay ProWash S — 5 min\n2) Air dry completely\n3) UV post-cure in SprintRay ProCure 2 — 30 min at 60°C\n4) Support removal & finishing\n5) Insert metal drill sleeves (verify sleeve seating & axis alignment)\n6) Verify guide seating on model\n7) Optional: sterilisation per resin manufacturer's IFU and clinic protocol"
    },
    {
      label: "Formlabs",
      material: "Formlabs Surgical Guide Resin — Biocompatible, Autoclavable",
      manufacturer: "Formlabs Inc., Somerville, MA, USA",
      ecosystem: "formlabs",
      processes: ["3D Printing (MSLA — Formlabs Form 4B)", "IPA Wash", "UV Post-Curing (Form Cure V2)", "Support Removal / Finishing"],
      postProcess: "1) IPA 99% wash in Formlabs Form Wash — 5 min\n2) Remove from build platform\n3) Air dry completely — at least 30 min\n4) UV post-cure in Formlabs Form Cure V2 — 30 min at 60°C\n5) Support removal & finishing\n6) Insert metal drill sleeves (verify sleeve seating & axis alignment)\n7) Verify guide seating on model\n8) Optional: autoclave sterilisation per Formlabs IFU (prevacuum, 134°C/3 min or 121°C/15 min)"
    },
  ],
  crown_3d: [
    {
      label: "SprintRay",
      material: "SprintRay OnX Tough 2 — NanoFusion™ Hybrid (MDR/FDA, Fixed Hybrids)",
      manufacturer: "SprintRay Inc., Los Angeles, CA, USA",
      ecosystem: "sprintray",
      processes: ["3D Printing (DLP — SprintRay Pro 55S)", "IPA Wash", "UV Post-Curing (ProCure 2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA wash in SprintRay ProWash S — OnX Tough profile\n2) Air dry completely\n3) Post-cure in SprintRay ProCure 2 — 5 min (385nm, auto-heat)\n4) Support removal with carbide bur / fibre disc\n5) Check marginal fit on die/model\n6) Adjust proximal contacts and occlusion as needed\n7) Polish & finish for aesthetics\n8) Optional: characterise with VITA Akzent LC (tack cure between layers, final cure 5 min in ProCure 2)"
    },
    {
      label: "Formlabs",
      material: "Formlabs Premium Teeth Resin — Nano-Ceramic (Temp C&B / All-on-X / Denture Teeth)",
      manufacturer: "Formlabs Inc., Somerville, MA, USA",
      ecosystem: "formlabs",
      processes: ["3D Printing (MSLA — Formlabs Form 4B)", "IPA Wash", "UV Post-Curing (Form Cure V2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA 99% wash in Formlabs Form Wash — per Premium Teeth IFU\n2) Air dry completely\n3) UV post-cure in Formlabs Form Cure V2 — per Premium Teeth IFU settings\n4) Support removal with carbide bur / fibre disc\n5) Check marginal fit on die/model\n6) Adjust proximal contacts and occlusion as needed\n7) Polish & finish for aesthetics\n8) Note: Use dedicated resin tank & build platform for biocompatible resins"
    },
  ],
  bridge_3d: [
    {
      label: "SprintRay",
      material: "SprintRay OnX Tough 2 — NanoFusion™ Hybrid (MDR/FDA, Fixed Hybrids)",
      manufacturer: "SprintRay Inc., Los Angeles, CA, USA",
      ecosystem: "sprintray",
      processes: ["3D Printing (DLP — SprintRay Pro 55S)", "IPA Wash", "UV Post-Curing (ProCure 2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA wash in SprintRay ProWash S — OnX Tough profile\n2) Air dry completely\n3) Post-cure in SprintRay ProCure 2 — 5 min (385nm, auto-heat)\n4) Support removal with carbide bur / fibre disc\n5) Verify pontic clearance and connector dimensions\n6) Check marginal fit on abutments/model\n7) Polish & finish for aesthetics\n8) Optional: characterise with VITA Akzent LC"
    },
    {
      label: "Formlabs",
      material: "Formlabs Premium Teeth Resin — Nano-Ceramic (Temp C&B / All-on-X / Denture Teeth)",
      manufacturer: "Formlabs Inc., Somerville, MA, USA",
      ecosystem: "formlabs",
      processes: ["3D Printing (MSLA — Formlabs Form 4B)", "IPA Wash", "UV Post-Curing (Form Cure V2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA 99% wash in Formlabs Form Wash — per Premium Teeth IFU\n2) Air dry completely\n3) UV post-cure in Formlabs Form Cure V2 — per Premium Teeth IFU settings\n4) Support removal with carbide bur / fibre disc\n5) Verify pontic clearance and connector dimensions\n6) Check marginal fit on abutments/model\n7) Polish & finish for aesthetics\n8) Note: Use dedicated resin tank & build platform for biocompatible resins"
    },
  ],
  crown_zirconia: [
    {
      label: "Milled Zirconia",
      material: "Zirconia Disc (e.g. Ivoclar IPS e.max ZirCAD / Kuraray Noritake)",
      manufacturer: "",
      ecosystem: "milling",
      processes: ["CAD/CAM Milling (Wet)", "Sintering", "Glazing / Staining"],
      postProcess: "1) CAD/CAM milling (wet, 5-axis)\n2) Sintering — per manufacturer's IFU (typically 1450–1550°C, 6–8h cycle)\n3) Check marginal fit on die/model\n4) Staining / characterisation\n5) Glaze firing\n6) Final inspection — marginal integrity, proximal contacts, shade match"
    },
  ],
  bridge_zirconia: [
    {
      label: "Milled Zirconia",
      material: "Zirconia Disc (e.g. Ivoclar IPS e.max ZirCAD / Kuraray Noritake)",
      manufacturer: "",
      ecosystem: "milling",
      processes: ["CAD/CAM Milling (Wet)", "Sintering", "Glazing / Staining"],
      postProcess: "1) CAD/CAM milling (wet, 5-axis)\n2) Sintering — per manufacturer's IFU\n3) Verify pontic clearance and connector dimensions (min. 9mm² cross-section recommended)\n4) Check marginal fit on abutments/model\n5) Staining / characterisation\n6) Glaze firing\n7) Final inspection — connector integrity, marginal seal, shade match"
    },
  ],
  crown_pmma: [
    {
      label: "Milled PMMA",
      material: "PMMA Disc (e.g. Ivoclar Ivotion / VITA VIONIC)",
      manufacturer: "",
      ecosystem: "milling",
      processes: ["CAD/CAM Milling (Dry)", "Polishing / Finishing"],
      postProcess: "1) CAD/CAM milling (dry)\n2) Remove from disc & finish milling tags\n3) Check marginal fit on die/model\n4) Adjust proximal contacts and occlusion as needed\n5) Polish for aesthetics\n6) Final inspection & fit check"
    },
  ],
  bridge_pmma: [
    {
      label: "Milled PMMA",
      material: "PMMA Disc (e.g. Ivoclar Ivotion / VITA VIONIC)",
      manufacturer: "",
      ecosystem: "milling",
      processes: ["CAD/CAM Milling (Dry)", "Polishing / Finishing"],
      postProcess: "1) CAD/CAM milling (dry)\n2) Remove from disc & finish milling tags\n3) Verify pontic clearance and connector dimensions\n4) Check marginal fit on abutments/model\n5) Polish for aesthetics\n6) Final inspection & fit check"
    },
  ],
  titanium_bar: [
    {
      label: "Milled Titanium Bar",
      material: "Grade 5 Titanium (Ti-6Al-4V) Disc",
      manufacturer: "",
      ecosystem: "milling",
      processes: ["CAD/CAM Milling (Wet)", "Polishing / Finishing", "Sandblasting"],
      postProcess: "1) CAD/CAM milling (wet, 5-axis)\n2) Remove from disc & finish milling tags\n3) Sandblast tissue-facing surfaces (Al₂O₃, 50–110µm)\n4) Verify passive fit on model (Sheffield/screw-resistance test)\n5) Check screw access channel alignment\n6) Polish prosthetic-facing surfaces\n7) Final inspection — screw seat, passive fit, surface finish"
    },
  ],
  ti_denture: [
    {
      label: "SprintRay + Ti Bar",
      material: "SprintRay OnX Tough 2 — NanoFusion™ Hybrid (MDR/FDA, Fixed Hybrids)",
      manufacturer: "SprintRay Inc., Los Angeles, CA, USA",
      ecosystem: "sprintray",
      processes: ["3D Printing (DLP — SprintRay Pro 55S)", "IPA Wash", "UV Post-Curing (ProCure 2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA wash in SprintRay ProWash S — OnX Tough profile\n2) Flush screw access channels with IPA syringe to remove residual resin\n3) Post-cure in SprintRay ProCure 2 — 5 min (385nm, auto-heat)\n4) Post-cure IPA spray + dry towel wipe (30 sec)\n5) Support removal with carbide bur / fibre disc\n6) Verify fit of resin structure on titanium bar\n7) Bond resin structure to milled titanium bar per bonding protocol\n8) Verify screw access channel patency\n9) Polish for aesthetics\n10) Optional: characterise with VITA Akzent LC"
    },
    {
      label: "Formlabs + Ti Bar",
      material: "Formlabs Premium Teeth Resin — Nano-Ceramic (Temp C&B / All-on-X / Denture Teeth)",
      manufacturer: "Formlabs Inc., Somerville, MA, USA",
      ecosystem: "formlabs",
      processes: ["3D Printing (MSLA — Formlabs Form 4B)", "IPA Wash", "UV Post-Curing (Form Cure V2)", "Support Removal / Finishing", "Polishing / Finishing"],
      postProcess: "1) IPA 99% wash in Formlabs Form Wash — per Premium Teeth IFU\n2) Flush screw access channels with IPA syringe to remove residual resin\n3) Air dry completely\n4) UV post-cure in Formlabs Form Cure V2 — per IFU settings\n5) Support removal\n6) Verify fit of resin structure on titanium bar\n7) Bond resin structure to milled titanium bar per bonding protocol\n8) Verify screw access channel patency\n9) Polish for aesthetics\n10) Note: Use dedicated resin tank & build platform for biocompatible resins"
    },
  ],
};

// ── PRICE LIST (synced with Exact Online) ──
const PRICE_LIST = [
  // Surgical Guides — tier by element count
  { code:"1001", name:"Surgical Guide (1 element)", price:150, unit:"stuks", cat:"guide", tier:1 },
  { code:"1002", name:"Surgical Guide (2 elements)", price:250, unit:"stuks", cat:"guide", tier:2 },
  { code:"1003", name:"Surgical Guide (3 elements)", price:350, unit:"stuks", cat:"guide", tier:3 },
  { code:"1004", name:"Surgical Guide (4+ elements)", price:450, unit:"stuks", cat:"guide", tier:4 },
  { code:"1005", name:"Surgical Guide for Edentulous Cases", price:600, unit:"stuks", cat:"guide", tier:99 },
  { code:"1006", name:"Bone Reduction Guide", price:7000, unit:"stuks", cat:"guide" },
  // Crowns & Bridges
  { code:"1008", name:"3D Printed Crown", price:250, unit:"stuks", cat:"crown" },
  { code:"1009", name:"Bridge Dummy (pontic)", price:180, unit:"stuks", cat:"bridge" },
  { code:"R34", name:"Crown on Implant (Zirconia)", price:698.26, unit:"stuks", cat:"crown_implant" },
  { code:"zirc", name:"Full Zirconia Construction (4+ implants)", price:8090, unit:"stuks", cat:"zirconia_full" },
  // Full-arch & Ti
  { code:"1016", name:"Full Arch 3D Printed Bridge on Implants", price:1750, unit:"stuks", cat:"bridge_full" },
  { code:"bar", name:"Titanium Bar with Locator Retention", price:2000, unit:"stuks", cat:"ti_bar" },
  { code:"X1", name:"All-on-X Restoration", price:3500, unit:"stuks", cat:"all_on_x" },
  { code:"overdenture", name:"Titanium-Reinforced Overdenture", price:900, unit:"stuks", cat:"overdenture" },
  { code:"steg", name:"Titanium Steg (4+ implants)", price:885, unit:"stuks", cat:"ti_steg" },
  // Dentures & Splints
  { code:"1010", name:"Splint", price:175, unit:"stuks", cat:"splint" },
  { code:"1011", name:"Full Removable Denture", price:700, unit:"stuks", cat:"denture" },
  { code:"1013", name:"Pasprothese (Try-in Denture)", price:250, unit:"stuks", cat:"try_in" },
  { code:"Nood", name:"Emergency Provisional (Noodvoorziening)", price:1200, unit:"stuks", cat:"provisional" },
  // Digital & Add-ons
  { code:"1007", name:"Digital Wax-Up (per element)", price:25, unit:"stuks", cat:"addon" },
  { code:"1018", name:"Diagnostic Model", price:50, unit:"stuks", cat:"addon" },
  { code:"1012", name:"Individual Impression Tray", price:150, unit:"stuks", cat:"addon" },
  { code:"1015", name:"Individual Healing Abutment", price:150, unit:"stuks", cat:"addon" },
  { code:"Smile", name:"Smile Design", price:350, unit:"stuks", cat:"addon" },
  { code:"1", name:"3D Printed Anterior Tooth", price:75, unit:"stuks", cat:"addon" },
  // Components
  { code:"Ti", name:"Ti Base", price:35, unit:"stuks", cat:"component" },
  { code:"DESS", name:"Prosthetic Screw", price:60, unit:"stuks", cat:"component" },
  { code:"MUA", name:"Multi-Unit Abutment", price:100, unit:"stuks", cat:"component" },
  { code:"IMP", name:"Implant", price:404.40, unit:"stuks", cat:"component" },
  { code:"SRA", name:"Straumann BLX MUA", price:158.13, unit:"stuks", cat:"component" },
  // Services
  { code:"PIC", name:"Photogrammetry Implant Scanning", price:1000, unit:"day", cat:"service" },
  { code:"chrome", name:"Full Magnetic Stackable Guide Set", price:3500, unit:"stuks", cat:"service" },
  { code:"material", name:"Materials (pass-through)", price:0, unit:"stuks", cat:"material" },
  { code:"reis", name:"Travel Expenses", price:0.37, unit:"km", cat:"service" },
  // Services — hourly/daily
  { code:"1_hr", name:"Services Rendered (per hour)", price:100, unit:"hour", cat:"service" },
  { code:"2_day", name:"Services Rendered (per day)", price:1250, unit:"day", cat:"service" },
];

// Map MDR device types → best-fit price list item(s)
const DEVICE_PRICE_MAP = {
  surgical_guide_3d: (teethCount) => {
    if(teethCount >= 14) return PRICE_LIST.find(p=>p.code==="1005"); // edentulous
    if(teethCount >= 4) return PRICE_LIST.find(p=>p.code==="1004");
    if(teethCount === 3) return PRICE_LIST.find(p=>p.code==="1003");
    if(teethCount === 2) return PRICE_LIST.find(p=>p.code==="1002");
    return PRICE_LIST.find(p=>p.code==="1001");
  },
  crown_3d: () => PRICE_LIST.find(p=>p.code==="1008"),
  bridge_3d: () => PRICE_LIST.find(p=>p.code==="1016"),
  crown_zirconia: () => PRICE_LIST.find(p=>p.code==="R34"),
  bridge_zirconia: () => PRICE_LIST.find(p=>p.code==="zirc"),
  crown_pmma: () => PRICE_LIST.find(p=>p.code==="1008"), // same price tier
  bridge_pmma: () => PRICE_LIST.find(p=>p.code==="1016"),
  titanium_bar: () => PRICE_LIST.find(p=>p.code==="bar"),
  ti_denture: () => PRICE_LIST.find(p=>p.code==="X1"),
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

// ── Clinic Code Generator ──
const generateClinicCode = (name, practice, address) => {
  // Try to extract city from address (last word before postal or country)
  const addr = (address||"").trim();
  let city = "";
  // Match Dutch postal: 1234 AB City
  const nlMatch = addr.match(/\d{4}\s?[A-Za-z]{2}\s+([A-Za-z\-]+)/);
  // Match German postal: 12345 City
  const deMatch = addr.match(/\d{5}\s+([A-Za-z\-]+)/);
  if(nlMatch) city = nlMatch[1];
  else if(deMatch) city = deMatch[1];
  else { const parts = addr.split(/[,\n]/); if(parts.length>1) city = parts[parts.length-1].trim().replace(/\d+/g,"").trim(); }
  
  // Identity: use practice name first, then prescriber name
  const identity = (practice && practice.trim()) ? practice : (name||"");
  // Clean and take first meaningful word (skip Dr., Prof., etc.)
  const skip = ["dr","dr.","prof","prof.","drs","drs.","tandarts","tandheelkunde","praxis","klinik","kliniek","centrum","center","centre","dental","dent","implantologie","kaakchirurgie","mondzorg"];
  const words = identity.replace(/[^a-zA-ZÀ-ÿ\s]/g,"").split(/\s+/).filter(w=>w.length>1 && !skip.includes(w.toLowerCase()));
  const idPart = (words[0]||identity.replace(/[^a-zA-Z]/g,"")).substring(0,4).toUpperCase();
  const cityPart = city.replace(/[^a-zA-Z]/g,"").substring(0,3).toUpperCase();
  
  return cityPart ? `${idPart}.${cityPart}` : idPart;
};

export default function MDRForm({ settings, clinics, onSaveCase, onSaveClinic }) {
  const [step, setStep] = useState(0);
  const mfr = { name:settings.company_name, street:settings.street, postal:settings.postal, city:settings.city, country:settings.country, phone:settings.phone, email:settings.email, prrcName:settings.prrc_name, prrcQual:settings.prrc_qual, site2Name:settings.site2_name, site2Address:settings.site2_address };
  const [prescriber, setPrescriber] = useState({ name:"",big:"",practice:"",address:"",phone:"",email:"",orderRef:"",prescDate:new Date().toISOString().split("T")[0], clinicCode:"" });
  const [patient, setPatient] = useState({ method:"code", identifier:"" });
  const [device, setDevice] = useState({ types:[],teeth:[],shade:"A2",software:"",labRef:"",notes:"",designDate:"",implantSystem:"",implantDetails:"",sleeveType:"",fixationSleeve:"",fixationPinSystem:"" });
  const [materials, setMaterials] = useState({ ecosystem:"", rows:[{material:"",manufacturer:"",batch:"",ceMarked:true}], printer:"",postProcess:"",processes:[],wash:"",cure:"",slicingSoftware:"",postProcessProtocol:"" });
  const [sign, setSign] = useState({ signerName:settings.signer_name||"", signerTitle:settings.signer_title||"Managing Director", credentials:settings.signer_credentials||"", date:new Date().toISOString().split("T")[0], gsprExceptions:"" });
  const [caseSeq] = useState(()=>{ const c=(settings.doc_counter||0)+1; return String(c).padStart(3,"0"); });
  const [invoiceRef] = useState(()=>{ const y=new Date().getFullYear(); const c=(settings.invoice_counter||settings.doc_counter||0)+1; return `INV-${y}-${String(c).padStart(4,"0")}`; });
  // Case ref derived from clinic code: DG-IMPL.AMS-2026-003
  const yr = new Date().getFullYear();
  const caseRef = prescriber.clinicCode ? `DG-${prescriber.clinicCode}-${yr}-${caseSeq}` : `DG-${yr}-${caseSeq}`;
  const mdrRef = `${caseRef}-MDR`;
  const delRef = `${caseRef}-DEL`;
  const [invoice, setInvoice] = useState({ items:[], vatRate:0, vatExempt:false, paymentTerms:"7 dagen netto", bankName:settings.bank_name||"ABN AMRO", iban:settings.iban||"NL12ABNA0846523612", bic:settings.bic||"ABNANL2A", kvk:settings.kvk||"", btw:settings.btw_id||"NL003533498B25", accountHolder:settings.account_holder||"Abdulhadi Alhelwani", notes:"" });
  const [downloading, setDownloading] = useState(false);
  const [clinicSaved, setClinicSaved] = useState("");

  const selectClinic = (id) => { const c=clinics.find(x=>x.id===id); if(c) { const code = c.clinic_code || generateClinicCode(c.name, c.practice, c.address); setPrescriber(p=>({...p,name:c.name,big:c.big,practice:c.practice,address:c.address,phone:c.phone,email:c.email,clinicCode:code})); } };

  // Find best preset for device types + ecosystem combo
  const findPresets = (types, eco) => {
    const presets = [];
    types.forEach(t => {
      const p = (DEVICE_MATERIAL_PRESETS[t]||[]).find(x=>x.ecosystem===eco);
      if(p) presets.push({...p, deviceType: t});
    });
    return presets;
  };

  // Merge IFU protocols from multiple device presets
  const mergeProtocols = (presets) => {
    if(presets.length===0) return "";
    if(presets.length===1) return presets[0].postProcess||"";
    // Multi-device: label each section
    return presets.map(p => {
      const dt = DEVICE_TYPES.find(d=>d.key===p.deviceType);
      return `── ${dt?.label||p.deviceType} ──\n${p.postProcess||""}`;
    }).join("\n\n");
  };

  // Master ecosystem switch — drives printer, wash, cure, software, materials, processes, protocol
  const switchEcosystem = (eco) => {
    if(!eco) return;
    const ecoData = ECOSYSTEMS[eco] || {};
    const presets = findPresets(device.types, eco);
    // Build material rows from presets (deduplicated)
    const matMap = new Map();
    presets.forEach(p => { if(!matMap.has(p.material)) matMap.set(p.material, {material:p.material, manufacturer:p.manufacturer, batch:"", ceMarked:true}); });
    const rows = matMap.size>0 ? [...matMap.values()] : [{material:"",manufacturer:"",batch:"",ceMarked:true}];
    // Merge processes
    const allProcesses = [...new Set(presets.flatMap(p=>p.processes||[]))];
    // Merge IFU protocols
    const protocol = mergeProtocols(presets);
    setMaterials({
      ecosystem: eco, rows,
      processes: allProcesses,
      printer: ecoData.printer||"",
      wash: ecoData.wash||"",
      cure: ecoData.cure||"",
      slicingSoftware: ecoData.software||"",
      postProcessProtocol: protocol,
    });
  };

  const toggleDevice = (key) => {
    const newTypes = device.types.includes(key) ? device.types.filter(t=>t!==key) : [...device.types, key];
    setDevice(p=>({...p, types: newTypes}));
    // When adding a device type, re-cascade with active ecosystem
    if(!device.types.includes(key)) {
      const eco = materials.ecosystem;
      if(eco) {
        // Re-run ecosystem cascade with updated device types
        const ecoData = ECOSYSTEMS[eco] || {};
        const presets = findPresets(newTypes, eco);
        const matMap = new Map();
        presets.forEach(p => { if(!matMap.has(p.material)) matMap.set(p.material, {material:p.material, manufacturer:p.manufacturer, batch:"", ceMarked:true}); });
        // Keep existing batch numbers for materials that haven't changed
        const rows = matMap.size>0 ? [...matMap.values()].map(r => {
          const existing = materials.rows.find(x=>x.material===r.material);
          return existing ? {...r, batch: existing.batch} : r;
        }) : [{material:"",manufacturer:"",batch:"",ceMarked:true}];
        const allProcesses = [...new Set(presets.flatMap(p=>p.processes||[]))];
        const protocol = mergeProtocols(presets);
        setMaterials(prev => ({
          ...prev, rows,
          processes: allProcesses,
          postProcessProtocol: protocol,
        }));
      } else {
        // No ecosystem yet — auto-select first available preset's ecosystem
        const presets = DEVICE_MATERIAL_PRESETS[key];
        if(presets && presets.length>0) {
          const preset = presets[0];
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
              ...p, rows, ecosystem: preset.ecosystem,
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
    }
  };
  const applyPreset = (preset) => {
    switchEcosystem(preset.ecosystem);
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
  const upMat = (i,k,v) => setMaterials(p=>{
    const rows=[...p.rows];rows[i]={...rows[i],[k]:v};
    if(k==="material"&&MATERIAL_DETAILS[v]){
      const matDetail = MATERIAL_DETAILS[v];
      rows[i].manufacturer=matDetail.manufacturer;
      const eco=ECOSYSTEMS[matDetail.ecosystem];
      if(eco){
        // Find matching IFU protocol for this material + device type combo
        let protocol = p.postProcessProtocol;
        for(const dt of device.types) {
          const preset = (DEVICE_MATERIAL_PRESETS[dt]||[]).find(x=>x.material===v);
          if(preset) { protocol = preset.postProcess||protocol; break; }
        }
        return{...p, rows, ecosystem: matDetail.ecosystem,
          printer:eco.printer, wash:eco.wash, cure:eco.cure, slicingSoftware:eco.software,
          postProcessProtocol: protocol,
        };
      }
    }
    return{...p,rows};
  });
  const esc = (s) => (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const fmtDate = (iso) => { if(!iso) return ""; const p=iso.split("-"); return p.length===3?`${p[2]}-${p[1]}-${p[0]}`:iso; };
  const highestClass = device.types.some(t=>DEVICE_TYPES.find(d=>d.key===t)?.class==="IIa")?"IIa":"I";
  const deviceLabel = device.types.map(t=>DEVICE_TYPES.find(d=>d.key===t)?.label||t).join(", ")||"Custom dental device";
  const canProceed = () => { switch(step){case 0:return prescriber.name;case 1:return patient.identifier;case 2:return device.types.length>0;case 3:return materials.rows.some(r=>r.material);case 4:return sign.signerName;default:return true;} };

  // ── Invoice helpers ──
  const detectVat = (addr, country) => {
    const text = ((addr||"")+" "+(country||"")).toLowerCase();
    const isNL = text.includes("nederland") || text.includes("netherlands") || /\b\d{4}\s?[a-z]{2}\b/.test(text) || text.includes(", nl");
    if(isNL) return { vatRate:0, vatExempt:true }; // Dutch healthcare = BTW-vrijgesteld (Art.11 Wet OB 1968)
    const isDE = text.includes("germany") || text.includes("deutschland") || /\b\d{5}\b/.test(text);
    if(isDE) return { vatRate:19, vatExempt:false };
    return { vatRate:0, vatExempt:false }; // EU B2B reverse charge default
  };

  const autoPopulateInvoice = () => {
    const items = [];
    const teethCount = device.teeth.filter(t=>t.length===2).length;
    device.types.forEach(dt => {
      const mapper = DEVICE_PRICE_MAP[dt];
      if(!mapper) return;
      const item = mapper(teethCount);
      if(!item) return;
      // Determine quantity: crowns = per tooth, most others = 1
      let qty = 1;
      if(["crown_3d","crown_zirconia","crown_pmma"].includes(dt)) qty = Math.max(1, teethCount);
      if(["crown_3d","crown_zirconia","crown_pmma"].includes(dt) && teethCount > 1) {
        // For multiple individual crowns
        qty = teethCount;
      }
      items.push({ id: Date.now()+Math.random(), code:item.code, name:item.name, qty, price:item.price, unit:item.unit||"stuks" });
    });
    if(items.length===0) items.push({ id:Date.now(), code:"", name:"", qty:1, price:0, unit:"stuks" });
    const vat = detectVat(prescriber.address, "");
    setInvoice(prev=>({...prev, items, vatRate:vat.vatRate, vatExempt:vat.vatExempt}));
  };

  const addInvoiceItem = (code) => {
    const item = code ? PRICE_LIST.find(p=>p.code===code) : null;
    setInvoice(prev=>({...prev, items:[...prev.items, { id:Date.now()+Math.random(), code:item?.code||"", name:item?.name||"", qty:1, price:item?.price||0, unit:item?.unit||"stuks" }]}));
  };
  const removeInvoiceItem = (id) => setInvoice(prev=>({...prev, items:prev.items.filter(i=>i.id!==id)}));
  const updateInvoiceItem = (id,field,val) => setInvoice(prev=>({...prev, items:prev.items.map(i=>i.id===id?{...i,[field]:val}:i)}));
  const invoiceSubtotal = invoice.items.reduce((s,i)=>s+(i.qty*i.price),0);
  const invoiceVat = invoiceSubtotal * (invoice.vatRate/100);
  const invoiceTotal = invoiceSubtotal + invoiceVat;
  const fmtEur = (n) => n.toLocaleString("nl-NL",{style:"currency",currency:"EUR"});

  const generateMDR = () => {
    const matRows = materials.rows.filter(r=>r.material);
    const isImplantable = device.types.some(t=>["titanium_bar","ti_denture"].includes(t));
    const retention = isImplantable ? "15 years (implantable custom device)" : "10 years (non-implantable custom device)";
    const showPractice = prescriber.practice && prescriber.practice.trim().toLowerCase()!==prescriber.name.trim().toLowerCase();
    const isRestorative = device.types.some(t=>["crown_3d","bridge_3d","crown_zirconia","bridge_zirconia","crown_pmma","bridge_pmma"].includes(t));
    const warningSet = new Set();
    device.types.forEach(t => { (DEVICE_WARNINGS[t]||DEVICE_WARNINGS.surgical_guide_3d).forEach(w => warningSet.add(w)); });
    const warnings = [...warningSet];
    const ICON_B64 = "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";
    const premiumCSS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;font-size:12px;color:#292F37;line-height:1.6}
@page{size:A4;margin:0}
@media print{body{background:#fff;padding:0}.no-print{display:none!important}}
.logo-strip{padding:14px 30px;display:flex;justify-content:space-between;align-items:center}
.logo-row{display:flex;align-items:center;gap:12px}
.logo-row img{width:44px;height:44px;border-radius:50%}
.logo-wm{font-family:'Rajdhani','Inter',sans-serif;font-size:26px;font-weight:700;letter-spacing:5px;color:#041D40;line-height:1}
.logo-wm .m{color:#12D7D0}
.logo-sub{font-family:'Inter',sans-serif;font-size:7.5px;font-weight:500;letter-spacing:2.5px;color:#9aabb8;text-transform:uppercase;margin-top:2px}
.logo-strip .co-r{text-align:right;font-size:9px;color:#9aabb8;line-height:1.5}
.tbar{background:#041D40;padding:10px 30px;display:flex;justify-content:space-between;align-items:center;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.tbar h1{font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff}
.tbar .ts{font-size:8.5px;color:#ADFBF9;letter-spacing:0.5px;margin-top:1px}
.tbar .pills{display:flex;gap:5px}
.tbar .pill{background:rgba(18,215,208,0.15);color:#ADFBF9;padding:3px 10px;border-radius:12px;font-size:7.5px;font-weight:600;border:1px solid rgba(173,251,249,0.25)}
.mbar{height:3px;background:linear-gradient(90deg,#12D7D0,#00D5CD 40%,#EBF4F9);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ref{background:#EDF2F3;padding:7px 30px;display:flex;justify-content:space-between;font-size:11px;color:#041D40;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ref strong{font-weight:700}
.bd{padding:14px 30px 18px}
.sh{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#12D7D0;margin:14px 0 7px;padding-bottom:4px;border-bottom:1.5px solid #EDF2F3}
.sh:first-child{margin-top:0}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4px}
.cd{background:#EDF2F3;border-radius:6px;padding:12px 16px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cd .nm{font-size:13px;font-weight:700;color:#041D40;margin-bottom:2px}
.cd .hi{font-size:9.5px;font-weight:600;color:#12D7D0;margin-bottom:4px;letter-spacing:0.3px}
.cd .ln{font-size:11px;color:#292F37;line-height:1.75}
.cd .mu{font-size:9.5px;color:#6b7a8d}
.dr{display:flex;gap:12px;margin:6px 0}
.db{flex:1;background:#EDF2F3;border-radius:6px;padding:9px 16px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.db .l{font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#6b7a8d;margin-bottom:2px}
.db .v{font-size:12px;font-weight:600;color:#041D40}
.tb{width:100%;border-collapse:separate;border-spacing:0;margin:6px 0;border-radius:6px;overflow:hidden}
.tb th{text-align:left;padding:8px 14px;font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#ADFBF9;background:#041D40;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.tb td{padding:8px 14px;font-size:11px;border-bottom:1px solid #EDF2F3}
.tb tr:last-child td{border-bottom:none}
.tb tr:nth-child(even) td{background:#f8fafb;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.tb th:last-child,.tb td:last-child{text-align:right}
.c3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:6px 0}
.c3b{background:#EDF2F3;border-radius:6px;padding:10px 14px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.c3b .l{font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#6b7a8d;margin-bottom:3px}
.c3b .v{font-size:10px;color:#292F37;line-height:1.65}
.tgs{display:flex;flex-wrap:wrap;gap:4px;margin:5px 0}
.tg{background:#fff;border:1.5px solid #12D7D0;border-radius:4px;padding:3px 10px;font-size:9.5px;font-weight:500;color:#041D40}
.tg b{color:#12D7D0;margin-right:3px}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:5px 18px;margin:6px 0}
.ck{font-size:11px;display:flex;align-items:center;gap:6px}
.ck i{width:16px;height:16px;border-radius:3px;background:#12D7D0;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:700;font-style:normal;flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ck i.off{background:#d8e2ea;color:transparent}
.wrn{background:#fffbf2;border-left:4px solid #e8a020;border-radius:0 6px 6px 0;padding:10px 16px;margin:8px 0;font-size:10.5px;line-height:1.65;color:#5a4520;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.dcl{margin:10px 0;padding:14px 18px;border:2px solid #041D40;border-radius:6px}
.dcl h3{font-size:12px;font-weight:700;color:#041D40;margin-bottom:6px}
.dcl p{font-size:10.5px;margin-bottom:4px}
.dcl ol{margin-left:18px;font-size:10px;line-height:1.75;color:#292F37}
.dcl .ok{margin-top:6px;font-size:9.5px;color:#12D7D0;font-weight:600;font-style:italic}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:10px 0}
.sg-l{background:#EDF2F3;border-radius:6px;padding:12px 16px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.sg-r{border:2px solid #041D40;border-radius:6px;padding:12px 16px}
.sg .l{font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#6b7a8d;margin-bottom:2px}
.sg .vn{font-size:13px;font-weight:700;color:#041D40}
.sg .vt{font-size:11px;font-weight:600;color:#041D40}
.sgl{margin-top:10px;border-top:1.5px solid #041D40;padding-top:3px;font-size:8px;color:#6b7a8d;text-align:center}
.ret{background:#EDF2F3;border-radius:4px;padding:6px 16px;margin:6px 0;font-size:8.5px;color:#5a6a7a;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ft{padding:7px 30px;display:flex;justify-content:space-between;font-size:8px;color:#6b7a8d;border-top:1px solid #EDF2F3}
.ftl{text-align:center;padding:0 30px 5px;font-size:7.5px;color:#9aabb8}
.itb{width:100%;border-collapse:separate;border-spacing:0;margin:8px 0;border-radius:6px;overflow:hidden}
.itb th{text-align:left;padding:9px 16px;font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#ADFBF9;background:#041D40;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.itb th:nth-child(3),.itb td:nth-child(3){text-align:center}
.itb th:nth-child(4),.itb td:nth-child(4),.itb th:nth-child(5),.itb td:nth-child(5){text-align:right}
.itb td{padding:9px 16px;font-size:12px;border-bottom:1px solid #EDF2F3}
.itb td .xc{color:#9aabb8;font-size:9px;margin-left:5px}
.itb tr:last-child td{border-bottom:none}
.itb tr:nth-child(even) td{background:#f8fafb;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.tots{display:flex;justify-content:flex-end;margin:4px 0 12px}
.tbox{width:280px}
.tr{display:flex;justify-content:space-between;padding:5px 0;font-size:12px;color:#292F37}
.tr.ex{font-size:10px;color:#12D7D0;font-style:italic}
.tr.tt{font-size:18px;font-weight:800;color:#041D40;border-top:2.5px solid #041D40;padding-top:10px;margin-top:4px}
.pb{background:#041D40;border-radius:8px;padding:16px 20px;margin:10px 0;display:grid;grid-template-columns:1fr 1fr;gap:18px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pb .pc .pl{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#ADFBF9;margin-bottom:6px}
.pb .pc .pv{font-size:11px;color:#fff;line-height:1.9}
.pb .pc .pv strong{font-weight:700}
.pb .pc .hl{background:rgba(18,215,208,0.15);border:1px solid rgba(173,251,249,0.25);border-radius:6px;padding:6px 12px;margin-top:6px;display:inline-block}
.pb .pc .hl .pv{font-size:14px;font-weight:800;color:#ADFBF9;line-height:1.3}
.trm{font-size:10px;color:#6b7a8d;margin:6px 0;line-height:1.5}
.trm em{color:#12D7D0;font-style:normal;font-weight:500}
.page-break{page-break-before:always;break-before:page;margin-top:0}`;
    const logoHtml = `<div class="logo-strip"><div class="logo-row"><img src="data:image/png;base64,${ICON_B64}" alt="DG"><div><div class="logo-wm">DENT<span class="m">I</span>GU<span class="m">I</span>DE</div><div class="logo-sub">Implanting Excellence, Digitally Perfected</div></div></div><div class="co-r">${esc(mfr.street)}, ${esc(mfr.postal)} ${esc(mfr.city)}<br>${esc(mfr.country)}</div></div>`;
    const footerHtml = `<div class="mbar"></div><div class="ft"><span>${esc(mfr.name)} · ${esc(mfr.street)}, ${esc(mfr.postal)} ${esc(mfr.city)} · ${esc(mfr.country)}</span><span>${caseRef} · EU MDR 2017/745 · Form v1.1</span></div><div class="ftl">Controlled document — changes require version update · "Custom-made device" as defined in Article 2(3), Regulation (EU) 2017/745.</div>`;
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>EU MDR Annex XIII — ${caseRef}</title>
<style>${premiumCSS}</style></head><body>
${logoHtml}
<div class="tbar"><div><h1>EU MDR 2017/745 — Annex XIII</h1><div class="ts">Custom-Made Dental Device Statement</div></div><div class="pills"><span class="pill">Custom-made device</span><span class="pill">Annex XIII</span></div></div>
<div class="mbar"></div>
<div class="ref"><div>Ref: <strong>${caseRef}</strong>${device.labRef?` · Lab: <strong>${esc(device.labRef)}</strong>`:""}${prescriber.orderRef?` · Rx: <strong>${esc(prescriber.orderRef)}</strong>`:""} · Date: <strong>${fmtDate(sign.date)}</strong> · Form v1.1</div></div>
<div class="bd">
<div class="sh">Manufacturer (Annex XIII §1) &amp; Prescribing Health Professional</div>
<div class="g2">
<div class="cd"><div class="nm">${esc(mfr.name)}</div><div class="ln">${esc(mfr.street)}, ${esc(mfr.postal)} ${esc(mfr.city)}, ${esc(mfr.country)}</div>${mfr.prrcName?`<div style="margin-top:8px"><div class="hi">Person Responsible for Regulatory Compliance (Art. 15)</div><div class="ln"><strong>${esc(mfr.prrcName)}</strong></div><div class="mu">Designated PRRC under EU MDR 2017/745</div>${mfr.prrcQual?`<div class="mu">${esc(mfr.prrcQual)}</div>`:""}</div>`:""}</div>
<div class="cd"><div class="nm">${esc(prescriber.name)}</div><div class="hi">Prescribing Health Professional</div><div class="ln">BIG Register: <strong>${esc(prescriber.big)}</strong></div>${showPractice?`<div class="ln">${esc(prescriber.practice)}</div>`:""} ${prescriber.address?`<div class="ln">${esc(prescriber.address)}</div>`:""}<div class="mu" style="margin-top:4px">Prescription: ${fmtDate(prescriber.prescDate)}</div></div>
</div>
<div class="dr" style="margin-top:8px">
<div class="db"><div class="l">Patient Identification</div><div class="v">${esc(patient.method==="code"?"Patient Code":"Initials")}: ${esc(patient.identifier)}</div></div>
<div class="db" style="flex:2"><div class="l">Device Description</div><div class="v">${esc(deviceLabel)} <span style="font-weight:400;color:#6b7a8d;font-size:10px">→ Indicative: Class ${highestClass} (custom-made device)</span></div><div style="font-size:11px;font-weight:500;color:#041D40;margin-top:2px">Region: ${esc(device.teeth.filter(t=>t.length===2).sort().join(", ")||"—")}</div>${device.implantSystem?`<div style="font-size:10px;margin-top:2px">Implant: ${esc(device.implantSystem==="Other (specify in notes)"?device.implantDetails:device.implantSystem)}</div>`:""} ${device.sleeveType?`<div style="font-size:10px">Sleeve: ${esc(device.sleeveType)}</div>`:""} ${device.software?`<div style="font-size:10px">Design: ${esc(device.software)}${device.designDate?` · Completed: ${fmtDate(device.designDate)}`:""}</div>`:""}</div>
</div>
<div class="sh">Materials &amp; Traceability (Annex XIII §2(a))</div>
<table class="tb"><thead><tr><th style="width:36%">Material</th><th style="width:26%">Manufacturer</th><th style="width:18%">Lot / Batch</th><th style="width:8%;text-align:center">CE</th><th style="width:12%">Expiry</th></tr></thead><tbody>${matRows.map(r=>`<tr><td>${esc(r.material)}</td><td>${esc(r.manufacturer)}</td><td><em>${esc(r.batch||"Per mfr records")}</em></td><td style="text-align:center;color:#12D7D0;font-weight:700;font-size:15px">${r.ceMarked?"✓":"✗"}</td><td style="text-align:center">—</td></tr>`).join("")}</tbody></table>
<div class="sh">Manufacturing &amp; Post-Processing</div>
<div class="c3">
<div class="c3b"><div class="l">Processes</div><div class="tgs">${materials.processes.map(p=>`<span class="tg"><b>✓</b>${esc(p)}</span>`).join("")}</div></div>
<div class="c3b"><div class="l">Equipment</div><div class="v">${materials.printer?`<strong>Printer:</strong> ${esc(materials.printer)}<br>`:""} ${materials.wash?`<strong>Wash:</strong> ${esc(materials.wash)}<br>`:""} ${materials.cure?`<strong>Cure:</strong> ${esc(materials.cure)}<br>`:""} ${materials.slicingSoftware?`<strong>Software:</strong> ${esc(materials.slicingSoftware)}`:""}</div></div>
<div class="c3b"><div class="l">Post-Processing Protocol</div><div class="v" style="font-size:9px;white-space:pre-line">${esc(materials.postProcessProtocol||"")}</div><div style="font-size:8.5px;color:#12D7D0;font-style:italic;margin-top:2px">Per manufacturer IFU — ${materials.ecosystem==="sprintray"?"SprintRay":materials.ecosystem==="formlabs"?"Formlabs":"Material manufacturer"} processing guidelines followed.</div></div>
</div>
<div class="sh">Biocompatibility Confirmation (Annex I GSPR)</div>
<div class="cg"><div class="ck"><i>✓</i> CE-marked biocompatible materials used</div><div class="ck"><i>✓</i> ISO 10993 covered by material manufacturer</div><div class="ck"><i>✓</i> Manufacturer IFU followed</div><div class="ck"><i>✓</i> No known allergens / hazards</div></div>
<div class="wrn"><strong>⚠ Warnings &amp; Limitations</strong><br>${warnings.map(w=>`• ${esc(w)}<br>`).join("")}<span style="font-size:9px;color:#12D7D0;font-style:italic">Case data consistency verified prior to manufacturing.</span></div>
<div class="dcl"><h3>Manufacturer's Declaration — EU MDR 2017/745 Annex XIII §1</h3><p>The undersigned declares that the custom-made device described herein:</p><ol><li>Is specifically made following a written prescription per Article 2(3);</li><li>Is intended for the sole use of patient: <strong>${esc(patient.identifier)}</strong>;</li><li>Conforms to GSPR set out in Annex I;</li><li>Manufactured per documented QMS (Article 10(9));</li><li>Uses CE-marked materials per intended purpose and manufacturer's IFU;</li><li>Does not bear CE marking (Article 20(1));</li><li>Labelled as "custom-made device" / "Sonderanfertigung";</li><li>Exempt from UDI requirements (Article 27(1)).</li></ol></div>
<div class="sh">Substances / Tissues (Annex XIII §1(c))</div>
<div class="cg" style="grid-template-columns:1fr 1fr 1fr 1fr"><div class="ck"><i class="off">✓</i> Medicinal</div><div class="ck"><i class="off">✓</i> Blood / plasma</div><div class="ck"><i class="off">✓</i> Tissue</div><div class="ck"><i>✓</i> None of above</div></div>
<div class="sg"><div class="sg-l"><div class="l">Authorised Signatory</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:5px"><div><div class="l">Name</div><div class="vn">${esc(sign.signerName)}</div></div><div><div class="l">Title</div><div class="vt">${esc(sign.signerTitle)}</div></div></div><div style="margin-top:6px"><div class="l">Date</div><div class="vt">${fmtDate(sign.date)}</div></div></div><div class="sg-r"><div class="l">Signature</div><div style="height:50px"></div><div class="sgl">Authorised signature</div></div></div>
<div class="ret"><strong>Retention:</strong> ${retention} after placing on market (Annex XIII §4). Report incidents to <strong>BfArM:</strong> medizinprodukte@bfarm.de ■ Exempt from UDI (Art. 27(1)) &amp; CE marking (Art. 20(1)).</div>
</div>
${footerHtml}
</body></html>`;
  };


  const generateDeliveryNote = () => {
    const matRows = materials.rows.filter(r=>r.material);
    const showPractice = prescriber.practice && prescriber.practice.trim().toLowerCase()!==prescriber.name.trim().toLowerCase();
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Delivery Note — ${caseRef}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',system-ui,sans-serif;font-size:10px;color:#2a3e52;line-height:1.4}@page{size:A4;margin:8mm 12mm}@media print{body{font-size:9px;color:#000!important}.no-print{display:none!important}}.header{background:#041D40;color:#fff;padding:10px 18px;margin-bottom:6px;-webkit-print-color-adjust:exact;print-color-adjust:exact;display:flex;justify-content:space-between;align-items:center}.header h1{font-size:14px;font-weight:700}.header p{font-size:8px;opacity:0.85;margin-top:2px}.ref-bar{padding:5px 10px;border:1px solid #d0dbe8;border-radius:5px;margin-bottom:6px;font-size:8.5px;display:flex;justify-content:space-between}.cards{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px}.card{border:1px solid #d0dbe8;border-radius:6px;padding:8px 12px}.card-title{font-size:8px;font-weight:700;text-transform:uppercase;color:#4a6fa5;margin-bottom:5px}.card-row{font-size:9px;line-height:1.5;margin-bottom:1px}.mat-table{width:100%;border-collapse:collapse;margin:6px 0}.mat-table th{text-align:left;padding:4px 8px;font-size:8px;font-weight:700;color:#4a6fa5;border-bottom:2px solid #c8ddf0}.mat-table td{padding:4px 8px;font-size:9px;border-bottom:1px solid #e8eef5}.qc-box{border:2px solid #1a7a3a;border-radius:8px;padding:10px 14px;margin:8px 0;background:#f0faf4}.qc-box h3{font-size:11px;color:#1a5a2c;margin-bottom:6px}.qc-row{display:flex;gap:20px;margin-top:6px}.qc-field label{font-size:7px;color:#6a8fa5;display:block}.qc-field .val{font-size:9px;font-weight:600;border-bottom:1px solid #999;padding-bottom:2px;min-height:16px;min-width:120px}.handling{border:2px solid #e8a000;border-radius:8px;padding:10px 14px;margin:8px 0;background:#fffbf0}.handling h3{font-size:10px;color:#8a6000;margin-bottom:6px}.footer{border-top:1.5px solid #d0dae4;margin-top:8px;padding-top:4px;font-size:7px;color:#6a7a8a;display:flex;justify-content:space-between}</style></head><body>
<div class="header"><div><h1>Delivery Note</h1><p>Custom-Made Dental Device</p></div><div style="text-align:right;font-size:10px;font-weight:600">${esc(mfr.name)}<br><span style="font-size:7.5px;opacity:0.7">Delivery Note</span></div></div>
<div class="ref-bar"><div>MDR Ref: <strong>${caseRef}</strong>${device.labRef?` · Lab: <strong>${esc(device.labRef)}</strong>`:""}${prescriber.orderRef?` · Rx: <strong>${esc(prescriber.orderRef)}</strong>`:""}</div><div>Delivery Date: <strong>${fmtDate(sign.date)}</strong></div></div>
<div class="cards"><div class="card"><div class="card-title">From — Manufacturer</div><div class="card-row"><strong>${esc(mfr.name)}</strong></div><div class="card-row">${esc(mfr.street)}, ${esc(mfr.postal)} ${esc(mfr.city)}</div>${mfr.phone?`<div class="card-row">☎ ${esc(mfr.phone)}</div>`:""}</div>
<div class="card"><div class="card-title">To — Clinic / Prescriber</div><div class="card-row"><strong>${esc(prescriber.name)}</strong></div>${showPractice?`<div class="card-row">${esc(prescriber.practice)}</div>`:""} ${prescriber.address?`<div class="card-row">${esc(prescriber.address)}</div>`:""} ${prescriber.phone?`<div class="card-row">☎ ${esc(prescriber.phone)}</div>`:""}</div></div>
<div class="card" style="margin-bottom:6px"><div class="card-title">Device Details</div><table style="font-size:9px;line-height:1.6"><tr><td style="color:#4a6fa5;width:120px">Patient</td><td><strong>${esc(patient.identifier)}</strong></td></tr><tr><td style="color:#4a6fa5">Device</td><td><strong>${esc(deviceLabel)}</strong></td></tr><tr><td style="color:#4a6fa5">Teeth / Region</td><td>${esc(device.teeth.filter(t=>t.length===2).sort().join(", ")||"—")}</td></tr>${device.implantSystem?`<tr><td style="color:#4a6fa5">Implant System</td><td>${esc(device.implantSystem==="Other (specify in notes)"?device.implantDetails:device.implantSystem)}</td></tr>`:""} ${device.sleeveType?`<tr><td style="color:#4a6fa5">Guided Sleeve</td><td>${esc(device.sleeveType)}</td></tr>`:""} ${device.fixationSleeve?`<tr><td style="color:#4a6fa5">Fixation Sleeve</td><td>${esc(device.fixationSleeve)}</td></tr>`:""} ${device.fixationPinSystem?`<tr><td style="color:#4a6fa5">Fixation Pin System</td><td>${esc(device.fixationPinSystem)}</td></tr>`:""} ${device.software?`<tr><td style="color:#4a6fa5">Design Software</td><td>${esc(device.software)}</td></tr>`:""} ${device.shade?`<tr><td style="color:#4a6fa5">Shade</td><td>${esc(device.shade)}</td></tr>`:""}</table></div>
<table class="mat-table"><thead><tr><th>Material</th><th>Manufacturer</th><th>Lot/Batch</th><th>CE</th></tr></thead><tbody>${matRows.map(r=>`<tr><td>${esc(r.material)}</td><td>${esc(r.manufacturer)}</td><td>${esc(r.batch||"Per mfr records")}</td><td>${r.ceMarked?"✓":"✗"}</td></tr>`).join("")}</tbody></table>
<div class="handling"><h3>⚠ Important — Handling & Storage Instructions</h3><div style="font-size:9px;line-height:1.6"><div>🚫 <strong>Single use only.</strong> Do not reuse, resterilise, or modify.</div><div>✅ <strong>Before use:</strong> Disinfect or sterilise per the resin manufacturer's IFU and clinic protocol.</div><div>📦 <strong>Storage:</strong> Keep in protective packaging, avoid direct sunlight and heat.</div><div>⏱ <strong>Shelf life:</strong> Use within 6 months of manufacturing date.</div></div></div>
<div class="qc-box"><h3>✅ Quality Control — Release for Clinical Use</h3><div style="font-size:9px">This device has been manufactured in accordance with the prescription, inspected for dimensional accuracy and surface quality, and is released for clinical use.</div><div class="qc-row"><div class="qc-field"><label>Inspected by</label><div class="val">${esc(sign.signerName)}${sign.credentials?`, ${esc(sign.credentials)}`:""}</div></div><div class="qc-field"><label>Date</label><div class="val">${fmtDate(sign.date)}</div></div><div class="qc-field"><label>Signature</label><div class="val" style="border-bottom-style:dashed;min-height:22px"></div></div></div></div>
<div class="footer"><span>${esc(mfr.name)} · ${esc(mfr.city)}, ${esc(mfr.country)}</span><span>${caseRef} · Generated ${new Date().toLocaleDateString()}</span></div></body></html>`;
  };


  const generateInvoice = () => {
    const showPractice = prescriber.practice && prescriber.practice.trim().toLowerCase()!==prescriber.name.trim().toLowerCase();
    const items = invoice.items.filter(i=>i.name);
    const ICON_B64 = "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";
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Invoice — ${invoiceRef}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;font-size:12px;color:#292F37;line-height:1.6}
@page{size:A4;margin:0}
@media print{body{background:#fff;padding:0}.no-print{display:none!important}}
.logo-strip{padding:14px 30px;display:flex;justify-content:space-between;align-items:center}
.logo-row{display:flex;align-items:center;gap:12px}
.logo-row img{width:44px;height:44px;border-radius:50%}
.logo-wm{font-family:'Rajdhani','Inter',sans-serif;font-size:26px;font-weight:700;letter-spacing:5px;color:#041D40;line-height:1}
.logo-wm .m{color:#12D7D0}
.logo-sub{font-family:'Inter',sans-serif;font-size:7.5px;font-weight:500;letter-spacing:2.5px;color:#9aabb8;text-transform:uppercase;margin-top:2px}
.logo-strip .co-r{text-align:right;font-size:9px;color:#9aabb8;line-height:1.5}
.tbar{background:#041D40;padding:10px 30px;display:flex;justify-content:space-between;align-items:center;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.tbar h1{font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#fff}
.mbar{height:3px;background:linear-gradient(90deg,#12D7D0,#00D5CD 40%,#EBF4F9);-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ref{background:#EDF2F3;padding:7px 30px;display:flex;justify-content:space-between;font-size:11px;color:#041D40;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ref strong{font-weight:700}
.bd{padding:14px 30px 18px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4px}
.cd{background:#EDF2F3;border-radius:6px;padding:12px 16px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cd .nm{font-size:13px;font-weight:700;color:#041D40;margin-bottom:2px}
.cd .hi{font-size:9.5px;font-weight:600;color:#12D7D0;margin-bottom:4px;letter-spacing:0.3px}
.cd .ln{font-size:11px;color:#292F37;line-height:1.75}
.cd .mu{font-size:9.5px;color:#6b7a8d}
.dr{display:flex;gap:12px;margin:6px 0}
.db{flex:1;background:#EDF2F3;border-radius:6px;padding:9px 16px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.db .l{font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;color:#6b7a8d;margin-bottom:2px}
.db .v{font-size:12px;font-weight:600;color:#041D40}
.itb{width:100%;border-collapse:separate;border-spacing:0;margin:8px 0;border-radius:6px;overflow:hidden}
.itb th{text-align:left;padding:9px 16px;font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#ADFBF9;background:#041D40;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.itb th:nth-child(3),.itb td:nth-child(3){text-align:center}
.itb th:nth-child(4),.itb td:nth-child(4),.itb th:nth-child(5),.itb td:nth-child(5){text-align:right}
.itb td{padding:9px 16px;font-size:12px;border-bottom:1px solid #EDF2F3}
.itb td .xc{color:#9aabb8;font-size:9px;margin-left:5px}
.itb tr:last-child td{border-bottom:none}
.itb tr:nth-child(even) td{background:#f8fafb;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.tots{display:flex;justify-content:flex-end;margin:4px 0 12px}
.tbox{width:280px}
.tr{display:flex;justify-content:space-between;padding:5px 0;font-size:12px;color:#292F37}
.tr.ex{font-size:10px;color:#12D7D0;font-style:italic}
.tr.tt{font-size:18px;font-weight:800;color:#041D40;border-top:2.5px solid #041D40;padding-top:10px;margin-top:4px}
.pb{background:#041D40;border-radius:8px;padding:16px 20px;margin:10px 0;display:grid;grid-template-columns:1fr 1fr;gap:18px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pb .pc .pl{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#ADFBF9;margin-bottom:6px}
.pb .pc .pv{font-size:11px;color:#fff;line-height:1.9}
.pb .pc .pv strong{font-weight:700}
.pb .pc .hl{background:rgba(18,215,208,0.15);border:1px solid rgba(173,251,249,0.25);border-radius:6px;padding:6px 12px;margin-top:6px;display:inline-block}
.pb .pc .hl .pv{font-size:14px;font-weight:800;color:#ADFBF9;line-height:1.3}
.trm{font-size:10px;color:#6b7a8d;margin:6px 0;line-height:1.5}
.trm em{color:#12D7D0;font-style:normal;font-weight:500}
.ft{padding:7px 30px;display:flex;justify-content:space-between;font-size:8px;color:#6b7a8d;border-top:1px solid #EDF2F3}
.notes-box{background:#EDF2F3;border-radius:6px;padding:10px 16px;margin:8px 0;font-size:10px;color:#5a6a7a}
</style></head><body>
<div class="logo-strip"><div class="logo-row"><img src="data:image/png;base64,${ICON_B64}" alt="DG"><div><div class="logo-wm">DENT<span class="m">I</span>GU<span class="m">I</span>DE</div><div class="logo-sub">Implanting Excellence, Digitally Perfected</div></div></div><div class="co-r">${esc(mfr.street)}, ${esc(mfr.postal)} ${esc(mfr.city)}<br>${esc(mfr.country)}</div></div>
<div class="tbar"><div><h1>Invoice / Factuur</h1></div></div>
<div class="mbar"></div>
<div class="ref"><div>Invoice: <strong>${invoiceRef}</strong>${caseRef?` · Case: <strong>${caseRef}</strong>`:""}</div><div>Date: <strong>${fmtDate(sign.date)}</strong></div></div>
<div class="bd">
<div class="g2" style="margin-top:8px">
<div class="cd"><div class="hi">From — Manufacturer</div><div class="nm">${esc(mfr.name)}</div><div class="ln">${esc(mfr.street)}</div><div class="ln">${esc(mfr.postal)} ${esc(mfr.city)}, ${esc(mfr.country)}</div>${mfr.phone?`<div class="ln">Tel: ${esc(mfr.phone)}</div>`:""} ${mfr.email?`<div class="ln">${esc(mfr.email)}</div>`:""} ${invoice.kvk?`<div class="mu" style="margin-top:4px">KvK: ${esc(invoice.kvk)}</div>`:""} ${invoice.btw?`<div class="mu">BTW: ${esc(invoice.btw)}</div>`:""}</div>
<div class="cd"><div class="hi">To — Client</div><div class="nm">${esc(prescriber.name)}</div>${showPractice?`<div class="ln">${esc(prescriber.practice)}</div>`:""} ${prescriber.address?`<div class="ln">${esc(prescriber.address)}</div>`:""} ${prescriber.phone?`<div class="ln">Tel: ${esc(prescriber.phone)}</div>`:""} ${prescriber.email?`<div class="ln">${esc(prescriber.email)}</div>`:""}</div>
</div>
<div class="dr"><div class="db"><div class="l">Patient / Case Reference</div><div class="v" style="font-size:11px">Patient: <strong>${esc(patient.identifier)}</strong> · Device: <strong>${esc(deviceLabel)}</strong></div></div></div>
<table class="itb"><thead><tr><th style="width:40px">#</th><th>Description</th><th style="width:50px">Qty</th><th style="width:100px">Unit Price</th><th style="width:110px">Amount</th></tr></thead>
<tbody>${items.map((item,i)=>`<tr><td>${i+1}</td><td>${esc(item.name)}${item.code?` <span class="xc">(${esc(item.code)})</span>`:""}</td><td>${item.qty}${item.unit&&item.unit!=="stuks"?` ${esc(item.unit)}`:""}</td><td>${fmtEur(item.price)}</td><td><strong>${fmtEur(item.qty*item.price)}</strong></td></tr>`).join("")}</tbody></table>
<div class="tots"><div class="tbox">
<div class="tr"><span>Subtotal</span><span>${fmtEur(invoiceSubtotal)}</span></div>
<div class="tr ex"><span>BTW / VAT ${invoice.vatExempt?'— Vrijgesteld (Art.11 Wet OB 1968)':`(${invoice.vatRate}%)`}</span><span>${fmtEur(invoiceVat)}</span></div>
<div class="tr tt"><span>Total</span><span>${fmtEur(invoiceTotal)}</span></div>
</div></div>
${(invoice.bankName||invoice.iban)?`<div class="pb"><div class="pc"><div class="pl">Bank Details — Betalingsgegevens</div>${invoice.bankName?`<div class="pv">Bank: <strong>${esc(invoice.bankName)}</strong></div>`:""} ${invoice.iban?`<div class="pv">IBAN: <strong>${esc(invoice.iban)}</strong></div>`:""} ${invoice.bic?`<div class="pv">BIC: <strong>${esc(invoice.bic)}</strong></div>`:""} ${invoice.accountHolder?`<div class="pv">Account holder: <strong>${esc(invoice.accountHolder)}</strong></div>`:""}</div><div class="pc"><div class="pl">Payment Reference</div><div class="hl"><div class="pv">${invoiceRef}</div></div><div class="pv" style="font-size:9px;opacity:0.7;margin-top:6px">Quote this reference on your bank transfer</div></div></div>`:""} 
<div class="trm"><strong>Payment terms:</strong> ${esc(invoice.paymentTerms)}. Please quote invoice number <strong>${invoiceRef}</strong> on payment.${invoice.vatExempt?'<br><em>BTW vrijgesteld op grond van artikel 11, lid 1, onderdeel g, sub 1° Wet op de omzetbelasting 1968 (medische hulpmiddelen op maat).</em>':''}</div>
${invoice.notes?`<div class="notes-box"><strong>Notes:</strong> ${esc(invoice.notes)}</div>`:""}
</div>
<div class="mbar"></div>
<div class="ft"><span>${esc(mfr.name)} · ${esc(mfr.street)}, ${esc(mfr.postal)} ${esc(mfr.city)} · ${esc(mfr.country)}</span><span>${invoiceRef} · Generated ${new Date().toLocaleDateString()}</span></div>
</body></html>`;
  };

  // Combined MDR + Invoice as one multi-page PDF
  const generateBundle = () => {
    const mdrHtml = generateMDR();
    const invHtml = generateInvoice();
    const extractStyle = (html) => { const m = html.match(/<style>([\s\S]*?)<\/style>/); return m?m[1]:""; };
    const extractBody = (html) => { const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/); return m?m[1]:""; };
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${caseRef} — Full Case Bundle</title>
<style>
${extractStyle(mdrHtml)}
.page-break{page-break-before:always;break-before:page;margin-top:0}
</style></head><body>
${extractBody(mdrHtml)}
<div class="page-break">
${extractBody(invHtml)}
</div>
</body></html>`;
  };

  const download = (html, suffix) => {
    const win = window.open("","_blank");
    if(!win) { alert("Please allow popups to download PDF."); return; }
    win.document.write(html);
    win.document.close();
    // Add print button + auto-trigger
    const btn = win.document.createElement("div");
    btn.className = "no-print";
    btn.innerHTML = `<div style="position:fixed;top:0;left:0;right:0;background:#041D40;color:#fff;padding:10px 20px;display:flex;justify-content:space-between;align-items:center;z-index:99999;font-family:system-ui">
      <span style="font-size:13px;font-weight:700">📄 ${caseRef}${suffix} v1.1 — Use "Save as PDF" in the print dialog</span>
      <button onclick="window.print()" style="background:#fff;color:#041D40;border:none;padding:8px 24px;border-radius:6px;font-weight:700;cursor:pointer;font-size:13px">🖨 Print / Save PDF</button>
    </div><div style="height:50px"></div>`;
    win.document.body.insertBefore(btn, win.document.body.firstChild);
    setTimeout(() => win.print(), 500);
  };
  const handleDownloadMDR = async () => { setDownloading(true); download(generateMDR(),"-MDR"); await onSaveCase(caseRef,{mfr,prescriber,patient,device,materials,sign}); setDownloading(false); };
  const handleDownloadDelivery = () => { download(generateDeliveryNote(),"-DEL"); };
  const handleDownloadInvoice = () => { download(generateInvoice(),`_${invoiceRef}`); };

  const handleDownloadBundle = async () => { setDownloading(true); download(generateBundle(),"-BUNDLE"); await onSaveCase(caseRef,{mfr,prescriber,patient,device,materials,sign,invoice}); setDownloading(false); };
  const handleSaveClinic = async () => { if(!prescriber.name)return; setClinicSaved("saving"); const code = prescriber.clinicCode || generateClinicCode(prescriber.name, prescriber.practice, prescriber.address); if(!prescriber.clinicCode) setPrescriber(p=>({...p,clinicCode:code})); const result=await onSaveClinic({name:prescriber.name,big:prescriber.big,practice:prescriber.practice,address:prescriber.address,phone:prescriber.phone,email:prescriber.email,clinic_code:code}); if(result?.error){setClinicSaved("error");console.error("Clinic save failed:",result.error);}else{setClinicSaved("done");} setTimeout(()=>setClinicSaved(""),3000); };

  
  const up=(setter,key)=>(e)=>setter(p=>({...p,[key]:e.target.value}));

  return (
    <div>
      <div className="flex justify-between items-center mb-6"><div><h1 className="text-2xl font-bold text-gray-900">New MDR Form</h1><p className="text-gray-500 text-sm mt-1">EU MDR Annex XIII v1.1 — {caseRef}</p></div></div>
      <div className="flex gap-1 mb-6">{STEPS.map((s,i)=><button key={s.key} onClick={()=>i<=step?setStep(i):null} className={`flex-1 py-2.5 text-center text-xs font-medium transition ${i===0?"rounded-l-lg":""} ${i===STEPS.length-1?"rounded-r-lg":""} ${i===step?"bg-blue-600 text-white font-bold":i<step?"bg-blue-400 text-white cursor-pointer":"bg-gray-200 text-gray-500"}`}><span className="block text-base">{s.icon}</span>{s.label}</button>)}</div>
      <div className="bg-white rounded-xl border border-gray-200 p-7 min-h-[400px]">

        {step===0&&<div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Prescriber / Clinic</h2><p className="text-sm text-gray-500 mb-5">Select a saved clinic or enter new prescriber details.</p>
          {clinics.length>0&&<div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 mb-2">Saved Clinics</label>
            <div className="grid grid-cols-2 gap-2">
              {clinics.map(c=><button key={c.id} onClick={()=>selectClinic(c.id)} className={`text-left p-3 rounded-lg border transition ${prescriber.name===c.name?"border-blue-500 bg-blue-50":"border-gray-200 hover:bg-gray-50"}`}>
                <div className="flex justify-between items-start"><div className="text-sm font-semibold text-gray-800">{c.name}</div>{c.clinic_code&&<span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{c.clinic_code}</span>}</div>
                {c.practice&&c.practice!==c.name&&<div className="text-xs text-gray-500">{c.practice}</div>}
                {c.big&&<div className="text-[10px] text-gray-400 mt-0.5">BIG: {c.big}</div>}
              </button>)}
            </div>
          </div>}
          <div className="grid grid-cols-2 gap-4"><FormInput label="Dentist / Prescriber Name *" value={prescriber.name} onChange={up(setPrescriber,"name")}/><FormInput label="BIG Register Number" value={prescriber.big} onChange={up(setPrescriber,"big")}/><FormInput label="Practice / Clinic" value={prescriber.practice} onChange={up(setPrescriber,"practice")}/><FormInput label="Phone" value={prescriber.phone} onChange={up(setPrescriber,"phone")}/><FormInput label="Address" value={prescriber.address} onChange={up(setPrescriber,"address")} span={2}/><FormInput label="Rx Order Reference" value={prescriber.orderRef} onChange={up(setPrescriber,"orderRef")}/><FormInput label="Prescription Date" type="date" value={prescriber.prescDate} onChange={up(setPrescriber,"prescDate")}/></div>
          {/* Clinic Code */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="flex-1"><label className="block text-xs font-semibold text-blue-700 mb-1">Clinic Code</label>
                <input value={prescriber.clinicCode} onChange={e=>setPrescriber(p=>({...p,clinicCode:e.target.value.toUpperCase().replace(/[^A-Z0-9.]/g,"")}))} placeholder="e.g. IMPL.AMS" className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm font-mono font-bold tracking-wider outline-none focus:ring-2 focus:ring-blue-400 bg-white"/>
              </div>
              <button onClick={()=>{const code=generateClinicCode(prescriber.name,prescriber.practice,prescriber.address);setPrescriber(p=>({...p,clinicCode:code}));}} className="mt-5 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200 transition">⚡ Auto</button>
            </div>
            <p className="text-[10px] text-blue-500 mt-1">Used in case references: <strong className="font-mono">DG-{prescriber.clinicCode||"????"}-{new Date().getFullYear()}-001</strong></p>
          </div>
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

          {/* ECOSYSTEM SELECTOR — always visible for printable devices */}
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 mb-5">
            <label className="block text-xs font-semibold text-indigo-700 mb-2">🔄 Manufacturing Ecosystem</label>
            <p className="text-xs text-indigo-500 mb-3">Select your printer/milling system — materials, equipment, protocols & IFU steps auto-fill.</p>
            <div className="flex flex-wrap gap-2">
              {[
                {key:"sprintray", label:"🖨️ SprintRay Pro 55S", desc:"DLP · 385nm"},
                {key:"formlabs", label:"🖨️ Formlabs Form 4B", desc:"MSLA · 405nm"},
                {key:"milling", label:"⚙️ CAD/CAM Milling", desc:"Zirconia · PMMA · Ti"},
              ].map(eco=>
                <button key={eco.key} onClick={()=>switchEcosystem(eco.key)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold transition border flex flex-col items-start ${
                    materials.ecosystem===eco.key
                      ?"bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      :"bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-100"
                  }`}>
                  <span>{eco.label}</span>
                  <span className={`text-[10px] font-normal ${materials.ecosystem===eco.key?"text-indigo-200":"text-indigo-400"}`}>{eco.desc}</span>
                </button>
              )}
            </div>
            {materials.ecosystem && <div className="mt-3 text-xs text-indigo-600 font-medium">
              ✅ {materials.ecosystem==="sprintray"?"SprintRay":materials.ecosystem==="formlabs"?"Formlabs":"Milling"} ecosystem active — equipment, materials & IFU protocol auto-filled
            </div>}
          </div>

          {materials.rows.map((r,i)=><div key={i} className="grid grid-cols-4 gap-3 mb-3">
            <div className="col-span-2"><label className="block text-xs font-semibold text-gray-500 mb-1">Material {i+1}</label>
              <select value={r.material} onChange={e=>upMat(i,"material",e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"><option value="">Select...</option>{MAT_OPTIONS.filter(m=>{const eco=materials.ecosystem;return !eco||m.eco===eco||m.eco==="milling";}).map(m=><option key={m.name} value={m.name}>{m.name}</option>)}<option value="_custom">— Custom —</option></select>
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

          {/* EQUIPMENT — auto-filled, editable overrides */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-4">
            <label className="block text-xs font-semibold text-blue-700 mb-1">Equipment</label>
            {materials.ecosystem && <p className="text-[10px] text-blue-500 mb-3">Auto-filled from {materials.ecosystem==="sprintray"?"SprintRay":materials.ecosystem==="formlabs"?"Formlabs":"Milling"} ecosystem. Override if needed.</p>}
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Printer</label>
                <input value={materials.printer} onChange={e=>setMaterials(p=>({...p,printer:e.target.value}))} placeholder="Select ecosystem above" className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${materials.printer?"border-blue-300 bg-blue-50/50":"border-blue-200"}`} readOnly={!!materials.ecosystem}/></div>
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Wash Machine</label>
                <input value={materials.wash} onChange={e=>setMaterials(p=>({...p,wash:e.target.value}))} placeholder="Auto-filled" className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${materials.wash?"border-blue-300 bg-blue-50/50":"border-blue-200"}`}/></div>
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Cure Machine</label>
                <input value={materials.cure} onChange={e=>setMaterials(p=>({...p,cure:e.target.value}))} placeholder="Auto-filled" className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${materials.cure?"border-blue-300 bg-blue-50/50":"border-blue-200"}`}/></div>
              <div><label className="block text-xs font-semibold text-gray-500 mb-1">Slicing Software</label>
                <input value={materials.slicingSoftware} onChange={e=>setMaterials(p=>({...p,slicingSoftware:e.target.value}))} placeholder="Auto-filled" className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500 ${materials.slicingSoftware?"border-blue-300 bg-blue-50/50":"border-blue-200"}`}/></div>
            </div>
          </div>

          {/* POST-PROCESSING PROTOCOL — auto-generated from IFU */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <label className="block text-xs font-semibold text-amber-700 mb-1">Post-Processing Protocol (IFU)</label>
            {materials.postProcessProtocol && <p className="text-[10px] text-amber-500 mb-2">Auto-generated from manufacturer IFU for selected device + material. Edit if needed.</p>}
            <textarea value={materials.postProcessProtocol} onChange={e=>setMaterials(p=>({...p,postProcessProtocol:e.target.value}))} rows={6} placeholder="Select ecosystem & device type to auto-generate IFU protocol..." className="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm outline-none focus:ring-2 focus:ring-amber-400 resize-y font-mono"/>
          </div>
        </div>}

        {step===4&&<div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">Review & Sign</h2><p className="text-sm text-gray-500 mb-5">Verify details, then download.</p>
          {/* Case Reference Summary */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><div className="text-[10px] text-blue-500 uppercase tracking-wide font-semibold">Case Reference</div><div className="text-sm font-mono font-bold text-blue-800 mt-1">{caseRef}</div></div>
              <div><div className="text-[10px] text-blue-500 uppercase tracking-wide font-semibold">Documents</div><div className="text-xs font-mono text-blue-700 mt-1">{mdrRef}<br/>{delRef}</div></div>
              <div><div className="text-[10px] text-blue-500 uppercase tracking-wide font-semibold">Invoice</div><div className="text-sm font-mono font-bold text-blue-800 mt-1">{invoiceRef}</div></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">{[["Prescriber",`${prescriber.name} · BIG: ${prescriber.big}`],["Clinic Code",prescriber.clinicCode||"—"],["Patient",patient.identifier],["Device",deviceLabel],["Teeth",device.teeth.filter(t=>t.length===2).sort().join(", ")||"—"],["Ecosystem",materials.ecosystem==="sprintray"?"SprintRay Pro 55S":materials.ecosystem==="formlabs"?"Formlabs Form 4B":materials.ecosystem==="milling"?"CAD/CAM Milling":"—"],["Materials",materials.rows.filter(r=>r.material).map(r=>r.material).join("; ")||"—"],["Class",highestClass],...(device.implantSystem?[["Implant System",device.implantSystem==="Other (specify in notes)"?device.implantDetails:device.implantSystem]]:[]),(device.sleeveType?[["Sleeve",device.sleeveType]]:[]),(device.fixationSleeve?[["Fixation Sleeve",device.fixationSleeve]]:[]),(device.fixationPinSystem?[["Fixation Pin System",device.fixationPinSystem]]:[])].map(([l,v])=><div key={l} className="p-3 bg-gray-50 rounded-lg"><div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{l}</div><div className="text-sm text-gray-800 font-medium truncate">{v}</div></div>)}</div>
          <div className="border-t border-gray-100 pt-5"><h3 className="text-sm font-semibold text-gray-700 mb-3">Signature</h3>
            <div className="grid grid-cols-3 gap-4"><FormInput label="Name *" value={sign.signerName} onChange={up(setSign,"signerName")}/><FormInput label="Title" value={sign.signerTitle} onChange={up(setSign,"signerTitle")}/><FormInput label="Date" type="date" value={sign.date} onChange={up(setSign,"date")}/></div>
            <div className="mt-3"><FormInput label="Credentials" value={sign.credentials} onChange={up(setSign,"credentials")} placeholder="e.g. DDS · MSc Periodontics"/><p className="text-xs text-gray-400 mt-1">Shown on delivery notes. For MDR forms, qualifications appear in the PRRC section (Settings).</p></div></div>
          <div className="flex gap-3 mt-8">
            <button onClick={handleDownloadBundle} disabled={downloading||!sign.signerName||!invoice.items.some(i=>i.name)} className="px-6 py-3 rounded-lg bg-blue-800 text-white font-bold text-sm hover:bg-blue-900 disabled:opacity-40 transition shadow-sm">{downloading?"⏳ Generating...":"📋 MDR + Invoice (1 PDF)"}</button>
            <button onClick={handleDownloadMDR} disabled={downloading||!sign.signerName} className="px-5 py-3 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 disabled:opacity-40 transition shadow-sm">📄 MDR only</button>
            <button onClick={handleDownloadDelivery} disabled={!sign.signerName} className="px-5 py-3 rounded-lg bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 disabled:opacity-40 transition shadow-sm">📦 Delivery</button></div>
          <p className="text-xs text-gray-400 mt-3">Bundle = MDR form (page 1) + Invoice (page 2) in one PDF. Files: <span className="font-mono">{caseRef}.pdf</span></p>

          {/* ── INVOICE SECTION ── */}
          <div className="border-t-2 border-blue-200 mt-8 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-lg font-bold text-gray-800">💰 Invoice</h3><p className="text-sm text-gray-500">Invoice: <strong>{invoiceRef}</strong> · Case: <strong>{caseRef}</strong></p></div>
              <button onClick={autoPopulateInvoice} className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold text-xs hover:bg-blue-200 transition">⚡ Auto-populate from case</button>
            </div>

            {/* Line items */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-12 gap-2 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                <div className="col-span-5">Description</div><div className="col-span-2">Qty</div><div className="col-span-2">Unit Price (€)</div><div className="col-span-2">Total</div><div className="col-span-1"></div>
              </div>
              {invoice.items.map((item)=>(
                <div key={item.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
                  <div className="col-span-5"><input value={item.name} onChange={e=>updateInvoiceItem(item.id,"name",e.target.value)} placeholder="Item description" className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-400"/></div>
                  <div className="col-span-2"><input type="number" min="0" step="1" value={item.qty} onChange={e=>updateInvoiceItem(item.id,"qty",parseFloat(e.target.value)||0)} className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm text-right outline-none focus:ring-2 focus:ring-blue-400"/></div>
                  <div className="col-span-2"><input type="number" min="0" step="0.01" value={item.price} onChange={e=>updateInvoiceItem(item.id,"price",parseFloat(e.target.value)||0)} className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm text-right outline-none focus:ring-2 focus:ring-blue-400"/></div>
                  <div className="col-span-2 text-sm font-semibold text-gray-700 text-right pr-2">{fmtEur(item.qty*item.price)}</div>
                  <div className="col-span-1"><button onClick={()=>removeInvoiceItem(item.id)} className="text-red-400 hover:text-red-600 text-lg leading-none" title="Remove">×</button></div>
                </div>
              ))}

              {/* Add item */}
              <div className="flex gap-2 mt-3">
                <select onChange={e=>{if(e.target.value){addInvoiceItem(e.target.value);e.target.value="";}}} className="flex-1 px-2 py-1.5 rounded border border-gray-200 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-400" defaultValue="">
                  <option value="">+ Add item from catalog...</option>
                  <optgroup label="Surgical Guides">{PRICE_LIST.filter(p=>p.cat==="guide").map(p=><option key={p.code} value={p.code}>{p.name} — {fmtEur(p.price)}</option>)}</optgroup>
                  <optgroup label="Crowns & Bridges">{PRICE_LIST.filter(p=>["crown","bridge","crown_implant","zirconia_full","bridge_full"].includes(p.cat)).map(p=><option key={p.code} value={p.code}>{p.name} — {fmtEur(p.price)}</option>)}</optgroup>
                  <optgroup label="Full-Arch & Titanium">{PRICE_LIST.filter(p=>["all_on_x","ti_bar","ti_steg","overdenture"].includes(p.cat)).map(p=><option key={p.code} value={p.code}>{p.name} — {fmtEur(p.price)}</option>)}</optgroup>
                  <optgroup label="Dentures & Splints">{PRICE_LIST.filter(p=>["splint","denture","try_in","provisional"].includes(p.cat)).map(p=><option key={p.code} value={p.code}>{p.name} — {fmtEur(p.price)}</option>)}</optgroup>
                  <optgroup label="Digital & Add-ons">{PRICE_LIST.filter(p=>p.cat==="addon").map(p=><option key={p.code} value={p.code}>{p.name} — {fmtEur(p.price)}</option>)}</optgroup>
                  <optgroup label="Components">{PRICE_LIST.filter(p=>p.cat==="component").map(p=><option key={p.code} value={p.code}>{p.name} — {fmtEur(p.price)}</option>)}</optgroup>
                  <optgroup label="Services">{PRICE_LIST.filter(p=>p.cat==="service").map(p=><option key={p.code} value={p.code}>{p.name} — {fmtEur(p.price)}</option>)}</optgroup>
                </select>
                <button onClick={()=>addInvoiceItem(null)} className="px-3 py-1.5 rounded bg-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-300 transition">+ Blank</button>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-4">
              <div className="w-72 bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Subtotal</span><span className="font-medium">{fmtEur(invoiceSubtotal)}</span></div>
                <div className="flex justify-between text-sm mb-2 items-center"><span className="text-gray-500 flex items-center gap-1">{invoice.vatExempt?<span className="text-green-600 text-xs font-semibold">VAT Exempt (NL Healthcare)</span>:<>VAT <input type="number" min="0" max="100" step="1" value={invoice.vatRate} onChange={e=>setInvoice(p=>({...p,vatRate:parseFloat(e.target.value)||0}))} className="w-12 px-1 py-0.5 rounded border border-gray-200 text-xs text-center outline-none"/>%</>}</span><span className="font-medium">{fmtEur(invoiceVat)}</span></div>
                <div className="flex justify-between text-lg font-bold text-gray-800 border-t-2 border-gray-300 pt-2"><span>Total</span><span>{fmtEur(invoiceTotal)}</span></div>
                {invoice.vatExempt&&<button onClick={()=>setInvoice(p=>({...p,vatExempt:false,vatRate:21}))} className="text-[10px] text-blue-500 hover:underline mt-1">Override: apply VAT</button>}
                {!invoice.vatExempt&&invoice.vatRate>0&&<button onClick={()=>setInvoice(p=>({...p,vatExempt:true,vatRate:0}))} className="text-[10px] text-blue-500 hover:underline mt-1">Set as VAT exempt (NL healthcare)</button>}
              </div>
            </div>

            {/* Bank & Payment details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <label className="block text-xs font-semibold text-blue-700 mb-2">Bank Details</label>
                <div className="grid grid-cols-2 gap-2">
                  <FormInput label="Bank Name" value={invoice.bankName} onChange={e=>setInvoice(p=>({...p,bankName:e.target.value}))} placeholder="e.g. ING Bank"/>
                  <FormInput label="IBAN" value={invoice.iban} onChange={e=>setInvoice(p=>({...p,iban:e.target.value}))} placeholder="NL00 INGB 0000 0000 00"/>
                  <FormInput label="BIC/SWIFT" value={invoice.bic} onChange={e=>setInvoice(p=>({...p,bic:e.target.value}))} placeholder="INGBNL2A"/>
                  <FormInput label="Payment Terms" value={invoice.paymentTerms} onChange={e=>setInvoice(p=>({...p,paymentTerms:e.target.value}))}/>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <label className="block text-xs font-semibold text-blue-700 mb-2">Business Registration</label>
                <div className="grid grid-cols-2 gap-2">
                  <FormInput label="KvK Number" value={invoice.kvk} onChange={e=>setInvoice(p=>({...p,kvk:e.target.value}))} placeholder="12345678"/>
                  <FormInput label="BTW-ID (VAT)" value={invoice.btw} onChange={e=>setInvoice(p=>({...p,btw:e.target.value}))} placeholder="NL000000000B01"/>
                </div>
                <div className="mt-2"><label className="block text-xs font-semibold text-gray-500 mb-1">Invoice Notes</label>
                  <textarea value={invoice.notes} onChange={e=>setInvoice(p=>({...p,notes:e.target.value}))} rows={2} placeholder="Optional notes for the client..." className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-y"/></div>
              </div>
            </div>

            {/* Invoice download */}
            <button onClick={handleDownloadInvoice} disabled={invoice.items.length===0||!invoice.items.some(i=>i.name)} className="px-6 py-3 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-40 transition shadow-sm">💰 Invoice only</button>
            <p className="text-xs text-gray-400 mt-2">Or use the <strong>MDR + Invoice</strong> button above for a combined single PDF.</p>
          </div>
        </div>}
      </div>

      <div className="flex justify-between mt-5">
        <button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium text-sm disabled:opacity-30 hover:bg-gray-50 transition">← Back</button>
        {step<4&&<button onClick={()=>canProceed()&&setStep(step+1)} disabled={!canProceed()} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 transition shadow-sm">Continue →</button>}
      </div>
    </div>
  );
}
