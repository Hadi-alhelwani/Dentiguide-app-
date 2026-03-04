'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase-browser';
import Link from 'next/link';

const supabase = createClient();

// Icons as inline SVGs to avoid dependencies
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Form: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Cases: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  Clinics: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  SignOut: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Tooth: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 3 1 4.5C8 14 8 16 7.5 19c-.3 1.5.5 3 2 3s2-1 2.5-2.5c.3-1 .5-1.5 0-1.5s-.3.5 0 1.5c.5 1.5 1 2.5 2.5 2.5s2.3-1.5 2-3C16 16 16 14 17 11.5c.5-1.5 1-3 1-4.5C18 4.5 15.5 2 12 2z"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Clinic: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Revenue: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Arrow: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Guide: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
};

const DEVICE_LABELS = {
  surgical_guide_3d: 'Surgical Guide',
  crown_3d: 'Crown (3D)',
  bridge_3d: 'Bridge (3D)',
  crown_zirconia: 'Crown (Zirconia)',
  bridge_zirconia: 'Bridge (Zirconia)',
  splint_3d: 'Splint',
  denture_base_3d: 'Denture Base',
};

const STATUS_COLORS = {
  pending:    { bg: 'rgba(251,191,36,0.12)', text: '#F59E0B', dot: '#F59E0B' },
  production: { bg: 'rgba(59,130,246,0.12)', text: '#3B82F6', dot: '#3B82F6' },
  completed:  { bg: 'rgba(16,185,129,0.12)', text: '#10B981', dot: '#10B981' },
  shipped:    { bg: 'rgba(139,92,246,0.12)', text: '#8B5CF6', dot: '#8B5CF6' },
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, clinics: 0, revenue: 0 });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);
      await loadData();
    };
    init();
  }, []);

  const loadData = async () => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [{ count: total }, { count: thisMonth }, { data: cases }] = await Promise.all([
        supabase.from('cases').select('*', { count: 'exact', head: true }),
        supabase.from('cases').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
        supabase.from('cases').select('*').order('created_at', { ascending: false }).limit(8),
      ]);

      const clinicSet = new Set((cases || []).map(c => c.clinic_name).filter(Boolean));

      setStats({
        total: total || 0,
        thisMonth: thisMonth || 0,
        clinics: clinicSet.size,
        revenue: (total || 0) * 185,
      });
      setRecentCases(cases || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatRevenue = (n) => `€${n.toLocaleString('de-DE')}`;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard, href: '/dashboard' },
    { id: 'new-mdr',   label: 'New MDR Form', icon: Icons.Form,      href: '/new' },
    { id: 'cases',     label: 'Cases',        icon: Icons.Cases,     href: '/cases' },
    { id: 'clinics',   label: 'Clinics',      icon: Icons.Clinics,   href: '/clinics' },
    { id: 'settings',  label: 'Settings',     icon: Icons.Settings,  href: '/settings' },
  ];

  const kpis = [
    {
      label: 'Total Cases',
      value: stats.total,
      icon: Icons.Tooth,
      trend: '+12%',
      trendUp: true,
      sub: 'All time',
      accent: '#00C9A7',
      gradient: 'linear-gradient(135deg, rgba(0,201,167,0.15) 0%, rgba(0,201,167,0.03) 100%)',
    },
    {
      label: 'This Month',
      value: stats.thisMonth,
      icon: Icons.Calendar,
      trend: '+8%',
      trendUp: true,
      sub: 'vs last month',
      accent: '#3B82F6',
      gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.03) 100%)',
    },
    {
      label: 'Active Clinics',
      value: stats.clinics,
      icon: Icons.Clinic,
      trend: '+2',
      trendUp: true,
      sub: 'Unique partners',
      accent: '#8B5CF6',
      gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.03) 100%)',
    },
    {
      label: 'Est. Revenue',
      value: formatRevenue(stats.revenue),
      icon: Icons.Revenue,
      trend: '+15%',
      trendUp: true,
      sub: '@ €185 avg/case',
      accent: '#F59E0B',
      gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.03) 100%)',
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F4F8', fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 240,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0B1628 0%, #0D1F3C 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        boxShadow: '4px 0 24px rgba(0,0,0,0.2)',
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #00C9A7, #00A688)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,201,167,0.35)',
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 3 1 4.5C8 14 8 16 7.5 19c-.3 1.5.5 3 2 3s2-1 2.5-2.5c.3-1 .5-1.5 0-1.5s-.3.5 0 1.5c.5 1.5 1 2.5 2.5 2.5s2.3-1.5 2-3C16 16 16 14 17 11.5c.5-1.5 1-3 1-4.5C18 4.5 15.5 2 12 2z"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, letterSpacing: '-0.3px', lineHeight: 1.2 }}>DentiGuide</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: '0.5px', textTransform: 'uppercase' }}>MDR System</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 12px 10px' }}>
            Navigation
          </div>
          {navItems.map(item => {
            const isActive = item.id === activeNav;
            return (
              <Link key={item.id} href={item.href} onClick={() => setActiveNav(item.id)} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 8, marginBottom: 2,
                  background: isActive ? 'linear-gradient(135deg, rgba(0,201,167,0.2), rgba(0,201,167,0.08))' : 'transparent',
                  color: isActive ? '#00C9A7' : 'rgba(255,255,255,0.55)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderLeft: isActive ? '2px solid #00C9A7' : '2px solid transparent',
                }}>
                  <item.icon />
                  {item.label}
                  {item.id === 'new-mdr' && (
                    <span style={{
                      marginLeft: 'auto', background: '#00C9A7', color: '#0B1628',
                      fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 20,
                      letterSpacing: '0.5px', textTransform: 'uppercase',
                    }}>New</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User + Sign out */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {user && (
            <div style={{ padding: '8px 12px', marginBottom: 8, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 2 }}>Signed in as</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          )}
          <button onClick={handleSignOut} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '10px 12px', borderRadius: 8,
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.4)', fontSize: 14, cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.background = 'rgba(255,107,107,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Icons.SignOut />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ marginLeft: 240, flex: 1, padding: '32px 36px', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#0B1628', letterSpacing: '-0.5px' }}>
              Dashboard
            </h1>
            <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: 14 }}>
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Link href="/mdr-form" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #00C9A7, #00A688)',
              color: '#fff', border: 'none', borderRadius: 10,
              padding: '12px 20px', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,201,167,0.35)',
              letterSpacing: '-0.2px',
            }}>
              <Icons.Plus />
              New MDR Form
            </button>
          </Link>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
          {kpis.map((kpi, i) => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: 14,
              padding: '22px 22px 18px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)'; }}
            >
              {/* Background accent */}
              <div style={{
                position: 'absolute', top: 0, right: 0, width: 100, height: 100,
                background: kpi.gradient, borderRadius: '0 14px 0 100%',
              }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, position: 'relative' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  {kpi.label}
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: kpi.gradient, border: `1.5px solid ${kpi.accent}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: kpi.accent,
                }}>
                  <kpi.icon />
                </div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: '#0B1628', letterSpacing: '-1px', marginBottom: 8, lineHeight: 1 }}>
                {loading ? (
                  <div style={{ width: 60, height: 30, background: '#F1F5F9', borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
                ) : kpi.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  fontSize: 12, fontWeight: 600,
                  color: kpi.trendUp ? '#10B981' : '#EF4444',
                  background: kpi.trendUp ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  padding: '2px 7px', borderRadius: 20,
                }}>
                  <Icons.TrendUp />
                  {kpi.trend}
                </span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{kpi.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Cases */}
        <div style={{
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0B1628', letterSpacing: '-0.3px' }}>Recent Cases</h2>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: '#94A3B8' }}>Latest MDR documentation records</p>
            </div>
            <Link href="/cases" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#F8FAFC', border: '1px solid #E2E8F0',
                borderRadius: 8, padding: '8px 14px', fontSize: 13,
                color: '#475569', fontWeight: 500, cursor: 'pointer',
              }}>
                View all <Icons.Arrow />
              </button>
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
              Loading cases...
            </div>
          ) : recentCases.length === 0 ? (
            <div style={{ padding: '60px 40px', textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(0,201,167,0.12), rgba(0,201,167,0.04))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', color: '#00C9A7',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#334155' }}>No cases yet</p>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: '#94A3B8' }}>Create your first MDR form to get started</p>
              <Link href="/mdr-form" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #00C9A7, #00A688)',
                  color: '#fff', border: 'none', borderRadius: 8,
                  padding: '10px 20px', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                }}>
                  + Create first MDR form
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Case ID', 'Patient', 'Clinic', 'Device Type', 'Date', 'Status'].map(h => (
                      <th key={h} style={{
                        padding: '11px 20px', textAlign: 'left',
                        fontSize: 11, fontWeight: 700, color: '#94A3B8',
                        textTransform: 'uppercase', letterSpacing: '0.7px',
                        borderBottom: '1px solid #F1F5F9',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentCases.map((c, i) => {
                    const status = c.status || 'completed';
                    const sc = STATUS_COLORS[status] || STATUS_COLORS.completed;
                    return (
                      <tr key={c.id || i} style={{ borderBottom: '1px solid #F8FAFC', transition: 'background 0.1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FAFBFC'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#00C9A7', fontFamily: 'monospace' }}>
                            #{String(c.id || i + 1).padStart(4, '0')}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#1E293B' }}>
                            {c.patient_code || c.patient_name || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ fontSize: 13, color: '#475569' }}>
                            {c.clinic_name || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            fontSize: 12, fontWeight: 500, padding: '3px 10px',
                            borderRadius: 20, background: 'rgba(0,201,167,0.08)',
                            color: '#00A688', border: '1px solid rgba(0,201,167,0.15)',
                          }}>
                            {DEVICE_LABELS[c.device_type] || c.device_type || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ fontSize: 13, color: '#64748B' }}>
                            {formatDate(c.created_at)}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: 12, fontWeight: 500, padding: '4px 10px',
                            borderRadius: 20, background: sc.bg, color: sc.text,
                          }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 28, textAlign: 'center', color: '#CBD5E1', fontSize: 12 }}>
          DentiGuide GmbH · Kanalweg 2C, 48529 Nordhorn · EU MDR Annex XIII Documentation System
        </div>
      </main>

      <style>{`
  @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap");
  * { box-sizing: border-box; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
`}</style>
    </div>
  );
}
