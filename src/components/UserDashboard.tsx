import React, { useState, useEffect, useRef } from 'react';
import { UserAccount, AspirasiPublik, KemitraanCSR, StatusTindakLanjut, KonsultasiAgenda, KonfirmasiKehadiranSidang, UnitKerjaOPD, MisiRPJMDItem, InisiatifOMS } from '../types';
import { MISI_LABELS } from '../data/mockData';
import { SidangMusrenbangManager } from './SidangMusrenbangManager';
import { PengaturanOpdManager } from './PengaturanOpdManager';
import { PengaturanMisiManager } from './PengaturanMisiManager';
import { PenyelarasanCsrManager } from './PenyelarasanCsrManager';
import { RuangInisiatifOmsManager } from './RuangInisiatifOmsManager';

interface UserDashboardProps {
  currentUser: UserAccount;
  usersList: UserAccount[];
  aspirasiList: AspirasiPublik[];
  csrPrograms: KemitraanCSR[];
  agendaList: KonsultasiAgenda[];
  kehadiranList: KonfirmasiKehadiranSidang[];
  opdList: UnitKerjaOPD[];
  misiList: MisiRPJMDItem[];
  inisiatifList: InisiatifOMS[];
  initialSubTab?: 'verifikasi' | 'sidang_musrenbang' | 'inisiatif_oms' | 'pengaturan_user' | 'pengaturan_opd' | 'pengaturan_misi' | 'rekapitulasi' | 'profil';
  onLogout: () => void;
  onUpdateAspirasiStatus: (
    id: string,
    newStatus: StatusTindakLanjut,
    catatanOPD: string,
    extra?: {
      opdDitunjuk?: string;
      catatanOpd?: string;
      statusRekomendasiOpd?: 'masuk_renja_pd' | 'ditolak';
      rencanaAksiTahun?: number;
      isDisposisiOnly?: boolean;
      finalStatus?: StatusTindakLanjut;
    }
  ) => void;
  onAddUser: (newUser: UserAccount) => void;
  onUpdateUser?: (updatedUser: UserAccount) => void;
  onToggleUserStatus: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onAddAgenda: (newAgenda: KonsultasiAgenda) => void;
  onDeleteAgenda: (agendaId: string) => void;
  onUpdateAgendaStatus: (agendaId: string, status: 'buka' | 'segera' | 'selesai') => void;
  onAddKehadiran: (rsvp: KonfirmasiKehadiranSidang) => void;
  onUpdateKehadiranStatus: (id: string, status: 'terkonfirmasi' | 'hadir' | 'menunggu') => void;
  onDeleteKehadiran: (id: string) => void;
  onAddOpd: (newOpd: UnitKerjaOPD) => void;
  onUpdateOpd: (updatedOpd: UnitKerjaOPD) => void;
  onDeleteOpd: (opdId: string) => void;
  onToggleOpdStatus: (opdId: string) => void;
  onAddMisi: (newMisi: MisiRPJMDItem) => void;
  onUpdateMisi: (updatedMisi: MisiRPJMDItem) => void;
  onDeleteMisi: (misiId: string) => void;
  onToggleMisiStatus: (misiId: string) => void;
  onAddCsrProgram: (newProgram: KemitraanCSR) => void;
  onUpdateCsrProgram: (updatedProgram: KemitraanCSR) => void;
  onDeleteCsrProgram: (programId: string) => void;
  onAddInisiatif: (newInit: InisiatifOMS) => void;
  onUpdateInisiatif: (updatedInit: InisiatifOMS) => void;
  onDeleteInisiatif: (id: string) => void;
  onGoToPortal: () => void;
  onOpenFormAspirasi: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  usersList,
  aspirasiList,
  csrPrograms,
  agendaList,
  kehadiranList,
  opdList,
  misiList,
  inisiatifList,
  initialSubTab,
  onLogout,
  onUpdateAspirasiStatus,
  onAddUser,
  onUpdateUser,
  onToggleUserStatus,
  onDeleteUser,
  onAddAgenda,
  onDeleteAgenda,
  onUpdateAgendaStatus,
  onAddKehadiran,
  onUpdateKehadiranStatus,
  onDeleteKehadiran,
  onAddOpd,
  onUpdateOpd,
  onDeleteOpd,
  onToggleOpdStatus,
  onAddMisi,
  onUpdateMisi,
  onDeleteMisi,
  onToggleMisiStatus,
  onAddCsrProgram,
  onUpdateCsrProgram,
  onDeleteCsrProgram,
  onAddInisiatif,
  onUpdateInisiatif,
  onDeleteInisiatif,
  onGoToPortal,
  onOpenFormAspirasi,
}) => {
  const isOpdVerifikator = currentUser.role === 'opd_verifikator';
  const isAdmin = currentUser.role === 'bapperida_admin' || currentUser.role === 'bappeda_admin';

  const [activeTab, setActiveTab] = useState<'verifikasi' | 'sidang_musrenbang' | 'inisiatif_oms' | 'pengaturan_user' | 'pengaturan_opd' | 'pengaturan_misi' | 'rekapitulasi' | 'profil'>(
    initialSubTab || 'verifikasi'
  );
  const [isPengaturanOpen, setIsPengaturanOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Check if an aspirasi is assigned to current user's OPD
  const isAspirasiAssignedToCurrentOpd = (item: AspirasiPublik) => {
    if (!item.opdDitunjuk || item.opdDitunjuk.trim() === '') return false;
    if (!currentUser.agency) return false;

    const target = item.opdDitunjuk.toLowerCase();
    const userAgency = currentUser.agency.toLowerCase();

    if (userAgency.includes(target) || target.includes(userAgency)) return true;

    const keywords = [
      'koperasi', 'perindustrian', 'perdagangan', 'pupr', 'pekerjaan umum', 
      'kesehatan', 'pendidikan', 'sosial', 'lingkungan', 'bpbd', 'bencana', 
      'pariwisata', 'kebudayaan', 'pertanian', 'pangan', 'perhubungan', 
      'perikanan', 'kelautan', 'kominfo', 'dukcapil', 'satpol'
    ];
    for (const kw of keywords) {
      if (target.includes(kw) && userAgency.includes(kw)) {
        return true;
      }
    }
    return false;
  };

  // If OPD verifikator, ONLY see aspirasi that have been dispatched to their OPD by admin!
  const aspirasiAvailableForUser = React.useMemo(() => {
    if (!isOpdVerifikator) {
      return aspirasiList;
    }
    return aspirasiList.filter((item) => isAspirasiAssignedToCurrentOpd(item));
  }, [aspirasiList, isOpdVerifikator, currentUser.agency]);

  const prevInitialSubTabRef = useRef(initialSubTab);

  useEffect(() => {
    // Only synchronize activeTab if initialSubTab prop was explicitly changed from outside
    if (initialSubTab && initialSubTab !== prevInitialSubTabRef.current) {
      prevInitialSubTabRef.current = initialSubTab;
      if (isOpdVerifikator && ['sidang_musrenbang', 'rekapitulasi', 'pengaturan_user', 'pengaturan_opd', 'pengaturan_misi'].includes(initialSubTab)) {
        setActiveTab('verifikasi');
      } else {
        setActiveTab(initialSubTab);
        if (initialSubTab === 'pengaturan_user' || initialSubTab === 'pengaturan_opd' || initialSubTab === 'pengaturan_misi') {
          setIsPengaturanOpen(true);
        }
      }
    } else if (isOpdVerifikator && ['sidang_musrenbang', 'rekapitulasi', 'pengaturan_user', 'pengaturan_opd', 'pengaturan_misi'].includes(activeTab)) {
      setActiveTab('verifikasi');
    }
  }, [initialSubTab, isOpdVerifikator, activeTab]);

  const [selectedAspirasiForReview, setSelectedAspirasiForReview] = useState<AspirasiPublik | null>(null);
  const [reviewStatus, setReviewStatus] = useState<StatusTindakLanjut>('masuk_rkpd');
  const [reviewCatatan, setReviewCatatan] = useState('');
  const [reviewTahun, setReviewTahun] = useState<number>(2027);
  const [reviewOpdDitunjuk, setReviewOpdDitunjuk] = useState<string>('');
  const [reviewStatusRekomendasiOpd, setReviewStatusRekomendasiOpd] = useState<'masuk_renja_pd' | 'ditolak'>('masuk_renja_pd');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // State for User Management (Add & Edit User)
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'bappeda_admin' | 'bapperida_admin' | 'opd_verifikator' | 'pemangku_kepentingan'>('opd_verifikator');
  const [newUserAgency, setNewUserAgency] = useState('');
  const [newUserJabatan, setNewUserJabatan] = useState('');
  const [newUserNip, setNewUserNip] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [userCreatedSuccess, setUserCreatedSuccess] = useState(false);
  const [backupStatusMsg, setBackupStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleExportBackup = () => {
    let savedRiset: any[] = [];
    try {
      const r = localStorage.getItem('sinergi_rpjmd_riset');
      if (r) savedRiset = JSON.parse(r);
    } catch {}

    const backupData = {
      appName: 'WARUNG RIMBUN',
      exportDate: new Date().toISOString(),
      aspirasiList,
      csrPrograms,
      risetList: savedRiset,
      inisiatifList,
      usersList,
      opdList,
      misiList,
      agendaList,
      kehadiranList
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WARUNG_RIMBUN_BACKUP_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatusMsg({
      text: 'File cadangan data lengkap (backup.json) berhasil diunduh. Simpan file ini di komputer Anda sebagai arsip aman.',
      type: 'success'
    });
    setTimeout(() => setBackupStatusMsg(null), 6000);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.aspirasiList) localStorage.setItem('sinergi_rpjmd_aspirasi', JSON.stringify(parsed.aspirasiList));
        if (parsed.csrPrograms) localStorage.setItem('sinergi_rpjmd_csr', JSON.stringify(parsed.csrPrograms));
        if (parsed.risetList) localStorage.setItem('sinergi_rpjmd_riset', JSON.stringify(parsed.risetList));
        if (parsed.inisiatifList) localStorage.setItem('sinergi_rpjmd_oms', JSON.stringify(parsed.inisiatifList));
        if (parsed.usersList) localStorage.setItem('sinergi_rpjmd_users_list', JSON.stringify(parsed.usersList));
        if (parsed.opdList) localStorage.setItem('sinergi_rpjmd_opd_list', JSON.stringify(parsed.opdList));
        if (parsed.misiList) localStorage.setItem('sinergi_rpjmd_misi_list', JSON.stringify(parsed.misiList));
        if (parsed.agendaList) localStorage.setItem('sinergi_rpjmd_agenda', JSON.stringify(parsed.agendaList));
        if (parsed.kehadiranList) localStorage.setItem('sinergi_rpjmd_kehadiran', JSON.stringify(parsed.kehadiranList));

        setBackupStatusMsg({
          text: 'Data cadangan berhasil dipulihkan! Memuat ulang sistem dalam 2 detik...',
          type: 'success'
        });
        setTimeout(() => {
          window.location.reload();
        }, 1800);
      } catch (err) {
        console.error(err);
        setBackupStatusMsg({
          text: 'Gagal memulihkan file. Pastikan file berformat JSON yang valid hasil ekspor sistem.',
          type: 'error'
        });
      }
    };
    reader.readAsText(file);
  };

  // Statistics calculation for user view
  const totalMasuk = aspirasiAvailableForUser.length;
  const masukRkpd = aspirasiAvailableForUser.filter((a) => a.status === 'masuk_rkpd' || a.status === 'masuk_renja_pd').length;
  const sinergiCsr = aspirasiAvailableForUser.filter((a) => a.status === 'sinergi_csr').length;
  const butuhTelaah = aspirasiAvailableForUser.filter((a) => a.status === 'ditelaah' || !a.catatanOpd).length;

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('opd_verifikator');
    setNewUserAgency('');
    setNewUserJabatan('');
    setNewUserNip('');
    setNewUserPhone('');
    setShowAddUserModal(true);
  };

  const handleOpenEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setNewUserName(user.name);
    setNewUserEmail(user.email);
    setNewUserRole(user.role);
    setNewUserAgency(user.agency || '');
    setNewUserJabatan(user.jabatan || '');
    setNewUserNip(user.nip || '');
    setNewUserPhone(user.noHp || '');
    setShowAddUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    if (editingUser) {
      const updated: UserAccount = {
        ...editingUser,
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole,
        agency: newUserAgency.trim() || editingUser.agency,
        jabatan: newUserJabatan.trim() || editingUser.jabatan,
        nip: newUserNip.trim() || undefined,
        noHp: newUserPhone.trim() || undefined,
      };

      if (onUpdateUser) {
        onUpdateUser(updated);
      }
      setUserCreatedSuccess(true);
      setTimeout(() => {
        setUserCreatedSuccess(false);
        setShowAddUserModal(false);
        setEditingUser(null);
      }, 1000);
    } else {
      const created: UserAccount = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole,
        agency: newUserAgency.trim() || (newUserRole === 'bappeda_admin' ? 'Bapperida Litbang Daerah' : newUserRole === 'opd_verifikator' ? 'Dinas Teknis Daerah' : 'Mitra Pembangunan'),
        jabatan: newUserJabatan.trim() || 'Staf Verifikator',
        nip: newUserNip.trim() || undefined,
        noHp: newUserPhone.trim() || undefined,
        statusAktif: true,
        lastLogin: 'Belum pernah login',
        createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      };

      onAddUser(created);
      setUserCreatedSuccess(true);
      setTimeout(() => {
        setUserCreatedSuccess(false);
        setShowAddUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserAgency('');
        setNewUserJabatan('');
        setNewUserNip('');
        setNewUserPhone('');
      }, 1000);
    }
  };

  const filteredUsers = usersList.filter((u) => {
    if (!searchUserQuery.trim()) return true;
    const q = searchUserQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.agency && u.agency.toLowerCase().includes(q)) ||
      (u.nip && u.nip.toLowerCase().includes(q))
    );
  });

  const handleOpenReview = (item: AspirasiPublik) => {
    setSelectedAspirasiForReview(item);
    setReviewStatus(item.status);
    setReviewCatatan(item.catatanOpd || item.tanggapanOPD?.[0]?.isiTanggapan || '');
    setReviewTahun(item.tanggapanOPD?.[0]?.rencanaAksiTahun || 2027);
    setReviewOpdDitunjuk(item.opdDitunjuk || (opdList.length > 0 ? opdList[0].namaOpd : ''));
    setReviewStatusRekomendasiOpd(item.statusRekomendasiOpd || (item.status === 'ditolak' ? 'ditolak' : 'masuk_renja_pd'));
    setIsSavedSuccess(false);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAspirasiForReview) return;

    if (isOpdVerifikator) {
      if (!reviewCatatan.trim()) return;
      onUpdateAspirasiStatus(
        selectedAspirasiForReview.id,
        reviewStatusRekomendasiOpd,
        reviewCatatan,
        {
          opdDitunjuk: selectedAspirasiForReview.opdDitunjuk || currentUser.agency,
          catatanOpd: reviewCatatan,
          statusRekomendasiOpd: reviewStatusRekomendasiOpd,
          rencanaAksiTahun: reviewTahun,
          finalStatus: reviewStatusRekomendasiOpd,
        }
      );
    } else {
      // Akun Administrator Bapperida
      const hasOpdNote = Boolean(selectedAspirasiForReview.catatanOpd && selectedAspirasiForReview.catatanOpd.trim());
      if (hasOpdNote) {
        onUpdateAspirasiStatus(
          selectedAspirasiForReview.id,
          reviewStatus,
          selectedAspirasiForReview.catatanOpd || '',
          {
            opdDitunjuk: reviewOpdDitunjuk || selectedAspirasiForReview.opdDitunjuk,
            catatanOpd: selectedAspirasiForReview.catatanOpd,
            finalStatus: reviewStatus,
            rencanaAksiTahun: reviewTahun,
          }
        );
      } else {
        // Disposisi ke OPD saja
        onUpdateAspirasiStatus(
          selectedAspirasiForReview.id,
          'ditelaah',
          '',
          {
            opdDitunjuk: reviewOpdDitunjuk,
            isDisposisiOnly: true,
            finalStatus: 'ditelaah',
          }
        );
      }
    }

    setIsSavedSuccess(true);
    setTimeout(() => {
      setSelectedAspirasiForReview(null);
      setIsSavedSuccess(false);
    }, 1200);
  };

  const filteredAspirasi = aspirasiAvailableForUser.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  // Primary navigation menu items
  const baseMenuItems = [
    {
      id: 'verifikasi' as const,
      label: 'Meja Verifikasi Aspirasi',
      shortLabel: 'Verifikasi',
      hint: 'Telaah & Disposisi RKPD',
      badge: aspirasiAvailableForUser.length,
      badgeColor: 'bg-emerald-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      id: 'sidang_musrenbang' as const,
      label: 'Jadwal Sidang & Musrenbang',
      shortLabel: 'Sidang & Musrenbang',
      hint: 'Agenda Konsultasi Publik',
      badge: agendaList.length,
      badgeColor: 'bg-blue-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'inisiatif_oms' as const,
      label: 'Ruang Inisiatif & Advokasi Masyarakat Sipil',
      shortLabel: 'Inisiatif OMS',
      hint: 'Advokasi Warga & Komunitas',
      badge: inisiatifList.length,
      badgeColor: 'bg-emerald-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'rekapitulasi' as const,
      label: 'Penyelarasan Misi & CSR',
      shortLabel: 'Penyelarasan CSR',
      hint: 'Sinkronisasi Non-APBD',
      badge: csrPrograms.length,
      badgeColor: 'bg-amber-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'profil' as const,
      label: 'Informasi Satker & Otoritas',
      shortLabel: 'Satker & Otoritas',
      hint: 'Profil Akun & Mandat',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  // Verifikator OPD Teknis tidak menampilkan Jadwal Sidang & Musrenbang dan Penyelarasan CSR
  const primaryMenuItems = isOpdVerifikator
    ? baseMenuItems.filter((m) => m.id !== 'sidang_musrenbang' && m.id !== 'rekapitulasi')
    : baseMenuItems;

  // Sub-menu items for Pengaturan
  const pengaturanSubMenuItems = [
    {
      id: 'pengaturan_user' as const,
      label: 'Kelola & Tambah User',
      shortLabel: 'Kelola User',
      hint: 'Hak Akses & Aparatur',
      badge: usersList.length,
      badgeColor: 'bg-purple-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'pengaturan_opd' as const,
      label: 'Unit Kerja / Perangkat Daerah (OPD)',
      shortLabel: 'Pengaturan OPD',
      hint: 'Tambah, Edit & Hapus OPD',
      badge: opdList.length,
      badgeColor: 'bg-emerald-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 'pengaturan_misi' as const,
      label: 'Misi RPJMD Daerah',
      shortLabel: 'Misi RPJMD',
      hint: 'Tambah, Edit & Hapus Misi',
      badge: misiList.length,
      badgeColor: 'bg-amber-600',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    }
  ];

  const allMenuItems = [
    ...primaryMenuItems,
    ...pengaturanSubMenuItems
  ];

  const currentTabObj = allMenuItems.find((m) => m.id === activeTab);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans text-stone-900 w-full">
      
      {/* MOBILE BACKDROP OVERLAY */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-stone-950/70 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* LEFT SIDEBAR (NAVBAR SAMPING KIRI) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-30 bg-stone-900 text-stone-200 border-r border-stone-800 flex flex-col justify-between transition-all duration-300 ease-in-out select-none shadow-xl md:shadow-none ${
          isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64 lg:w-72'}`}
      >
        {/* SIDEBAR HEADER / BRAND & MINIMIZE TOGGLE */}
        <div className="p-4 border-b border-stone-800/80">
          <div className="flex items-center justify-between gap-2">
            
            {/* Brand Logo Saja (Tanpa teks WARUNG RIMBUN) */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-100 flex items-center justify-center font-serif font-bold text-sm shadow-md flex-shrink-0 border border-emerald-600/50">
                WR
              </div>
            </div>

            {/* Minimize Toggle Button for Desktop */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'Perluas Menu (Expand)' : 'Perkecil Menu (Minimize)'}
            >
              {isSidebarCollapsed ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </button>

            {/* Close Button on Mobile */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-stone-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION ITEMS */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1.5 no-scrollbar">
          {isOpdVerifikator ? (
            /* VERIFIKATOR OPD: Hanya Meja Verifikasi Aspirasi, Ruang Inisiatif OMS, Profil Satker */
            primaryMenuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center rounded-xl transition-all cursor-pointer ${
                      isSidebarCollapsed
                        ? 'justify-center p-3'
                        : 'justify-between px-3.5 py-3'
                    } ${
                      isActive
                        ? 'bg-emerald-900 text-white font-bold shadow-sm border-l-4 border-emerald-400'
                        : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`transition-colors ${isActive ? 'text-emerald-300' : 'text-stone-400 group-hover:text-stone-200'}`}>
                        {item.icon}
                      </div>

                      {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                        <div className="text-left min-w-0">
                          <p className="text-xs leading-snug truncate">{item.label}</p>
                          <p className="text-[10px] text-stone-500 font-normal truncate mt-0.5">{item.hint}</p>
                        </div>
                      )}
                    </div>

                    {item.badge !== undefined && (!isSidebarCollapsed || isMobileSidebarOpen) && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          isActive
                            ? 'bg-emerald-800 text-emerald-100 border border-emerald-600'
                            : 'bg-stone-800 text-stone-300 border border-stone-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.badge !== undefined && isSidebarCollapsed && !isMobileSidebarOpen && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </button>

                  {isSidebarCollapsed && !isMobileSidebarOpen && (
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 px-3 py-1.5 bg-stone-950 text-stone-100 text-xs font-semibold rounded-lg shadow-2xl border border-stone-700 whitespace-nowrap z-50 pointer-events-none">
                      <span>{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-800 text-emerald-100 border border-emerald-600">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            /* ADMINISTRATOR BAPPERIDA & MITRA */
            <>
              {primaryMenuItems.filter((m) => m.id === 'verifikasi' || m.id === 'sidang_musrenbang' || m.id === 'inisiatif_oms').map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center rounded-xl transition-all cursor-pointer ${
                        isSidebarCollapsed
                          ? 'justify-center p-3'
                          : 'justify-between px-3.5 py-3'
                      } ${
                        isActive
                          ? 'bg-emerald-900 text-white font-bold shadow-sm border-l-4 border-emerald-400'
                          : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`transition-colors ${isActive ? 'text-emerald-300' : 'text-stone-400 group-hover:text-stone-200'}`}>
                          {item.icon}
                        </div>

                        {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                          <div className="text-left min-w-0">
                            <p className="text-xs leading-snug truncate">{item.label}</p>
                            <p className="text-[10px] text-stone-500 font-normal truncate mt-0.5">{item.hint}</p>
                          </div>
                        )}
                      </div>

                      {item.badge !== undefined && (!isSidebarCollapsed || isMobileSidebarOpen) && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                            isActive
                              ? 'bg-emerald-800 text-emerald-100 border border-emerald-600'
                              : 'bg-stone-800 text-stone-300 border border-stone-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {item.badge !== undefined && isSidebarCollapsed && !isMobileSidebarOpen && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </button>

                    {isSidebarCollapsed && !isMobileSidebarOpen && (
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 px-3 py-1.5 bg-stone-950 text-stone-100 text-xs font-semibold rounded-lg shadow-2xl border border-stone-700 whitespace-nowrap z-50 pointer-events-none">
                        <span>{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-800 text-emerald-100 border border-emerald-600">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Group 2: MENU PENGATURAN (Hanya Admin Bapperida) */}
              {isAdmin && (
                <div className="pt-2 pb-1">
                  {(!isSidebarCollapsed || isMobileSidebarOpen) ? (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setIsPengaturanOpen(!isPengaturanOpen)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          activeTab === 'pengaturan_user' || activeTab === 'pengaturan_opd' || activeTab === 'pengaturan_misi'
                            ? 'bg-stone-800/90 text-emerald-300'
                            : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Pengaturan</span>
                        </div>
                        <span className="text-[10px] font-mono text-stone-400">
                          {isPengaturanOpen ? '▲' : '▼'}
                        </span>
                      </button>

                      {isPengaturanOpen && (
                        <div className="pl-3 space-y-1 border-l-2 border-stone-800 ml-3.5 my-1">
                          {pengaturanSubMenuItems.map((sub) => {
                            const isSubActive = activeTab === sub.id;
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => {
                                  setActiveTab(sub.id);
                                  setIsMobileSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                                  isSubActive
                                    ? 'bg-emerald-900/90 text-white font-semibold border border-emerald-700 shadow-2xs'
                                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/70'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={isSubActive ? 'text-emerald-300' : 'text-stone-500'}>
                                    {sub.icon}
                                  </span>
                                  <span className="truncate">{sub.label}</span>
                                </div>
                                {sub.badge !== undefined && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                                    {sub.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1 pt-1 border-t border-stone-800">
                      {pengaturanSubMenuItems.map((sub) => {
                        const isSubActive = activeTab === sub.id;
                        return (
                          <div key={sub.id} className="relative group">
                            <button
                              type="button"
                              onClick={() => setActiveTab(sub.id)}
                              className={`w-full flex items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${
                                isSubActive
                                  ? 'bg-emerald-900 text-white font-bold border-l-4 border-emerald-400'
                                  : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80'
                              }`}
                            >
                              {sub.icon}
                            </button>
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 px-3 py-1.5 bg-stone-950 text-stone-100 text-xs font-semibold rounded-lg shadow-2xl border border-stone-700 whitespace-nowrap z-50 pointer-events-none">
                              <span>Pengaturan: {sub.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Group 3: Penyelarasan CSR & Profil Otoritas */}
              {primaryMenuItems.filter((m) => m.id === 'rekapitulasi' || m.id === 'profil').map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center rounded-xl transition-all cursor-pointer ${
                        isSidebarCollapsed
                          ? 'justify-center p-3'
                          : 'justify-between px-3.5 py-3'
                      } ${
                        isActive
                          ? 'bg-emerald-900 text-white font-bold shadow-sm border-l-4 border-emerald-400'
                          : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`transition-colors ${isActive ? 'text-emerald-300' : 'text-stone-400 group-hover:text-stone-200'}`}>
                          {item.icon}
                        </div>

                        {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                          <div className="text-left min-w-0">
                            <p className="text-xs leading-snug truncate">{item.label}</p>
                            <p className="text-[10px] text-stone-500 font-normal truncate mt-0.5">{item.hint}</p>
                          </div>
                        )}
                      </div>

                      {item.badge !== undefined && (!isSidebarCollapsed || isMobileSidebarOpen) && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                            isActive
                              ? 'bg-emerald-800 text-emerald-100 border border-emerald-600'
                              : 'bg-stone-800 text-stone-300 border border-stone-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {item.badge !== undefined && isSidebarCollapsed && !isMobileSidebarOpen && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </button>

                    {isSidebarCollapsed && !isMobileSidebarOpen && (
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 px-3 py-1.5 bg-stone-950 text-stone-100 text-xs font-semibold rounded-lg shadow-2xl border border-stone-700 whitespace-nowrap z-50 pointer-events-none">
                        <span>{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-800 text-emerald-100 border border-emerald-600">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </nav>

        {/* SIDEBAR FOOTER (USER & UTILITIES) */}
        <div className="p-3 border-t border-stone-800/80 space-y-2">
          
          {/* Back to Public Portal Button */}
          <div className="relative group">
            <button
              type="button"
              onClick={onGoToPortal}
              className={`w-full flex items-center rounded-lg text-xs font-medium text-stone-400 hover:text-stone-100 hover:bg-stone-800/90 transition-colors cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate">Tampilan Publik</span>
              )}
            </button>
            {isSidebarCollapsed && !isMobileSidebarOpen && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1 bg-stone-950 text-stone-200 text-xs rounded shadow-lg border border-stone-700 whitespace-nowrap z-50 pointer-events-none">
                Lihat Tampilan Publik
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="relative group">
            <button
              type="button"
              onClick={onLogout}
              className={`w-full flex items-center rounded-lg text-xs font-medium text-rose-300/80 hover:text-rose-200 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/60 transition-colors cursor-pointer ${
                isSidebarCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate font-semibold">Keluar (Logout)</span>
              )}
            </button>
            {isSidebarCollapsed && !isMobileSidebarOpen && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex px-2.5 py-1 bg-rose-950 text-rose-100 text-xs rounded shadow-lg border border-rose-800 whitespace-nowrap z-50 pointer-events-none">
                Keluar (Logout)
              </div>
            )}
          </div>

          {/* User Profile Mini Card */}
          {(!isSidebarCollapsed || isMobileSidebarOpen) && (
            <div className="pt-2 border-t border-stone-800/60 flex items-center gap-2.5 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-emerald-900 text-emerald-200 flex items-center justify-center font-bold text-xs border border-emerald-600 flex-shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-stone-400 font-mono truncate">{currentUser.agency}</p>
              </div>
            </div>
          )}

          {/* Minimize / Expand Bar Indicator Button */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex w-full items-center justify-center gap-2 py-1 text-[11px] font-mono text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
          >
            <span>{isSidebarCollapsed ? '»' : '«'}</span>
            {!isSidebarCollapsed && <span>Perkecil Navbar</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT PANE (SEBELAH KANAN SIDEBAR) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-stone-100">
        
        {/* TOP APP BAR (DASHBOARD HEADER) */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-2xs">
          
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="Buka Menu Sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Desktop Minimize/Expand Button on Top Bar */}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
              title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar (Minimize)'}
            >
              {isSidebarCollapsed ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  <span className="font-semibold text-[11px]">Perluas Menu</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                  <span className="font-semibold text-[11px]">Perkecil Menu</span>
                </>
              )}
            </button>

            {/* Breadcrumb & Current Active Tab Indicator */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="hidden sm:inline text-xs font-mono text-stone-400 uppercase">Dasbor Internal</span>
              <span className="hidden sm:inline text-stone-300">/</span>
              <h1 className="text-sm sm:text-base font-serif font-bold text-stone-900 truncate">
                {currentTabObj?.label}
              </h1>
            </div>
          </div>

          {/* Right Actions on Top Bar */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            
            {/* Officer Status Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-lg border border-stone-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-semibold text-stone-800">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] font-mono text-stone-500 uppercase">({currentUser.role === 'bapperida_admin' || currentUser.role === 'bappeda_admin' ? 'Admin Bapperida' : 'OPD Verifikator'})</span>
            </div>

            {/* Input Usulan Internal Quick Button */}
            <button
              type="button"
              onClick={onOpenFormAspirasi}
              className="px-3 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              + Input Usulan
            </button>

            {/* Portal Link */}
            <button
              type="button"
              onClick={onGoToPortal}
              className="hidden sm:inline-flex px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold border border-stone-300 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              Portal Publik
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              title="Keluar dari sesi"
            >
              <span className="hidden sm:inline">Keluar</span>
              <svg className="w-4 h-4 sm:hidden text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Welcome Strip / Identity Card */}
          <div className="bg-stone-900 text-stone-200 rounded-xl p-5 sm:p-6 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 text-[11px]">
                  WARUNG RIMBUN
                </span>
                <span className="text-stone-500">·</span>
                <span className="px-2 py-0.5 rounded font-mono font-semibold bg-stone-800 text-stone-300 text-[11px]">
                  {currentUser.role === 'bapperida_admin' || currentUser.role === 'bappeda_admin'
                    ? 'ADMINISTRATOR BAPPERIDA PME'
                    : currentUser.role === 'opd_verifikator'
                    ? 'VERIFIKATOR OPD TEKNIS'
                    : 'MITRA PEMANGKU KEBIJAKAN'}
                </span>
                {currentUser.nip && (
                  <>
                    <span className="text-stone-500">·</span>
                    <span className="font-mono text-stone-400 text-[11px]">NIP: {currentUser.nip}</span>
                  </>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                Selamat Datang, {currentUser.name}
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 max-w-2xl">
                {currentUser.agency} — Dasbor kerja internal pemantauan tindak lanjut masukan masyarakat dan penyelarasan dokumen RKPD tahunan.
              </p>
            </div>

            <div className="text-right flex md:flex-col items-center md:items-end justify-between gap-1 flex-shrink-0 text-xs text-stone-400 font-mono pt-2 md:pt-0 border-t md:border-t-0 border-stone-800">
              <span className="text-[11px]">Status Akses: <strong className="text-emerald-400">Aktif & Terverifikasi</strong></span>
              <span className="text-[10px] text-stone-500">Login: {currentUser.lastLogin}</span>
            </div>
          </div>

          {/* KPI METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow">
              <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider block">Total Usulan</span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 font-mono tabular-nums mt-1">
                {totalMasuk}
              </p>
              <span className="text-[11px] text-stone-500 mt-1 block">Aspirasi seluruh pemangku</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow">
              <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">Masuk RKPD</span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 font-mono tabular-nums mt-1">
                {masukRkpd}
              </p>
              <span className="text-[11px] text-emerald-700 mt-1 block">Diakomodasi kerja tahunan</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow">
              <span className="text-xs text-blue-800 font-semibold uppercase tracking-wider block">Sinergi CSR</span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-blue-800 font-mono tabular-nums mt-1">
                {sinergiCsr}
              </p>
              <span className="text-[11px] text-blue-700 mt-1 block">Pembiayaan non-APBD</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow">
              <span className="text-xs text-amber-800 font-semibold uppercase tracking-wider block">Antrean Telaah</span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-800 font-mono tabular-nums mt-1">
                {butuhTelaah}
              </p>
              <span className="text-[11px] text-amber-700 mt-1 block">Perlu disposisi OPD</span>
            </div>
          </div>

          {/* TAB 1: MEJA VERIFIKASI ASPIRASI */}
          {activeTab === 'verifikasi' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-500 font-semibold">Saring Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  >
                    <option value="all">Semua Status Telaah ({aspirasiList.length})</option>
                    <option value="ditelaah">Belum Selesai / Ditelaah ({butuhTelaah})</option>
                    <option value="masuk_rkpd">Sudah Masuk RKPD ({masukRkpd})</option>
                    <option value="sinergi_csr">Sinergi CSR ({sinergiCsr})</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenFormAspirasi}
                    className="px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    + Input Usulan OPD Internal
                  </button>
                </div>
              </div>

              {/* Table of Aspirations for Review */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono">
                        <th className="p-3.5 font-semibold">ID & Misi</th>
                        <th className="p-3.5 font-semibold">Judul Program & Pengusul</th>
                        <th className="p-3.5 font-semibold">Kecamatan</th>
                        <th className="p-3.5 font-semibold text-center">Dukungan</th>
                        <th className="p-3.5 font-semibold">Status Tindak Lanjut</th>
                        <th className="p-3.5 font-semibold text-right">Aksi Telaah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredAspirasi.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-stone-500">
                            {isOpdVerifikator ? (
                              <div className="space-y-1.5 max-w-md mx-auto">
                                <span className="text-2xl block">📭</span>
                                <p className="font-semibold text-stone-700">Belum Ada Usulan Aspirasi yang Didisposisikan ke OPD Anda</p>
                                <p className="text-[11px] text-stone-500 leading-relaxed">
                                  Usulan masyarakat baru akan masuk ke meja verifikasi ini setelah akun administrator Bapperida mendisposisikan usulan yang relevan kepada unit kerja Anda ({currentUser.agency}).
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-1.5 max-w-md mx-auto">
                                <span className="text-2xl block">📂</span>
                                <p className="font-semibold text-stone-700">Belum Ada Usulan Aspirasi pada Saringan Ini</p>
                                <p className="text-[11px] text-stone-500 leading-relaxed">
                                  Gunakan tombol "+ Input Usulan OPD Internal" untuk menginput usulan program baru atau tunggu masukan warga masuk dari portal rembuk publik.
                                </p>
                              </div>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredAspirasi.map((item) => (
                          <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="p-3.5 font-mono">
                              <span className="font-bold text-stone-900">{item.id}</span>
                              <span className="block text-[11px] text-stone-500">
                                {MISI_LABELS[item.misiId]?.nomor}
                              </span>
                            </td>

                            <td className="p-3.5">
                              <p className="font-bold text-stone-900 line-clamp-1">{item.judul}</p>
                              <p className="text-[11px] text-stone-500 mt-0.5">
                                {item.pengusulNama} {item.pengusulInstitusi ? `(${item.pengusulInstitusi})` : ''}
                              </p>
                              {item.opdDitunjuk && (
                                <p className="text-[10px] text-emerald-800 font-mono mt-0.5">
                                  Disposisi OPD: {item.opdDitunjuk}
                                </p>
                              )}
                            </td>

                            <td className="p-3.5 text-stone-600 whitespace-nowrap">{item.kecamatan}</td>

                            <td className="p-3.5 text-center font-mono tabular-nums font-semibold text-stone-800">
                              ▲ {item.dukunganSuara}
                            </td>

                            <td className="p-3.5 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                  item.status === 'masuk_rkpd' || item.status === 'masuk_renja_pd'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : item.status === 'sinergi_csr'
                                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                    : item.status === 'ditolak'
                                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                    : item.catatanOpd
                                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                                }`}
                              >
                                {item.status === 'masuk_rkpd'
                                  ? '✓ Masuk RKPD'
                                  : item.status === 'masuk_renja_pd'
                                  ? '✓ Masuk Renja-PD'
                                  : item.status === 'sinergi_csr'
                                  ? '✓ Skema CSR'
                                  : item.status === 'ditolak'
                                  ? '✕ Ditolak'
                                  : item.catatanOpd
                                  ? '✓ Catatan OPD Masuk'
                                  : item.opdDitunjuk
                                  ? '⏳ Menunggu Telaah OPD'
                                  : '⏳ Menunggu Disposisi'}
                              </span>
                            </td>

                            <td className="p-3.5 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleOpenReview(item)}
                                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
                              >
                                {isOpdVerifikator
                                  ? (item.catatanOpd ? 'Ubah Catatan OPD →' : 'Isi Telaah OPD →')
                                  : (item.catatanOpd ? 'Tetapkan Keputusan →' : 'Disposisi ke OPD →')}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: JADWAL SIDANG & MUSRENBANG TEMATIK */}
          {activeTab === 'sidang_musrenbang' && (
            <SidangMusrenbangManager
              currentUser={currentUser}
              agendaList={agendaList}
              kehadiranList={kehadiranList}
              onAddAgenda={onAddAgenda}
              onDeleteAgenda={onDeleteAgenda}
              onUpdateAgendaStatus={onUpdateAgendaStatus}
              onAddKehadiran={onAddKehadiran}
              onUpdateKehadiranStatus={onUpdateKehadiranStatus}
              onDeleteKehadiran={onDeleteKehadiran}
            />
          )}

          {/* TAB: RUANG INISIATIF & ADVOKASI MASYARAKAT SIPIL */}
          {activeTab === 'inisiatif_oms' && (
            <RuangInisiatifOmsManager
              inisiatifList={inisiatifList}
              misiList={misiList}
              onAddInisiatif={onAddInisiatif}
              onUpdateInisiatif={onUpdateInisiatif}
              onDeleteInisiatif={onDeleteInisiatif}
            />
          )}

          {/* TAB 3: SUB-MENU PENGATURAN - KELOLA & TAMBAH USER */}
          {activeTab === 'pengaturan_user' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-0.5">
                    <span>Manajemen Hak Akses & Akun Pengguna</span>
                    <span aria-hidden="true">·</span>
                    <span>Otoritas Administrator</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Daftar Pengguna & Penambahan Akun Aparatur/Mitra
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Kelola hak akses verifikator OPD, tim penelaah Bapperida, serta perwakilan pemangku kepentingan dalam pengawalan dokumen RPJMD.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddUser}
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5 self-start sm:self-center whitespace-nowrap"
                >
                  <span>+ Tambah User Baru</span>
                </button>
              </div>

              {/* Search & Statistics Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    placeholder="Cari nama, email, NIP, atau OPD..."
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                  {searchUserQuery && (
                    <button
                      onClick={() => setSearchUserQuery('')}
                      className="absolute right-2.5 top-1.5 text-xs text-stone-400 hover:text-stone-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-600 font-mono">
                  <span>Total: <strong>{usersList.length}</strong></span>
                  <span>·</span>
                  <span>Aktif: <strong className="text-emerald-800">{usersList.filter((u) => u.statusAktif !== false).length}</strong></span>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-mono">
                        <th className="p-3.5 font-semibold">Nama Pejabat / Petugas</th>
                        <th className="p-3.5 font-semibold">Unit Kerja & Jabatan</th>
                        <th className="p-3.5 font-semibold">Peran Akses</th>
                        <th className="p-3.5 font-semibold">Kontak & NIP</th>
                        <th className="p-3.5 font-semibold text-center">Status</th>
                        <th className="p-3.5 font-semibold text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-stone-500">
                            Tidak ada akun pengguna yang sesuai dengan pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="p-3.5">
                              <p className="font-bold text-stone-900">{user.name}</p>
                              <p className="font-mono text-stone-500 text-[11px]">{user.email}</p>
                              <span className="font-mono text-stone-400 text-[10px]">ID: {user.id}</span>
                            </td>

                            <td className="p-3.5">
                              <p className="font-medium text-stone-800">{user.agency || 'Pemerintah Daerah'}</p>
                              <p className="text-stone-500 text-[11px]">{user.jabatan || 'Staf Teknis'}</p>
                            </td>

                            <td className="p-3.5 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                  user.role === 'bappeda_admin'
                                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                    : user.role === 'opd_verifikator'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-blue-100 text-blue-900 border border-blue-300'
                                }`}
                              >
                                {user.role === 'bappeda_admin'
                                  ? 'Admin Bapperida PME'
                                  : user.role === 'opd_verifikator'
                                  ? 'Verifikator OPD'
                                  : 'Mitra Pemangku'}
                              </span>
                            </td>

                            <td className="p-3.5 font-mono text-[11px] text-stone-600">
                              {user.nip ? <p>NIP: {user.nip}</p> : <p className="text-stone-400 italic">Non-PNS</p>}
                              {user.noHp && <p className="text-stone-500">{user.noHp}</p>}
                            </td>

                            <td className="p-3.5 text-center whitespace-nowrap">
                              <button
                                onClick={() => onToggleUserStatus(user.id)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-colors ${
                                  user.statusAktif !== false
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                                }`}
                                title="Klik untuk mengubah status aktif"
                              >
                                {user.statusAktif !== false ? '● Aktif' : '○ Dinonaktifkan'}
                              </button>
                            </td>

                            <td className="p-3.5 text-right whitespace-nowrap space-x-1">
                              <button
                                onClick={() => handleOpenEditUser(user)}
                                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg transition-colors text-xs font-semibold cursor-pointer border border-stone-200"
                                title="Edit Akun Pengguna"
                              >
                                Edit
                              </button>
                              {user.id !== currentUser.id ? (
                                <button
                                  onClick={() => {
                                    if (confirm(`Apakah Anda yakin ingin menghapus akun ${user.name}?`)) {
                                      onDeleteUser(user.id);
                                    }
                                  }}
                                  className="px-2.5 py-1 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition-colors text-xs font-semibold cursor-pointer"
                                >
                                  Hapus
                                </button>
                              ) : (
                                <span className="text-[11px] text-stone-400 italic px-2">Akun Anda</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Backup & Restore Data Center */}
              <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-0.5">
                      <span>Ketahanan & Keamanan Data</span>
                      <span aria-hidden="true">·</span>
                      <span>Cadangan Mandiri</span>
                    </div>
                    <h4 className="text-base font-serif font-bold text-stone-900">
                      Pusat Cadangan & Pemulihan Basis Data (Backup & Restore JSON)
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-full self-start sm:self-auto font-medium">
                    ● LocalStorage Aktif Otomatis
                  </span>
                </div>

                {backupStatusMsg && (
                  <div className={`p-3.5 rounded-lg text-xs flex items-center gap-2 animate-fade-in ${
                    backupStatusMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-300'
                      : 'bg-rose-50 text-rose-950 border border-rose-300'
                  }`}>
                    <span>{backupStatusMsg.type === 'success' ? '✓' : '⚠️'}</span>
                    <span>{backupStatusMsg.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Unduh Cadangan */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-stone-900">
                        <span className="text-base">💾</span>
                        <span>Unduh Cadangan Basis Data (Export JSON)</span>
                      </div>
                      <p className="text-stone-600 mt-1 leading-relaxed text-[11px]">
                        Ekspor seluruh data aspirasi, kemitraan CSR, inisiatif OMS, akun pengguna, perangkat daerah (OPD), misi RPJMD, dan agenda sidang ke satu file arsip cadangan <code>.json</code> di komputer Anda.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="w-full sm:w-auto px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs self-start"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Unduh File Cadangan (.json)</span>
                    </button>
                  </div>

                  {/* Pulihkan Cadangan */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-stone-900">
                        <span className="text-base">📥</span>
                        <span>Pulihkan Basis Data dari File (Restore JSON)</span>
                      </div>
                      <p className="text-stone-600 mt-1 leading-relaxed text-[11px]">
                        Pulihkan seluruh data sistem dari file arsip cadangan yang pernah Anda unduh sebelumnya. Cocok jika Anda berganti perangkat atau ingin mengembalikan kondisi data tertentu.
                      </p>
                    </div>

                    <div>
                      <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-semibold transition-colors cursor-pointer shadow-2xs text-xs">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Pilih File Cadangan & Pulihkan...</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Info Card Penjelasan Ketahanan Data */}
                <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 text-blue-950 text-[11px] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <span>ℹ️</span>
                    <span>Bagaimana Cara Kerja Penyimpanan Data di Aplikasi Ini?</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-blue-900/90 leading-relaxed">
                    <li>
                      <strong>Tersimpan Otomatis:</strong> Setiap kali Anda menambah, mengedit, atau menghapus data (usulan aspirasi, OPD, akun, misi, atau agenda), sistem langsung menyimpan perubahannya ke <em>LocalStorage</em> browser secara permanen.
                    </li>
                    <li>
                      <strong>Tidak Kembali ke Data Default Lama:</strong> Data awal (mock data) untuk Usulan Warga, Bursa CSR, Hub Riset, dan Inisiatif OMS telah dikosongkan permanen, sehingga saat browser dimuat ulang, data Anda tidak akan tertimpa atau hilang.
                    </li>
                    <li>
                      <strong>Arsip Aman:</strong> Gunakan tombol <em>Unduh File Cadangan</em> secara berkala agar Anda memiliki salinan cadangan mandiri di komputer Anda.
                    </li>
                  </ul>
                </div>

                {/* CasaOS & Server Deployment Package with Automatic Cloudflare Tunnel */}
                <div className="bg-emerald-950 text-white rounded-xl p-5 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/70 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-800/80 flex items-center justify-center text-lg shadow-inner">
                        🏠
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white tracking-wide">
                            Paket Deployment Mandiri CasaOS & Server Lokal
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold">
                            Zero-Setup Otomatis
                          </span>
                        </div>
                        <p className="text-xs text-emerald-300 mt-0.5">
                          Terkonfigurasi otomatis dengan Cloudflare Tunnel ID <code className="bg-emerald-900/80 px-1 py-0.5 rounded text-amber-300 font-mono text-[10px]">4b630e38-406c-4895-a80e-1fabea7a3b1b</code>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <a
                        href="/warung-rimbun-casaos.tar.gz"
                        download="warung-rimbun-casaos.tar.gz"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Unduh .tar.gz</span>
                      </a>
                      <a
                        href="/warung-rimbun-dist.zip"
                        download="warung-rimbun-dist.zip"
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-xs shadow-sm transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Unduh .zip</span>
                      </a>
                    </div>
                  </div>

                  {/* Highlight Domain & Tunnel Details */}
                  <div className="p-3 bg-emerald-900/40 rounded-lg border border-emerald-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-emerald-300 uppercase tracking-wider font-semibold block">
                        Domain Publik Resmi Cloudflare:
                      </span>
                      <a
                        href="https://warungrimbun.cloudpme.my.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 hover:text-amber-200 font-mono font-bold text-xs underline inline-flex items-center gap-1 mt-0.5"
                      >
                        https://warungrimbun.cloudpme.my.id
                        <span>↗</span>
                      </a>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-stone-300">Lokal:</span>
                      <span className="bg-stone-900/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800">
                        Port 8880
                      </span>
                    </div>
                  </div>

                  {/* 1-Line Instant Installer Command */}
                  <div className="p-3 bg-stone-900/90 rounded-lg border border-emerald-500/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                        ⚡ Perintah 1-Baris Terminal CasaOS (Langsung Unduh, Ekstrak, & Jalankan Otomatis):
                      </span>
                    </div>
                    <code className="block bg-stone-950 p-2.5 rounded text-[11px] font-mono text-emerald-300 select-all overflow-x-auto border border-emerald-800">
                      curl -fsSL https://ais-pre-2xcids4muvsu2mknck6xbb-741891396295.asia-northeast1.run.app/install.sh | bash
                    </code>
                    <p className="text-[10px] text-emerald-400/80">
                      Cukup salin perintah di atas dan tempel di Terminal CasaOS (<span className="font-mono">pme@pme:~$</span>) lalu tekan Enter.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-emerald-900/60 p-3.5 rounded-lg border border-emerald-800/80 space-y-1.5">
                      <div className="font-semibold text-emerald-200 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-800 flex items-center justify-center text-[11px] font-mono text-emerald-100">1</span>
                        Ekstrak Arsip
                      </div>
                      <p className="text-emerald-300 text-[11px] leading-relaxed">
                        Ekstrak paket ke folder tujuan di server CasaOS Anda:
                      </p>
                      <code className="block bg-stone-950/90 p-2 rounded text-[11px] font-mono text-emerald-400 select-all overflow-x-auto border border-emerald-900">
                        tar -xzf warung-rimbun-casaos.tar.gz
                      </code>
                    </div>

                    <div className="bg-emerald-900/60 p-3.5 rounded-lg border border-emerald-800/80 space-y-1.5">
                      <div className="font-semibold text-emerald-200 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-800 flex items-center justify-center text-[11px] font-mono text-emerald-100">2</span>
                        Jalankan Setup Otomatis
                      </div>
                      <p className="text-emerald-300 text-[11px] leading-relaxed">
                        Jalankan script otomatis tanpa konfigurasi ulang:
                      </p>
                      <code className="block bg-stone-950/90 p-2 rounded text-[11px] font-mono text-emerald-400 select-all overflow-x-auto border border-emerald-900">
                        chmod +x setup.sh && ./setup.sh
                      </code>
                    </div>

                    <div className="bg-emerald-900/60 p-3.5 rounded-lg border border-emerald-800/80 space-y-1.5">
                      <div className="font-semibold text-emerald-200 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-800 flex items-center justify-center text-[11px] font-mono text-emerald-100">3</span>
                        Langsung Aktif & Online
                      </div>
                      <p className="text-emerald-300 text-[11px] leading-relaxed">
                        Terbuka di domain publik aman dengan SSL gratis:
                      </p>
                      <code className="block bg-stone-950/90 p-2 rounded text-[11px] font-mono text-amber-300 select-all overflow-x-auto border border-emerald-900">
                        https://warungrimbun.cloudpme.my.id
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB SUB-MENU PENGATURAN: UNIT KERJA / PERANGKAT DAERAH (OPD) */}
          {activeTab === 'pengaturan_opd' && (
            <PengaturanOpdManager
              opdList={opdList}
              onAddOpd={onAddOpd}
              onUpdateOpd={onUpdateOpd}
              onDeleteOpd={onDeleteOpd}
              onToggleOpdStatus={onToggleOpdStatus}
            />
          )}

          {/* TAB SUB-MENU PENGATURAN: MISI RPJMD DAERAH */}
          {activeTab === 'pengaturan_misi' && (
            <PengaturanMisiManager
              misiList={misiList}
              onAddMisi={onAddMisi}
              onUpdateMisi={onUpdateMisi}
              onDeleteMisi={onDeleteMisi}
              onToggleMisiStatus={onToggleMisiStatus}
            />
          )}

          {/* TAB 4: PENYELARASAN MISI RPJMD & PROGRAM CSR */}
          {activeTab === 'rekapitulasi' && (
            <PenyelarasanCsrManager
              csrPrograms={csrPrograms}
              misiList={misiList}
              opdList={opdList}
              onAddCsrProgram={onAddCsrProgram}
              onUpdateCsrProgram={onUpdateCsrProgram}
              onDeleteCsrProgram={onDeleteCsrProgram}
            />
          )}

          {/* TAB 5: INFORMASI SATKER & OTORITAS */}
          {activeTab === 'profil' && (
            <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-6 max-w-3xl shadow-2xs">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-0.5">
                  <span>Informasi Instansi & Hak Akses</span>
                  <span aria-hidden="true">·</span>
                  <span>Otoritas Resmi</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Profil Akun & Hak Akses Sistem WARUNG RIMBUN
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Informasi identitas kedinasan, unit kerja, dan tingkat wewenang penelaahan usulan pembangunan daerah.
                </p>
              </div>

              <div className="space-y-3 text-xs divide-y divide-stone-100">
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Nama Petugas / Pejabat:</span>
                  <span className="font-bold text-stone-800">{currentUser.name}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Alamat Surel (Email):</span>
                  <span className="font-mono text-stone-800">{currentUser.email}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Instansi / Unit Kerja:</span>
                  <span className="text-stone-800 font-semibold">{currentUser.agency}</span>
                </div>
                {currentUser.nip && (
                  <div className="flex justify-between py-2.5">
                    <span className="text-stone-500">Nomor Induk Pegawai (NIP):</span>
                    <span className="font-mono text-stone-800">{currentUser.nip}</span>
                  </div>
                )}
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Peran Sistem:</span>
                  <span className="font-semibold text-emerald-900 uppercase">{currentUser.role}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Wewenang Disposisi:</span>
                  <span className="text-stone-800">Menetapkan usulan ke rancangan awal RKPD & Forum CSR</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-stone-500">Status Keamanan:</span>
                  <span className="text-emerald-800 font-semibold font-mono">✓ SSO Terotentikasi Pemerintah Daerah</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* REVIEW & DISPOSISI MODAL */}
      {selectedAspirasiForReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-900 font-semibold uppercase tracking-wider">
                  Lembar Telaah & Disposisi Resmi Bapperida
                </span>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {selectedAspirasiForReview.id}: {selectedAspirasiForReview.judul}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAspirasiForReview(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isSavedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-serif font-bold text-stone-900">
                  {isOpdVerifikator
                    ? 'Tanggapan & Telaah Teknis OPD Berhasil Disimpan!'
                    : Boolean(selectedAspirasiForReview.catatanOpd)
                    ? 'Status Akhir Usulan Berhasil Ditetapkan & Diterbitkan!'
                    : 'Disposisi ke OPD Berhasil Disimpan!'}
                </h4>
                <p className="text-xs text-stone-600">
                  {isOpdVerifikator
                    ? 'Rekomendasi teknis Anda telah dikirim ke Administrator Bapperida untuk penetapan status akhir dokumen perencanaan.'
                    : 'Data telah diperbarui secara langsung di basis data sistem kendali perencanaan daerah.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveReview} className="p-6 space-y-4 text-xs">
                {/* Ringkasan Usulan Aspirasi */}
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-700 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-1.5">
                    <span className="font-semibold text-stone-900">
                      Pengusul: {selectedAspirasiForReview.pengusulNama} {selectedAspirasiForReview.pengusulInstitusi ? `(${selectedAspirasiForReview.pengusulInstitusi})` : ''}
                    </span>
                    <span className="font-mono text-[11px] text-stone-500">
                      Lokus: {selectedAspirasiForReview.kecamatan}
                    </span>
                  </div>
                  <p className="text-stone-600">
                    <strong className="text-stone-800">Misi RPJMD:</strong> {MISI_LABELS[selectedAspirasiForReview.misiId]?.nomor} - {MISI_LABELS[selectedAspirasiForReview.misiId]?.judul}
                  </p>
                  <p className="pt-1 text-stone-700 italic bg-white p-2.5 rounded-lg border border-stone-200 leading-relaxed">
                    "{selectedAspirasiForReview.deskripsiLengkap}"
                  </p>
                </div>

                {isOpdVerifikator ? (
                  /* =========================================================================
                     TAMPILAN KHUSUS AKUN VERIFIKATOR OPD TEKNIS
                     - Mengisi Catatan Resmi OPD / Tanggapan Tindak Lanjut
                     - Status Penetapan Tindak Lanjut: Masuk Renja-PD atau Ditolak
                     ========================================================================= */
                  <div className="space-y-4">
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">
                          Disposisi Diterima oleh OPD Anda
                        </span>
                        <span className="font-semibold text-xs">
                          {selectedAspirasiForReview.opdDitunjuk || currentUser.agency}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                        {selectedAspirasiForReview.tanggalDisposisi ? `Disposisi: ${selectedAspirasiForReview.tanggalDisposisi}` : 'Disposisi Bapperida'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-stone-800 font-semibold mb-1">
                        Isi Catatan Resmi OPD / Tanggapan Tindak Lanjut *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={reviewCatatan}
                        onChange={(e) => setReviewCatatan(e.target.value)}
                        placeholder="Uraikan telaah teknis kelayakan, sub-kegiatan Renja yang menampung usulan ini, hasil survei lapangan, atau justifikasi penolakan teknis..."
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                      />
                      <p className="text-[10px] text-stone-500 mt-1">
                        Catatan resmi ini akan tercatat dalam buku kendali dan diteruskan ke Administrator Bapperida untuk penetapan status akhir RKPD.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-800 font-semibold mb-1">
                          Status Penetapan Tindak Lanjut *
                        </label>
                        <select
                          value={reviewStatusRekomendasiOpd}
                          onChange={(e) => setReviewStatusRekomendasiOpd(e.target.value as 'masuk_renja_pd' | 'ditolak')}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        >
                          <option value="masuk_renja_pd">Disetujui: Masuk Rencana Kerja (Renja-PD)</option>
                          <option value="ditolak">Ditolak</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-800 font-semibold mb-1">
                          Target Tahun Rencana Aksi *
                        </label>
                        <select
                          value={reviewTahun}
                          onChange={(e) => setReviewTahun(Number(e.target.value))}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                        >
                          <option value={2026}>Tahun Anggaran 2026 (Perubahan)</option>
                          <option value={2027}>Tahun Anggaran 2027 (RKPD Murni)</option>
                          <option value={2028}>Tahun Anggaran 2028</option>
                          <option value={2029}>Tahun Anggaran 2029</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAspirasiForReview(null)}
                        className="px-3.5 py-1.5 text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={!reviewCatatan.trim()}
                        className="px-4 py-1.5 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-950 disabled:opacity-50 cursor-pointer shadow-2xs"
                      >
                        Kirim Tanggapan & Telaah Teknis OPD
                      </button>
                    </div>
                  </div>
                ) : (
                  /* =========================================================================
                     TAMPILAN KHUSUS AKUN ADMINISTRATOR BAPPERIDA
                     - Mendisposisikan usulan ke OPD yang ditunjuk
                     - Admin TIDAK BISA mengisi catatan (hanya OPD yang bisa isi catatan)
                     - Jika OPD sudah mengisi catatan, admin baru bisa memilih Status Penetapan
                     ========================================================================= */
                  <div className="space-y-4">
                    {/* 1. Pilih OPD yang Ditunjuk untuk Disposisi */}
                    <div>
                      <label className="block text-stone-800 font-semibold mb-1">
                        Disposisikan ke OPD yang Ditunjuk *
                      </label>
                      <select
                        required
                        value={reviewOpdDitunjuk}
                        onChange={(e) => setReviewOpdDitunjuk(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-800"
                      >
                        <option value="">-- Pilih Unit Kerja / Perangkat Daerah (OPD) --</option>
                        {opdList
                          .filter((o) => o.statusAktif)
                          .map((opd) => (
                            <option key={opd.id} value={opd.namaOpd}>
                              {opd.namaOpd} {opd.singkatan ? `(${opd.singkatan})` : ''}
                            </option>
                          ))}
                      </select>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Usulan yang masuk tidak akan masuk ke akun OPD sebelum Admin mendisposisikan usulan ke OPD yang ditunjuk di sini.
                      </p>
                    </div>

                    {/* 2. Catatan Resmi OPD (Admin tidak bisa mengisi catatan) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-stone-800 font-semibold">
                          Isi Catatan Resmi OPD / Tanggapan Tindak Lanjut
                        </label>
                        <span className="text-[10px] font-mono text-stone-500 font-medium">
                          (Khusus diisi oleh Verifikator OPD Teknis)
                        </span>
                      </div>

                      {selectedAspirasiForReview.catatanOpd ? (
                        <div className="p-3.5 bg-stone-50 rounded-xl border border-emerald-300 text-stone-800 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] border-b border-stone-200 pb-1.5">
                            <span className="font-semibold text-emerald-950">
                              ✓ Telah Ditelaah oleh: {selectedAspirasiForReview.opdDitunjuk || selectedAspirasiForReview.pejabatPenelaahOpd || 'OPD Terkait'}
                            </span>
                            <span className="font-mono text-stone-500 text-[10px]">
                              {selectedAspirasiForReview.tanggalTanggapanOpd || 'Sudah Diverifikasi'}
                            </span>
                          </div>
                          <p className="text-stone-700 whitespace-pre-wrap leading-relaxed italic">
                            "{selectedAspirasiForReview.catatanOpd}"
                          </p>
                          <div className="pt-1 flex items-center gap-2 text-[10px] font-mono">
                            <span className="text-stone-500">Rekomendasi OPD:</span>
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              selectedAspirasiForReview.statusRekomendasiOpd === 'ditolak'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}>
                              {selectedAspirasiForReview.statusRekomendasiOpd === 'ditolak'
                                ? '✕ Ditolak OPD'
                                : '✓ Disetujui Masuk Renja-PD'}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 border-t border-stone-200/80 pt-1.5 flex items-center gap-1">
                            <span>🔒</span>
                            <span>Akun admin tidak dapat mengedit catatan OPD karena merupakan kewenangan aparatur teknis OPD.</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-amber-950 space-y-1.5">
                          <div className="flex items-center gap-2 font-bold text-amber-900">
                            <span>⏳</span>
                            <span>Menunggu Catatan Resmi OPD Teknis</span>
                          </div>
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            Akun admin tidak bisa mengisi catatan karena hanya OPD yang bisa mengisi catatan. Setelah usulan didisposisikan dan OPD mengisi catatan telaah teknisnya, akun admin baru bisa memilih <strong>Status Penetapan Tindak Lanjut</strong>.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 3. Status Penetapan Tindak Lanjut (Terkunci jika OPD belum isi catatan) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-stone-800 font-semibold">
                            Status Penetapan Tindak Lanjut *
                          </label>
                          {!Boolean(selectedAspirasiForReview.catatanOpd) && (
                            <span className="text-[10px] font-mono text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              🔒 Terkunci
                            </span>
                          )}
                        </div>
                        <select
                          disabled={!Boolean(selectedAspirasiForReview.catatanOpd)}
                          value={reviewStatus}
                          onChange={(e) => setReviewStatus(e.target.value as StatusTindakLanjut)}
                          className={`w-full rounded-lg px-3 py-2 text-stone-800 border focus:outline-none focus:ring-1 focus:ring-emerald-800 ${
                            !Boolean(selectedAspirasiForReview.catatanOpd)
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                              : 'bg-white border-stone-300 font-medium'
                          }`}
                        >
                          <option value="masuk_rkpd">Disetujui: Masuk Rencana Kerja (RKPD)</option>
                          <option value="sinergi_csr">Disetujui: Dialihkan ke Sinergi CSR Daerah</option>
                          <option value="pendalaman_teknis">Perlu Pendalaman Survei Lapangan OPD</option>
                          <option value="ditolak">Ditolak</option>
                          <option value="ditelaah">Masih Dalam Telaah</option>
                        </select>
                        {!Boolean(selectedAspirasiForReview.catatanOpd) && (
                          <p className="text-[10px] text-stone-500 mt-1">
                            Pilihan ini akan aktif otomatis setelah OPD mengisi catatan resmi.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-stone-800 font-semibold mb-1">
                          Target Tahun Rencana Aksi *
                        </label>
                        <select
                          disabled={!Boolean(selectedAspirasiForReview.catatanOpd)}
                          value={reviewTahun}
                          onChange={(e) => setReviewTahun(Number(e.target.value))}
                          className={`w-full rounded-lg px-3 py-2 text-stone-800 border focus:outline-none focus:ring-1 focus:ring-emerald-800 ${
                            !Boolean(selectedAspirasiForReview.catatanOpd)
                              ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                              : 'bg-white border-stone-300'
                          }`}
                        >
                          <option value={2026}>Tahun Anggaran 2026 (Perubahan)</option>
                          <option value={2027}>Tahun Anggaran 2027 (RKPD Murni)</option>
                          <option value={2028}>Tahun Anggaran 2028</option>
                          <option value={2029}>Tahun Anggaran 2029</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAspirasiForReview(null)}
                        className="px-3.5 py-1.5 text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer"
                      >
                        Batal
                      </button>

                      {Boolean(selectedAspirasiForReview.catatanOpd) ? (
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-950 cursor-pointer shadow-2xs"
                        >
                          Tetapkan Status Akhir & Terbitkan
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={!reviewOpdDitunjuk}
                          className="px-4 py-1.5 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-950 disabled:opacity-50 cursor-pointer shadow-2xs"
                        >
                          Simpan & Disposisikan ke OPD
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL TAMBAH & EDIT USER */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-900 font-semibold uppercase tracking-wider">
                  {editingUser ? 'Perbarui Data Pengguna' : 'Registrasi Hak Akses Pengguna'}
                </span>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  {editingUser ? `Edit Data Akun: ${editingUser.name}` : 'Tambah Akun Pengguna / Aparatur Baru'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setEditingUser(null);
                }}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            {userCreatedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-serif font-bold text-stone-900">
                  {editingUser ? 'Perubahan Data Akun Berhasil Disimpan!' : 'Akun Pengguna Berhasil Dibuat!'}
                </h4>
                <p className="text-xs text-stone-600">
                  Data hak akses pengguna telah diperbarui dan langsung aktif di sistem WARUNG RIMBUN.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveUser} className="p-6 space-y-3.5 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Contoh: Ir. Muhammad Yusuf, M.T."
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Alamat Surel (Email) Resmi *
                    </label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="nama@daerah.go.id"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Peran & Tingkat Wewenang *
                    </label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as any)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    >
                      <option value="opd_verifikator">Verifikator OPD Teknis (Dinas)</option>
                      <option value="bapperida_admin">Administrator Bapperida (PME)</option>
                      <option value="pemangku_kepentingan">Mitra Pemangku (CSR/Kampus/OMS)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Unit Kerja / Perangkat Daerah (OPD) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUserAgency}
                      onChange={(e) => setNewUserAgency(e.target.value)}
                      placeholder="Contoh: Dinas Kesehatan Daerah"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Jabatan Struktural / Fungsional
                    </label>
                    <input
                      type="text"
                      value={newUserJabatan}
                      onChange={(e) => setNewUserJabatan(e.target.value)}
                      placeholder="Contoh: Kepala Bidang Kesehatan Masyarakat"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Nomor Induk Pegawai (NIP) / NIDN
                    </label>
                    <input
                      type="text"
                      value={newUserNip}
                      onChange={(e) => setNewUserNip(e.target.value)}
                      placeholder="Contoh: 19850612 201001 1 008"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Nomor HP / WhatsApp Dinas
                    </label>
                    <input
                      type="text"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      placeholder="Contoh: 0812-3456-7890"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-800 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-600 text-[11px]">
                  <strong>Catatan Hak Akses:</strong> Akun yang didaftarkan akan secara otomatis terintegrasi dengan basis login sistem WARUNG RIMBUN dan dapat langsung melakukan penelaahan usulan.
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setEditingUser(null);
                    }}
                    className="px-3.5 py-1.5 text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-900 text-white rounded-lg font-semibold hover:bg-emerald-950 shadow-2xs"
                  >
                    {editingUser ? 'Simpan Perubahan Akun' : 'Simpan Akun Pengguna'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
