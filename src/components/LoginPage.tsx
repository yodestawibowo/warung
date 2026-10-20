import React, { useState } from 'react';
import { UserAccount } from '../types';

interface LoginPageProps {
  usersList?: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onBackToPortal: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ usersList = [], onLoginSuccess, onBackToPortal }) => {
  const [email, setEmail] = useState('bidangpme@gmail.com');
  const [password, setPassword] = useState('pemerintah2026');
  const [selectedRole, setSelectedRole] = useState<'bapperida_admin' | 'bappeda_admin' | 'opd_verifikator' | 'pemangku_kepentingan'>('bapperida_admin');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Quick preset accounts for testing
  const presets = [
    {
      role: 'bapperida_admin' as const,
      name: 'Tim Bidang PME (Bapperida)',
      email: 'bidangpme@gmail.com',
      agency: 'Bapperida Litbang Daerah - Bidang PME',
      nip: '19840315 200801 1 003',
      desc: 'Administrator Perencanaan, Pengendalian & Evaluasi RPJMD'
    },
    {
      role: 'opd_verifikator' as const,
      name: 'Dra. Endang Sulistyowati, M.M.',
      email: 'verifikator.opd@daerah.go.id',
      agency: 'Dinas Koperasi, Perindustrian dan Perdagangan',
      nip: '19790512 200501 2 006',
      desc: 'Tim Verifikator Teknis Telaah Usulan OPD'
    },
    {
      role: 'pemangku_kepentingan' as const,
      name: 'Dr. Retno Wulandari',
      email: 'retno.akademisi@kampus.ac.id',
      agency: 'Pusat Studi Pembangunan LPPM Universitas',
      nip: 'NIDN: 0015088201',
      desc: 'Delegasi Akademisi / Peneliti & Mitra CSR'
    }
  ];

  const handleSelectPreset = (preset: typeof presets[0]) => {
    setEmail(preset.email);
    setSelectedRole(preset.role);
    setPassword('pemerintah2026');
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Silakan lengkapi surel dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const fromDynamicList = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
      const existing = fromDynamicList || presets.find((p) => p.email.toLowerCase() === email.toLowerCase());
      const accountData = existing || {
        role: selectedRole,
        name: email.split('@')[0].toUpperCase(),
        email: email,
        agency: selectedRole === 'bapperida_admin' || selectedRole === 'bappeda_admin' ? 'Bapperida Litbang Daerah' : selectedRole === 'opd_verifikator' ? 'Dinas Teknis Terkait' : 'Mitra Pemangku Kepentingan',
        nip: '19870101 201001 1 001',
        desc: 'Pengguna Terdaftar WARUNG RIMBUN'
      };

      const userAccount: UserAccount = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: accountData.name,
        email: accountData.email,
        role: accountData.role === 'bappeda_admin' ? 'bapperida_admin' : accountData.role,
        agency: accountData.agency,
        nip: accountData.nip,
        lastLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      setIsLoading(false);
      onLoginSuccess(userAccount);
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Return button */}
      <div className="mb-6">
        <button
          onClick={onBackToPortal}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-md transition-colors shadow-2xs"
        >
          ← Kembali ke Portal Publik
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Editorial Banner */}
        <div className="lg:col-span-5 bg-stone-900 text-stone-200 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-emerald-400 mb-2">
              <span className="bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 text-emerald-300 font-bold">WARUNG RIMBUN</span>
              <span aria-hidden="true">·</span>
              <span>2025–2029</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight mb-3">
              Portal Akses Terpadu Aparatur & Pemangku Kebijakan
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              Wadah Urun Rembuk Perencanaan dan Inovasi Pembangunan — Kanal resmi penelaahan teknis OPD, validasi program Renja/RKPD, kurasi usulan CSR non-APBD, dan rekapitulasi berita acara Musrenbang.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-800/80 space-y-3">
            <div className="text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-mono">Keamanan & Otorisasi</span>
              <span className="text-stone-200 font-medium">Single Sign-On (SSO) Pemerintahan Terintegrasi</span>
            </div>
            <div className="text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-mono">Helpdesk Bapperida</span>
              <span className="text-stone-300 font-mono text-[11px]">bidangpme@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Masuk ke Dasbor Pengelola
              </h3>
              <span className="text-[11px] font-mono text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Akses Terverifikasi
              </span>
            </div>

            {/* Penjelasan Akses Menu Berizin */}
            <div className="mb-4 p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-emerald-950 text-xs flex items-start gap-2.5">
              <span className="text-base shrink-0">ℹ️</span>
              <div className="space-y-0.5">
                <p className="font-semibold text-emerald-900">
                  Mengapa menu tertentu belum bisa diakses?
                </p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Menu manajerial seperti <strong>Kelola User</strong>, <strong>Pengaturan OPD</strong>, dan <strong>Misi RPJMD</strong> terkunci di balik otentikasi demi keamanan data daerah. Silakan klik salah satu akun demo di bawah untuk <strong>langsung masuk instan</strong> ke Dasbor Pengelola.
                </p>
              </div>
            </div>

            {/* Quick Preset Selector with 1-Click Instant Login */}
            <div className="mb-5 bg-stone-50 p-3 rounded-lg border border-stone-200/90 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-stone-700 text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Pilih Akun Demo (Klik Untuk Langsung Masuk):
                </span>
                <span className="text-[10px] text-emerald-800 font-medium">1-Klik Akses Instan</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {presets.map((preset) => (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => {
                      handleSelectPreset(preset);
                      // Auto-login directly on click for convenience
                      setIsLoading(true);
                      setTimeout(() => {
                        const userAccount: UserAccount = {
                          id: `USR-${Date.now().toString().slice(-4)}`,
                          name: preset.name,
                          email: preset.email,
                          role: preset.role,
                          agency: preset.agency,
                          nip: preset.nip,
                          lastLogin: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                        };
                        setIsLoading(false);
                        onLoginSuccess(userAccount);
                      }, 250);
                    }}
                    className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer hover:shadow-xs group ${
                      selectedRole === preset.role && email === preset.email
                        ? 'bg-emerald-900 text-white border-emerald-950 font-medium shadow-sm ring-2 ring-emerald-600'
                        : 'bg-white text-stone-800 border-stone-200 hover:border-emerald-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[11px] leading-tight truncate">
                        {preset.name.split('(')[0]}
                      </p>
                      <span className="text-[10px] text-emerald-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        Masuk →
                      </span>
                    </div>
                    <p className={`text-[10px] truncate mt-1 ${selectedRole === preset.role && email === preset.email ? 'text-emerald-200' : 'text-stone-500'}`}>
                      {preset.role === 'bapperida_admin' ? 'Admin Bapperida PME' : preset.role === 'opd_verifikator' ? 'Verifikator OPD' : 'Akademisi / Mitra'}
                    </p>
                    <div className="mt-2 pt-1.5 border-t border-stone-100/50 flex items-center justify-between text-[10px]">
                      <span className={`font-mono text-[9px] ${selectedRole === preset.role && email === preset.email ? 'text-emerald-300' : 'text-emerald-700 font-semibold'}`}>
                        ⚡ Klik Masuk
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800 text-xs">
                {errorMsg}
              </div>
            )}
            {infoMsg && (
              <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs">
                {infoMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Alamat Surel (Email) Resmi *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@daerah.go.id atau email terdaftar"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-stone-700 font-semibold">Kata Sandi (Password) *</label>
                  <button
                    type="button"
                    onClick={() => setInfoMsg('Tautan instruksi pemulihan kata sandi telah dikirimkan ke email terdaftar.')}
                    className="text-[11px] text-emerald-900 hover:underline"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Tingkat Wewenang / Peran Akses *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as any)}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                >
                  <option value="bapperida_admin">Bapperida - Pengendalian, Monitoring & Evaluasi (PME)</option>
                  <option value="opd_verifikator">OPD / Dinas Teknis - Penelaah Rencana Kerja (Renja)</option>
                  <option value="pemangku_kepentingan">Pemangku Kepentingan - Mitra CSR / Kampus / OMS</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-950 text-white rounded font-semibold text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Mengotentikasi Akun...</span>
                    </>
                  ) : (
                    'Masuk ke Dasbor Kerja'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="pt-6 border-t border-stone-200 mt-6 text-[11px] text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Bapperida Litbang Daerah © 2026</span>
            <span>Amanat UU No. 25/2004 tentang SPPN</span>
          </div>
        </div>
      </div>
    </div>
  );
};
