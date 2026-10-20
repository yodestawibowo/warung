import React from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenFormAspirasi: () => void;
  onScrollToSimulasi: () => void;
  currentUser?: {
    name: string;
    role: string;
  } | null;
  onOpenLogin: () => void;
  onOpenUserDashboard: () => void;
  onNavigatePengaturan?: (sub: 'user' | 'opd' | 'misi') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenFormAspirasi,
  onScrollToSimulasi,
  currentUser,
  onOpenLogin,
  onOpenUserDashboard,
  onNavigatePengaturan,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Logo saja (tanpa teks judul) */}
          <button
            onClick={() => setActiveTab('rembuk')}
            className="flex items-center group cursor-pointer"
            title="Portal Perencanaan Pembangunan Daerah Kabupaten Tanggamus"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex items-center justify-center font-serif font-black text-sm sm:text-base shadow-xs group-hover:scale-105 transition-all border border-emerald-700/60 tracking-wider">
              WR
            </div>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('rembuk')}
              className={`transition-colors hover:text-stone-900 py-1 cursor-pointer ${
                activeTab === 'rembuk'
                  ? 'text-stone-950 font-semibold border-b-2 border-emerald-800'
                  : ''
              }`}
            >
              Aspirasi Multipihak
            </button>
            <button
              onClick={() => setActiveTab('csr')}
              className={`transition-colors hover:text-stone-900 py-1 cursor-pointer ${
                activeTab === 'csr'
                  ? 'text-stone-950 font-semibold border-b-2 border-emerald-800'
                  : ''
              }`}
            >
              Kemitraan CSR
            </button>
            <button
              onClick={() => setActiveTab('riset')}
              className={`transition-colors hover:text-stone-900 py-1 cursor-pointer ${
                activeTab === 'riset'
                  ? 'text-stone-950 font-semibold border-b-2 border-emerald-800'
                  : ''
              }`}
            >
              Rekomendasi Akademisi
            </button>
            <button
              onClick={() => setActiveTab('oms')}
              className={`transition-colors hover:text-stone-900 py-1 cursor-pointer ${
                activeTab === 'oms'
                  ? 'text-stone-950 font-semibold border-b-2 border-emerald-800'
                  : ''
              }`}
            >
              Inisiatif OMS
            </button>
            <button
              onClick={() => setActiveTab('konsultasi')}
              className={`transition-colors hover:text-stone-900 py-1 cursor-pointer ${
                activeTab === 'konsultasi'
                  ? 'text-stone-950 font-semibold border-b-2 border-emerald-800'
                  : ''
              }`}
            >
              Naskah RPJMD
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`transition-colors hover:text-stone-900 py-1 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-stone-950 font-semibold border-b-2 border-emerald-800'
                  : ''
              }`}
            >
              Data Sinergi
            </button>

            {/* Menu Pengaturan: Hanya tampil jika pengguna telah login */}
            {currentUser && (
              <div className="relative group">
                <button
                  type="button"
                  className={`transition-colors hover:text-stone-900 py-1 cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'user_dashboard'
                      ? 'text-stone-950 font-semibold border-b-2 border-emerald-800'
                      : ''
                  }`}
                >
                  <svg className="w-4 h-4 text-stone-500 group-hover:text-emerald-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Pengaturan</span>
                  <svg className="w-3 h-3 text-stone-400 group-hover:text-stone-800 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Sub-menu Dropdown */}
                <div className="absolute left-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-stone-200 py-2 hidden group-hover:block animate-fade-in z-50">
                  <div className="px-3.5 py-1.5 border-b border-stone-100 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-stone-400">
                    <span>Menu Pengaturan Sistem</span>
                    <span className="text-emerald-800 font-bold">Admin/OPD</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigatePengaturan ? onNavigatePengaturan('user') : onOpenUserDashboard()}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-stone-50 transition-colors flex items-start gap-3 cursor-pointer group/item"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover/item:bg-purple-200 transition-colors">
                      👤
                    </div>
                    <div>
                      <strong className="block text-stone-900 text-xs font-semibold group-hover/item:text-emerald-900">
                        Kelola & Tambah User
                      </strong>
                      <span className="text-[11px] text-stone-500 leading-tight block mt-0.5">
                        Manajemen hak akses aparatur, verifikator OPD & mitra
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigatePengaturan ? onNavigatePengaturan('opd') : onOpenUserDashboard()}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-stone-50 transition-colors flex items-start gap-3 cursor-pointer group/item border-t border-stone-50"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover/item:bg-emerald-200 transition-colors">
                      🏛️
                    </div>
                    <div>
                      <strong className="block text-stone-900 text-xs font-semibold group-hover/item:text-emerald-900">
                        Unit Kerja / Perangkat Daerah (OPD)
                      </strong>
                      <span className="text-[11px] text-stone-500 leading-tight block mt-0.5">
                        Pengaturan tambah, edit, dan hapus master data OPD
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigatePengaturan ? onNavigatePengaturan('misi') : onOpenUserDashboard()}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-stone-50 transition-colors flex items-start gap-3 cursor-pointer group/item border-t border-stone-50"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover/item:bg-amber-200 transition-colors">
                      🎯
                    </div>
                    <div>
                      <strong className="block text-stone-900 text-xs font-semibold group-hover/item:text-emerald-900">
                        Misi RPJMD Daerah
                      </strong>
                      <span className="text-[11px] text-stone-500 leading-tight block mt-0.5">
                        Pengaturan tambah, edit, dan hapus rumusan Misi RPJMD
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* Zone 3: Actions including Kirim Aspirasi (hanya setelah login) dan Login Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={onScrollToSimulasi}
              className="hidden xl:inline-flex px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Simulasi
            </button>

            {/* Kirim Aspirasi: Hanya tampil jika sudah login */}
            {currentUser && (
              <button
                onClick={onOpenFormAspirasi}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white bg-emerald-900 hover:bg-emerald-950 rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              >
                + Kirim Aspirasi
              </button>
            )}

            {/* Login / User Dashboard button right next to Kirim Aspirasi */}
            {currentUser ? (
              <button
                onClick={onOpenUserDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                title="Buka Dasbor Petugas"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                <span className="hidden sm:inline font-mono text-[10px] text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                  Dasbor
                </span>
              </button>
            ) : (
              <button
                onClick={activeTab === 'login' ? () => setActiveTab('rembuk') : onOpenLogin}
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-emerald-900 text-white border border-emerald-950 hover:bg-emerald-800'
                    : 'text-stone-800 bg-white hover:bg-stone-100 border border-stone-300'
                }`}
                title={activeTab === 'login' ? 'Klik untuk kembali ke Beranda Portal' : 'Masuk ke Portal Aparatur'}
              >
                {activeTab === 'login' ? (
                  <>
                    <span>← Kembali ke Portal</span>
                  </>
                ) : (
                  <span>Masuk (Login)</span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile secondary navigation scroll */}
        <div className="lg:hidden flex items-center gap-4 overflow-x-auto py-2.5 border-t border-stone-200 text-xs font-medium text-stone-600 no-scrollbar whitespace-nowrap">
          <button
            onClick={() => setActiveTab('rembuk')}
            className={`cursor-pointer ${activeTab === 'rembuk' ? 'text-emerald-900 font-bold' : 'hover:text-stone-900'}`}
          >
            Aspirasi Warga
          </button>
          <span className="text-stone-300">/</span>
          <button
            onClick={() => setActiveTab('csr')}
            className={`cursor-pointer ${activeTab === 'csr' ? 'text-emerald-900 font-bold' : 'hover:text-stone-900'}`}
          >
            Kemitraan Swasta
          </button>
          <span className="text-stone-300">/</span>
          <button
            onClick={() => setActiveTab('riset')}
            className={`cursor-pointer ${activeTab === 'riset' ? 'text-emerald-900 font-bold' : 'hover:text-stone-900'}`}
          >
            Kajian Akademisi
          </button>
          <span className="text-stone-300">/</span>
          <button
            onClick={() => setActiveTab('oms')}
            className={`cursor-pointer ${activeTab === 'oms' ? 'text-emerald-900 font-bold' : 'hover:text-stone-900'}`}
          >
            Gerakan OMS
          </button>
          <span className="text-stone-300">/</span>
          <button
            onClick={() => setActiveTab('konsultasi')}
            className={`cursor-pointer ${activeTab === 'konsultasi' ? 'text-emerald-900 font-bold' : 'hover:text-stone-900'}`}
          >
            Dokumen RPJMD
          </button>
          <span className="text-stone-300">/</span>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`cursor-pointer ${activeTab === 'dashboard' ? 'text-emerald-900 font-bold' : 'hover:text-stone-900'}`}
          >
            Statistik Sinergi
          </button>
          {currentUser && (
            <>
              <span className="text-stone-300">/</span>
              <button
                onClick={() => onNavigatePengaturan ? onNavigatePengaturan('user') : onOpenUserDashboard()}
                className="text-purple-900 font-semibold"
              >
                ⚙ Kelola User
              </button>
              <span className="text-stone-300">/</span>
              <button
                onClick={() => onNavigatePengaturan ? onNavigatePengaturan('opd') : onOpenUserDashboard()}
                className="text-emerald-900 font-semibold"
              >
                🏛 Pengaturan OPD
              </button>
              <span className="text-stone-300">/</span>
              <button
                onClick={() => onNavigatePengaturan ? onNavigatePengaturan('misi') : onOpenUserDashboard()}
                className="text-amber-900 font-semibold"
              >
                🎯 Misi RPJMD
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
