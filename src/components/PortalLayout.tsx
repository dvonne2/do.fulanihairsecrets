import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiCall, logout } from '@/lib/api';
import {
  LayoutDashboard, ShoppingBag, DollarSign, Wallet, Link2,
  LogOut, Menu, X, ChevronRight
} from 'lucide-react';

interface SessionInfo {
  authenticated: boolean;
  user: string;
  name: string;
  role: string;
  portal: string;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/earnings', label: 'Earnings', icon: DollarSign },
  { path: '/payouts', label: 'Payouts', icon: Wallet },
  { path: '/links', label: 'Links', icon: Link2 },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    (async () => {
      const result = await apiCall<SessionInfo>(
        'vitalvida.api.media_buyer.check_session',
        undefined,
        { httpMethod: 'GET' }
      );
      if (result.ok && result.data?.name) {
        setUserName(result.data.name);
        const parts = result.data.name.split(' ');
        setUserInitials(parts.map((p: string) => p[0]).join('').slice(0, 2).toUpperCase());
      }
    })();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="portal-layout min-h-screen bg-[#050505] flex">
      {/* ═══ Animated background particles ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] animate-float" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.03)_0%,transparent_70%)]" style={{ animationDelay: '2s', animationDuration: '6s' }} />
      </div>

      {/* ═══ Desktop Sidebar ═══ */}
      <aside className="hidden lg:flex flex-col w-[260px] min-h-screen border-r border-white/[0.06] bg-black/40 backdrop-blur-xl fixed left-0 top-0 z-30">
        {/* Brand */}
        <div className="px-6 py-8 border-b border-white/[0.06]">
          <h2 className="text-lg font-cinzel tracking-[0.25em] text-[#d4af37] uppercase">VitalVida</h2>
          <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mt-1">Affiliate Portal</p>
        </div>

        {/* User */}
        <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b8860b] to-[#d4af37] flex items-center justify-center text-black font-bold text-sm font-sans">
            {userInitials || '••'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-sans truncate">{userName || 'Loading...'}</p>
            <p className="text-white/30 text-[10px] tracking-widest uppercase font-sans">Partner</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans transition-all duration-300 group relative ${
                  active
                    ? 'bg-[#d4af37]/10 text-[#d4af37]'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.03]'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#d4af37] rounded-r-full" />
                )}
                <Icon className={`w-[18px] h-[18px] transition-colors ${active ? 'text-[#d4af37]' : 'text-white/30 group-hover:text-white/50'}`} />
                <span className="tracking-wide">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#d4af37]/50" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span className="tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* ═══ Mobile Header ═══ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/[0.06] z-40 flex items-center justify-between px-4">
        <h2 className="text-sm font-cinzel tracking-[0.2em] text-[#d4af37] uppercase">VitalVida</h2>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ═══ Mobile Sidebar Overlay ═══ */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-[#0a0a0a] border-r border-white/[0.06] z-50 flex flex-col animate-slideIn">
            {/* Same nav items */}
            <div className="px-6 py-8 border-b border-white/[0.06]">
              <h2 className="text-lg font-cinzel tracking-[0.25em] text-[#d4af37] uppercase">VitalVida</h2>
              <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mt-1">Affiliate Portal</p>
            </div>
            <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b8860b] to-[#d4af37] flex items-center justify-center text-black font-bold text-sm font-sans">
                {userInitials || '••'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-sans truncate">{userName || 'Loading...'}</p>
                <p className="text-white/30 text-[10px] tracking-widest uppercase font-sans">Partner</p>
              </div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
                const active = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => { navigate(path); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans transition-all duration-300 ${
                      active ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'text-white/50 hover:text-white/80 hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] ${active ? 'text-[#d4af37]' : 'text-white/30'}`} />
                    <span className="tracking-wide">{label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-white/[0.06]">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300">
                <LogOut className="w-[18px] h-[18px]" />
                <span className="tracking-wide">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ═══ Main Content ═══ */}
      <main className="flex-1 lg:ml-[260px] relative z-10 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
