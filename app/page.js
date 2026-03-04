'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#041D40', fontFamily: "'Montserrat', 'Segoe UI', sans-serif" }}>

      {/* Top mint gradient line */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #12D7D0, #ADFBF9, #12D7D0)' }} />

      {/* Header */}
      <header style={{ background: 'rgba(4,29,64,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 50, padding: '0 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #12D7D0, #0aa8a2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(18,215,208,0.35)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 3 1 4.5C8 14 8 16 7.5 19c-.3 1.5.5 3 2 3s2-1 2.5-2.5c.3-1 .5-1.5 0-1.5s-.3.5 0 1.5c.5 1.5 1 2.5 2.5 2.5s2.3-1.5 2-3C16 16 16 14 17 11.5c.5-1.5 1-3 1-4.5C18 4.5 15.5 2 12 2z"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1.1 }}>DentiGuide</div>
              <div style={{ color: 'rgba(18,215,208,0.6)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>Implanting Excellence, Digitally Perfected</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 500, padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>
                Sign In
              </button>
            </Link>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button style={{ background: '#12D7D0', color: '#041D40', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(18,215,208,0.35)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                Generate Statement
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 40px 120px' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'radial-gradient(circle, #12D7D0 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #041D40 0%, rgba(4,29,64,0.95) 60%, rgba(10,45,90,0.8) 100%)' }} />
        <div style={{ position: 'absolute', top: -100, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(18,215,208,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(18,215,208,0.1)', color: '#12D7D0', border: '1px solid rgba(18,215,208,0.2)', borderRadius: 100, padding: '8px 16px', fontSize: 13, fontWeight: 600, marginBottom: 32 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            EU MDR 2017/745 Compliant
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 24, maxWidth: 700, textTransform: 'uppercase' }}>
            MDR Statements for{' '}
            <span style={{ color: '#12D7D0' }}>Custom-Made</span>{' '}
            Dental Devices
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 520, marginBottom: 48 }}>
            Generate compliant Annex XIII statements for surgical guides, crowns, and bridges in seconds. Designed for dental laboratories operating in the EU.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button style={{ background: '#12D7D0', color: '#041D40', border: 'none', borderRadius: 10, padding: '16px 36px', fontSize: 16, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 0 30px rgba(18,215,208,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
                Start Generating
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Under 60 seconds per statement</span>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, #041D40, transparent)' }} />
      </section>

      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #12D7D0, transparent)' }} />

      {/* Features */}
      <section style={{ background: '#EDF2F3', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: '#12D7D0', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Why DentiGuide</p>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#041D40', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 16 }}>Fast, Compliant Documentation</h2>
            <p style={{ color: 'rgba(41,47,55,0.6)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7, fontSize: 15 }}>
              Every custom-made dental device must be accompanied by a statement per EU MDR Annex XIII, Section 1. This tool makes it effortless.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 64 }}>
            {[
              { icon: '⚡', title: 'Under 60 Seconds', desc: 'Select clinic, device, patient — download a legally compliant PDF. No manual typing. No errors.' },
              { icon: '🛡️', title: 'Always Compliant', desc: 'MDR classifications, Annex XIII fields, CE data, IFU references — all pre-filled and up to date.' },
              { icon: '📄', title: 'Print-Ready PDF', desc: 'Professional A4 output with your branding, ready to accompany each device delivery.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 32, border: '1px solid rgba(18,215,208,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(18,215,208,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 20 }}>{f.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#041D40', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(41,47,55,0.6)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            <div>
              <p style={{ color: '#12D7D0', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Supported Devices</p>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: '#041D40', textTransform: 'uppercase', marginBottom: 28 }}>Device Types</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { title: 'Surgical Guides', desc: '3D printed guides for implant placement — Class I, Rule 5' },
                  { title: 'Crowns', desc: '3D printed or milled — Class IIa, Rule 8' },
                  { title: 'Bridges', desc: 'Multi-unit restorations — Class IIa, Rule 8' },
                  { title: 'Zirconia Restorations', desc: 'Milled zirconia crowns and bridges' },
                  { title: 'Titanium Bars', desc: 'Implant-supported, Class IIa, 15yr retention' },
                  { title: 'Ti-Bar Dentures', desc: 'All-on-X screw-retained prostheses' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(18,215,208,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#12D7D0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#041D40', fontSize: 14, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{item.title}</p>
                      <p style={{ fontSize: 13, color: 'rgba(41,47,55,0.55)', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {[
                  { num: '< 60s', label: 'Per Statement' },
                  { num: '9', label: 'Device Types' },
                  { num: '30+', label: 'CE Materials' },
                  { num: '100%', label: 'MDR Annex XIII' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#041D40', borderRadius: 14, padding: '24px 20px', border: '1px solid rgba(18,215,208,0.15)', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#12D7D0', marginBottom: 4 }}>{s.num}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(4,29,64,0.05)', borderRadius: 14, padding: 20, border: '1px solid rgba(4,29,64,0.1)' }}>
                <p style={{ fontSize: 13, color: 'rgba(41,47,55,0.65)', lineHeight: 1.7 }}>
                  <strong style={{ color: '#041D40' }}>Regulatory Note:</strong> Custom-made dental devices do not require CE marking or UDI. They must be labeled as "Custom-made medical device" and accompanied by this statement per EU MDR Annex XIII.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scanner brands */}
      <section style={{ background: '#EDF2F3', padding: '20px 40px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#12D7D0', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>For Dental Clinics</p>
          <h3 style={{ fontSize: 28, fontWeight: 800, color: '#041D40', textTransform: 'uppercase', marginBottom: 12 }}>Upload Your Scans</h3>
          <p style={{ color: 'rgba(41,47,55,0.6)', maxWidth: 500, margin: '0 auto 32px', fontSize: 14, lineHeight: 1.7 }}>
            Step-by-step export guides for every major scanner brand. Remote assistance available.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Medit', 'iTero', '3Shape', 'Straumann', 'Dentsply Sirona', 'CBCT / DICOM'].map((brand) => (
              <div key={brand} style={{ background: '#fff', borderRadius: 10, padding: '10px 18px', border: '1px solid rgba(18,215,208,0.15)', fontSize: 13, fontWeight: 700, color: '#041D40' }}>
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', background: 'linear-gradient(135deg, #041D40 0%, #0a2d5c 50%, #041D40 100%)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(circle, #12D7D0 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 16 }}>Ready to Generate?</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 40, lineHeight: 1.7, fontSize: 15 }}>
            Set up your manufacturer details once, then generate compliant statements for every device in seconds.
          </p>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{ background: '#12D7D0', color: '#041D40', border: 'none', borderRadius: 10, padding: '16px 40px', fontSize: 16, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 0 30px rgba(18,215,208,0.4)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Generate Statement Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </Link>
        </div>
      </section>

      <div style={{ height: 2, background: 'linear-gradient(90deg, #12D7D0, #ADFBF9, #12D7D0)' }} />

      {/* Footer */}
      <footer style={{ background: '#041D40', padding: '40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #12D7D0, #0aa8a2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 3 1 4.5C8 14 8 16 7.5 19c-.3 1.5.5 3 2 3s2-1 2.5-2.5c.3-1 .5-1.5 0-1.5s-.3.5 0 1.5c.5 1.5 1 2.5 2.5 2.5s2.3-1.5 2-3C16 16 16 14 17 11.5c.5-1.5 1-3 1-4.5C18 4.5 15.5 2 12 2z"/></svg>
            </div>
            <div>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>DentiGuide</span>
              <p style={{ color: 'rgba(18,215,208,0.4)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Implanting Excellence, Digitally Perfected</p>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Based on Regulation (EU) 2017/745, Annex XIII</p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Kanalweg 2C, 48529 Nordhorn, Germany</p>
        </div>
      </footer>
    </div>
  );
}