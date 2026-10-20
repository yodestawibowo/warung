import { useState, useEffect } from 'react';
import {
  INITIAL_ASPIRASI,
  KEMITRAAN_CSR_DATA,
  RISET_AKADEMISI_DATA,
  INISIATIF_OMS_DATA,
  BAB_RPJMD_DATA,
  KONSULTASI_AGENDA_DATA,
  INITIAL_USERS,
  INITIAL_KEHADIRAN_SIDANG,
  INITIAL_OPD_TANGGAMUS,
  INITIAL_MISI_RPJMD,
} from './data/mockData';
import {
  AspirasiPublik,
  KemitraanCSR,
  RisetAkademisi,
  InisiatifOMS,
  BabRPJMD,
  StakeholderType,
  UserAccount,
  StatusTindakLanjut,
  KonsultasiAgenda,
  KonfirmasiKehadiranSidang,
  UnitKerjaOPD,
  MisiRPJMDItem,
} from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PentahelixExplainer } from './components/PentahelixExplainer';
import { AspirasiList } from './components/AspirasiList';
import { AspirasiModal } from './components/AspirasiModal';
import { FormAspirasiModal } from './components/FormAspirasiModal';
import { KemitraanCsrView } from './components/KemitraanCsrView';
import { RisetAkademisiView } from './components/RisetAkademisiView';
import { InisiatifOmsView } from './components/InisiatifOmsView';
import { KonsultasiPublikView } from './components/KonsultasiPublikView';
import { SimulasiPrioritas } from './components/SimulasiPrioritas';
import { StatistikDashboard } from './components/StatistikDashboard';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('rembuk');
  const [filterPillar, setFilterPillar] = useState<string>('all');
  const [selectedAspirasi, setSelectedAspirasi] = useState<AspirasiPublik | null>(null);
  const [isFormAspirasiOpen, setIsFormAspirasiOpen] = useState(false);
  const [isRisetModalOpen, setIsRisetModalOpen] = useState(false);
  const [isOmsModalOpen, setIsOmsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Main dynamic datasets initialized with localStorage fallback
  const [aspirasiList, setAspirasiList] = useState<AspirasiPublik[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_aspirasi');
      return saved ? JSON.parse(saved) : INITIAL_ASPIRASI;
    } catch {
      return INITIAL_ASPIRASI;
    }
  });

  const [csrPrograms, setCsrPrograms] = useState<KemitraanCSR[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_csr');
      return saved ? JSON.parse(saved) : KEMITRAAN_CSR_DATA;
    } catch {
      return KEMITRAAN_CSR_DATA;
    }
  });

  const [risetList, setRisetList] = useState<RisetAkademisi[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_riset');
      return saved ? JSON.parse(saved) : RISET_AKADEMISI_DATA;
    } catch {
      return RISET_AKADEMISI_DATA;
    }
  });

  const [omsList, setOmsList] = useState<InisiatifOMS[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_oms');
      return saved ? JSON.parse(saved) : INISIATIF_OMS_DATA;
    } catch {
      return INISIATIF_OMS_DATA;
    }
  });

  const [babList, setBabList] = useState<BabRPJMD[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_bab');
      return saved ? JSON.parse(saved) : BAB_RPJMD_DATA;
    } catch {
      return BAB_RPJMD_DATA;
    }
  });

  const [usersList, setUsersList] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_users_list');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [agendaList, setAgendaList] = useState<KonsultasiAgenda[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_agenda');
      return saved ? JSON.parse(saved) : KONSULTASI_AGENDA_DATA;
    } catch {
      return KONSULTASI_AGENDA_DATA;
    }
  });

  const [kehadiranList, setKehadiranList] = useState<KonfirmasiKehadiranSidang[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_kehadiran');
      return saved ? JSON.parse(saved) : INITIAL_KEHADIRAN_SIDANG;
    } catch {
      return INITIAL_KEHADIRAN_SIDANG;
    }
  });

  const [opdList, setOpdList] = useState<UnitKerjaOPD[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_opd_list');
      return saved ? JSON.parse(saved) : INITIAL_OPD_TANGGAMUS;
    } catch {
      return INITIAL_OPD_TANGGAMUS;
    }
  });

  const [misiList, setMisiList] = useState<MisiRPJMDItem[]>(() => {
    try {
      const saved = localStorage.getItem('sinergi_rpjmd_misi_list');
      return saved ? JSON.parse(saved) : INITIAL_MISI_RPJMD;
    } catch {
      return INITIAL_MISI_RPJMD;
    }
  });

  const [dashboardSubTab, setDashboardSubTab] = useState<'verifikasi' | 'sidang_musrenbang' | 'pengaturan_user' | 'pengaturan_opd' | 'pengaturan_misi' | 'rekapitulasi' | 'profil'>('verifikasi');

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_misi_list', JSON.stringify(misiList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [misiList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_opd_list', JSON.stringify(opdList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [opdList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_users_list', JSON.stringify(usersList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [usersList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_agenda', JSON.stringify(agendaList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [agendaList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_kehadiran', JSON.stringify(kehadiranList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [kehadiranList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_aspirasi', JSON.stringify(aspirasiList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [aspirasiList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_csr', JSON.stringify(csrPrograms));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [csrPrograms]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_riset', JSON.stringify(risetList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [risetList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_oms', JSON.stringify(omsList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [omsList]);

  useEffect(() => {
    try {
      localStorage.setItem('sinergi_rpjmd_bab', JSON.stringify(babList));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [babList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Upvote an aspiration
  const handleVote = (id: string) => {
    setAspirasiList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isVoted = item.hasVoted;
          const newDukungan = isVoted ? item.dukunganSuara - 1 : item.dukunganSuara + 1;
          return {
            ...item,
            dukunganSuara: newDukungan,
            hasVoted: !isVoted,
          };
        }
        return item;
      })
    );

    // Update selected aspiration if open in modal
    if (selectedAspirasi && selectedAspirasi.id === id) {
      setSelectedAspirasi((prev) =>
        prev
          ? {
              ...prev,
              dukunganSuara: prev.hasVoted ? prev.dukunganSuara - 1 : prev.dukunganSuara + 1,
              hasVoted: !prev.hasVoted,
            }
          : null
      );
    }

    showToast('Dukungan Anda berhasil diperbarui.');
  };

  // Add new proposal
  const handleAddAspirasi = (newEntry: AspirasiPublik) => {
    setAspirasiList((prev) => [newEntry, ...prev]);
    showToast('Aspirasi baru berhasil didaftarkan dan masuk antrean telaah Bapperida.');
  };

  // Add comment to aspiration
  const handleAddComment = (
    aspirasiId: string,
    nama: string,
    institusi: string,
    tipe: StakeholderType,
    isi: string
  ) => {
    const newComment = {
      id: `KOM-${Date.now()}`,
      nama,
      institusi: institusi || undefined,
      tipe,
      tanggal: 'Hari ini',
      isi,
    };

    setAspirasiList((prev) =>
      prev.map((item) => {
        if (item.id === aspirasiId) {
          return {
            ...item,
            komentarPublik: [...item.komentarPublik, newComment],
          };
        }
        return item;
      })
    );

    if (selectedAspirasi && selectedAspirasi.id === aspirasiId) {
      setSelectedAspirasi((prev) =>
        prev
          ? {
              ...prev,
              komentarPublik: [...prev.komentarPublik, newComment],
            }
          : null
      );
    }

    showToast('Komentar berhasil dipublikasikan di forum aspirasi.');
  };

  // CSR Expression of Interest
  const handleCommitCSR = (
    programId: string,
    namaPerusahaan: string,
    nilaiKomitmen: string,
    bentukDukungan: string
  ) => {
    setCsrPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id === programId) {
          const updatedMitra = [...prog.mitraBergabung, namaPerusahaan];
          const updatedPercent = Math.min(prog.persentaseTercapai + 20, 100);
          return {
            ...prog,
            mitraBergabung: updatedMitra,
            persentaseTercapai: updatedPercent,
            status: updatedPercent >= 100 ? 'berjalan' : 'proses_mou',
          };
        }
        return prog;
      })
    );
    showToast(`Surat Minat Kerjasama dari ${namaPerusahaan} (${bentukDukungan}: ${nilaiKomitmen}) berhasil dikirimkan.`);
  };

  // Academic research submission
  const handleSubmitRiset = (newRiset: RisetAkademisi) => {
    setRisetList((prev) => [newRiset, ...prev]);
    showToast('Policy Brief berhasil diunggah ke repositori riset daerah.');
  };

  // OMS initiative registration
  const handleAddInisiatif = (newInit: InisiatifOMS) => {
    setOmsList((prev) => [newInit, ...prev]);
    showToast('Inisiatif komunitas berhasil didaftarkan ke pemantauan sipil daerah.');
  };

  const handleUpdateInisiatif = (updatedInit: InisiatifOMS) => {
    setOmsList((prev) =>
      prev.map((i) => (i.id === updatedInit.id ? updatedInit : i))
    );
    showToast(`Inisiatif "${updatedInit.judulInisiatif}" berhasil diperbarui.`);
  };

  const handleDeleteInisiatif = (id: string) => {
    setOmsList((prev) => prev.filter((i) => i.id !== id));
    showToast('Inisiatif masyarakat sipil berhasil dihapus.');
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    showToast(`Data akun "${updatedUser.name}" berhasil diperbarui.`);
  };

  // Add critical note to RPJMD Chapter
  const handleAddCatatanBab = (
    nomorBab: string,
    nama: string,
    institusi: string,
    tipe: StakeholderType,
    pasal: string,
    komentar: string
  ) => {
    const newNote = {
      id: `CK-${Date.now()}`,
      nama,
      institusi,
      tipe,
      pasalBagian: pasal,
      komentar,
      tanggal: 'Hari ini',
    };

    setBabList((prev) =>
      prev.map((b) => {
        if (b.nomorBab === nomorBab) {
          return {
            ...b,
            totalMasukan: b.totalMasukan + 1,
            catatanKritis: [newNote, ...b.catatanKritis],
          };
        }
        return b;
      })
    );
    showToast(`Catatan kritis untuk ${nomorBab} berhasil dicatat.`);
  };

  // Login & Session handlers
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('sinergi_rpjmd_user', JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    setActiveTab('user_dashboard');
    showToast(`Selamat datang kembali, ${user.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('sinergi_rpjmd_user');
    } catch (e) {
      console.warn(e);
    }
    setActiveTab('rembuk');
    showToast('Anda telah keluar dari sistem.');
  };

  // Update Aspirasi status by reviewer in dashboard
  const handleUpdateAspirasiStatus = (
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
  ) => {
    setAspirasiList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nowStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          const updated: AspirasiPublik = { ...item };

          if (extra?.opdDitunjuk) {
            updated.opdDitunjuk = extra.opdDitunjuk;
            updated.tanggalDisposisi = nowStr;
          }

          if (extra?.catatanOpd !== undefined && extra.catatanOpd.trim() !== '') {
            updated.catatanOpd = extra.catatanOpd;
            updated.tanggalTanggapanOpd = nowStr;
            updated.pejabatPenelaahOpd = currentUser?.name || 'Verifikator Teknis OPD';
          }

          if (extra?.statusRekomendasiOpd) {
            updated.statusRekomendasiOpd = extra.statusRekomendasiOpd;
          }

          const statusToApply = extra?.finalStatus || newStatus;
          updated.status = statusToApply;

          const catatanFinal = extra?.catatanOpd || catatanOPD;
          if (catatanFinal && catatanFinal.trim() !== '') {
            const updatedTanggapan = [
              {
                id: `TGP-${Date.now()}`,
                opdNama: updated.opdDitunjuk || currentUser?.agency || 'Bapperida & Tim Penyusun RPJMD',
                pejabatNama: currentUser?.name || 'Verifikator Perencanaan',
                pejabatJabatan:
                  currentUser?.role === 'bappeda_admin' || currentUser?.role === 'bapperida_admin'
                    ? 'Administrator Bidang PME Bapperida'
                    : 'Verifikator Teknis OPD',
                tanggal: nowStr,
                isiTanggapan: catatanFinal,
                statusPenetapan: statusToApply,
                rencanaAksiTahun: extra?.rencanaAksiTahun || 2027,
              },
              ...(item.tanggapanOPD || []).filter((t) => t.opdNama !== (updated.opdDitunjuk || currentUser?.agency)),
            ];
            updated.tanggapanOPD = updatedTanggapan;
          }

          return updated;
        }
        return item;
      })
    );

    if (extra?.isDisposisiOnly) {
      showToast(`Usulan ${id} berhasil didisposisikan kepada ${extra.opdDitunjuk}.`);
    } else if (extra?.catatanOpd && !extra?.finalStatus) {
      showToast(`Catatan telaah teknis OPD untuk usulan ${id} berhasil dikirim ke Bapperida.`);
    } else {
      showToast(`Status penetapan usulan ${id} berhasil diperbarui.`);
    }
  };

  // Add, toggle, and delete user handlers
  const handleAddUser = (newUser: UserAccount) => {
    setUsersList((prev) => [newUser, ...prev]);
    showToast(`Akun ${newUser.name} berhasil ditambahkan ke sistem.`);
  };

  const handleToggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = u.statusAktif === false ? true : false;
          showToast(`Status akun ${u.name} sekarang ${updated ? 'Aktif' : 'Dinonaktifkan'}.`);
          return { ...u, statusAktif: updated };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (id: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== id));
    showToast('Akun pengguna berhasil dihapus.');
  };

  // Agenda Sidang Handlers
  const handleAddAgenda = (newAgenda: KonsultasiAgenda) => {
    setAgendaList((prev) => [newAgenda, ...prev]);
    showToast(`Jadwal sidang "${newAgenda.judulSidang}" berhasil ditambahkan.`);
  };

  const handleDeleteAgenda = (agendaId: string) => {
    setAgendaList((prev) => prev.filter((a) => a.id !== agendaId));
    showToast('Agenda sidang berhasil dihapus.');
  };

  const handleUpdateAgendaStatus = (agendaId: string, status: 'buka' | 'segera' | 'selesai') => {
    setAgendaList((prev) =>
      prev.map((a) => (a.id === agendaId ? { ...a, statusPendaftaran: status } : a))
    );
    showToast(`Status pendaftaran sidang diperbarui menjadi ${status}.`);
  };

  // Konfirmasi Kehadiran (RSVP) Handlers
  const handleAddKehadiran = (newRsvp: KonfirmasiKehadiranSidang) => {
    setKehadiranList((prev) => [newRsvp, ...prev]);
    showToast(`Konfirmasi kehadiran untuk "${newRsvp.namaLengkap}" berhasil dicatat ke tabel.`);
  };

  const handleUpdateKehadiranStatus = (id: string, status: 'terkonfirmasi' | 'hadir' | 'menunggu') => {
    setKehadiranList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, statusVerifikasi: status } : r))
    );
    showToast(`Status kehadiran peserta berhasil diubah menjadi ${status}.`);
  };

  const handleDeleteKehadiran = (id: string) => {
    setKehadiranList((prev) => prev.filter((r) => r.id !== id));
    showToast('Data konfirmasi kehadiran berhasil dihapus.');
  };

  // OPD Management Handlers
  const handleAddOpd = (newOpd: UnitKerjaOPD) => {
    setOpdList((prev) => [newOpd, ...prev]);
    showToast(`Perangkat Daerah "${newOpd.singkatan}" berhasil didaftarkan.`);
  };

  const handleUpdateOpd = (updatedOpd: UnitKerjaOPD) => {
    setOpdList((prev) =>
      prev.map((o) => (o.id === updatedOpd.id ? updatedOpd : o))
    );
    showToast(`Data Perangkat Daerah "${updatedOpd.singkatan}" berhasil diperbarui.`);
  };

  const handleDeleteOpd = (opdId: string) => {
    setOpdList((prev) => prev.filter((o) => o.id !== opdId));
    showToast('Perangkat Daerah berhasil dihapus dari sistem.');
  };

  const handleToggleOpdStatus = (opdId: string) => {
    setOpdList((prev) =>
      prev.map((o) => (o.id === opdId ? { ...o, statusAktif: !o.statusAktif } : o))
    );
    showToast('Status keaktifan Perangkat Daerah berhasil diubah.');
  };

  // Misi RPJMD Handlers
  const handleAddMisi = (newMisi: MisiRPJMDItem) => {
    setMisiList((prev) => [...prev, newMisi]);
    showToast(`Misi "${newMisi.nomor}: ${newMisi.judul}" berhasil didaftarkan ke RPJMD.`);
  };

  const handleUpdateMisi = (updatedMisi: MisiRPJMDItem) => {
    setMisiList((prev) =>
      prev.map((m) => (m.id === updatedMisi.id ? updatedMisi : m))
    );
    showToast(`${updatedMisi.nomor} ("${updatedMisi.judul}") berhasil diperbarui.`);
  };

  const handleDeleteMisi = (misiId: string) => {
    setMisiList((prev) => prev.filter((m) => m.id !== misiId));
    showToast('Misi RPJMD berhasil dihapus.');
  };

  const handleToggleMisiStatus = (misiId: string) => {
    setMisiList((prev) =>
      prev.map((m) => (m.id === misiId ? { ...m, statusAktif: !m.statusAktif } : m))
    );
    showToast('Status keaktifan Misi RPJMD berhasil diubah.');
  };

  // Kemitraan CSR Handlers
  const handleAddCsrProgram = (newProgram: KemitraanCSR) => {
    setCsrPrograms((prev) => [newProgram, ...prev]);
    showToast(`Program CSR "${newProgram.namaProgram}" berhasil ditambahkan.`);
  };

  const handleUpdateCsrProgram = (updatedProgram: KemitraanCSR) => {
    setCsrPrograms((prev) =>
      prev.map((p) => (p.id === updatedProgram.id ? updatedProgram : p))
    );
    showToast(`Program CSR "${updatedProgram.namaProgram}" berhasil diperbarui.`);
  };

  const handleDeleteCsrProgram = (programId: string) => {
    setCsrPrograms((prev) => prev.filter((p) => p.id !== programId));
    showToast('Program CSR berhasil dihapus dari daftar penyelarasan.');
  };

  const handleNavigatePengaturan = (sub: 'user' | 'opd' | 'misi') => {
    const targetTab =
      sub === 'user' ? 'pengaturan_user' : sub === 'opd' ? 'pengaturan_opd' : 'pengaturan_misi';
    setDashboardSubTab(targetTab);
    if (!currentUser) {
      // Auto-assign default admin account so demo users can immediately explore the setting
      setCurrentUser(usersList[0]);
    }
    setActiveTab('user_dashboard');
    showToast(
      `Membuka Pengaturan: ${
        sub === 'user'
          ? 'Kelola & Tambah User'
          : sub === 'opd'
          ? 'Unit Kerja / Perangkat Daerah (OPD)'
          : 'Misi RPJMD Daerah'
      }`
    );
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Judul Aspirasi',
      'Pengusul',
      'Institusi',
      'Kategori Pemangku',
      'Kecamatan',
      'Misi RPJMD',
      'Dukungan Suara',
      'Status Telaah',
    ];

    const rows = aspirasiList.map((item) => [
      item.id,
      `"${item.judul.replace(/"/g, '""')}"`,
      `"${item.pengusulNama.replace(/"/g, '""')}"`,
      `"${(item.pengusulInstitusi || '').replace(/"/g, '""')}"`,
      item.tipePemangku,
      `"${item.kecamatan}"`,
      item.misiId,
      item.dukunganSuara,
      item.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `data_partisipasi_rpjmd_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data partisipasi berhasil diekspor ke CSV.');
  };

  // Print Executive Summary
  const handlePrintReport = () => {
    window.print();
  };

  const handleScrollToSimulasi = () => {
    const el = document.getElementById('simulasi-prioritas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('rembuk');
      setTimeout(() => {
        const target = document.getElementById('simulasi-prioritas');
        target?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleNavigatePillar = (pillar: 'masyarakat' | 'swasta' | 'akademisi' | 'oms') => {
    switch (pillar) {
      case 'masyarakat':
        setFilterPillar('masyarakat');
        setActiveTab('rembuk');
        showToast('Membuka Usulan Warga: menampilkan aspirasi warga & masyarakat.');
        setTimeout(() => {
          const el = document.getElementById('daftar-aspirasi');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 620, behavior: 'smooth' });
          }
        }, 120);
        break;

      case 'swasta':
        setActiveTab('csr');
        showToast('Membuka Bursa Kemitraan CSR & Pembiayaan Non-APBD Daerah.');
        setTimeout(() => {
          const el = document.getElementById('kemitraan-csr');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 620, behavior: 'smooth' });
          }
        }, 120);
        break;

      case 'akademisi':
        setActiveTab('riset');
        showToast('Membuka Hub Kajian Ilmiah & Rekomendasi Kebijakan Kampus.');
        setTimeout(() => {
          const el = document.getElementById('kajian-ilmiah');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 620, behavior: 'smooth' });
          }
        }, 120);
        break;

      case 'oms':
        setActiveTab('oms');
        showToast('Membuka Ruang Inisiatif & Advokasi Masyarakat Sipil.');
        setTimeout(() => {
          const el = document.getElementById('inisiatif-oms');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 620, behavior: 'smooth' });
          }
        }, 120);
        break;
    }
  };

  const handleQuickActionPillar = (pillar: 'masyarakat' | 'swasta' | 'akademisi' | 'oms') => {
    switch (pillar) {
      case 'masyarakat':
        setIsFormAspirasiOpen(true);
        break;

      case 'swasta':
        setActiveTab('csr');
        showToast('Pilih salah satu program prioritas CSR untuk mengajukan komitmen.');
        setTimeout(() => {
          const el = document.getElementById('katalog-csr-proyek');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 620, behavior: 'smooth' });
          }
        }, 120);
        break;

      case 'akademisi':
        setActiveTab('riset');
        setIsRisetModalOpen(true);
        showToast('Membuka formulir unggah naskah Policy Brief akademisi.');
        break;

      case 'oms':
        setActiveTab('oms');
        setIsOmsModalOpen(true);
        showToast('Membuka formulir pendaftaran inisiatif masyarakat sipil.');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-stone-700 flex items-center gap-2 animate-bounce-once">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header: only show on public portal tabs, hide on user_dashboard */}
      {activeTab !== 'user_dashboard' && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenFormAspirasi={() => setIsFormAspirasiOpen(true)}
          onScrollToSimulasi={handleScrollToSimulasi}
          currentUser={currentUser}
          onOpenLogin={() => setActiveTab('login')}
          onOpenUserDashboard={() => setActiveTab('user_dashboard')}
          onNavigatePengaturan={handleNavigatePengaturan}
        />
      )}

      {/* Hero Section & Pentahelix (Show on public portal tabs, hide on login/dashboard view) */}
      {activeTab !== 'login' && activeTab !== 'user_dashboard' && (
        <>
          <Hero
            onOpenFormAspirasi={() => setIsFormAspirasiOpen(true)}
            onExploreAspirasi={() => {
              setActiveTab('rembuk');
              window.scrollTo({ top: 600, behavior: 'smooth' });
            }}
          />

          <PentahelixExplainer
            onNavigatePillar={handleNavigatePillar}
            onQuickAction={handleQuickActionPillar}
          />
        </>
      )}

      {/* Content Area: UserDashboard takes full-width layout with Left Sidebar, public portal uses max-w-7xl */}
      {activeTab === 'user_dashboard' && currentUser ? (
        <UserDashboard
          currentUser={currentUser}
          usersList={usersList}
          aspirasiList={aspirasiList}
          csrPrograms={csrPrograms}
          agendaList={agendaList}
          kehadiranList={kehadiranList}
          opdList={opdList}
          initialSubTab={dashboardSubTab}
          onLogout={handleLogout}
          onUpdateAspirasiStatus={handleUpdateAspirasiStatus}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUser}
          onToggleUserStatus={handleToggleUserStatus}
          onDeleteUser={handleDeleteUser}
          onAddAgenda={handleAddAgenda}
          onDeleteAgenda={handleDeleteAgenda}
          onUpdateAgendaStatus={handleUpdateAgendaStatus}
          onAddKehadiran={handleAddKehadiran}
          onUpdateKehadiranStatus={handleUpdateKehadiranStatus}
          onDeleteKehadiran={handleDeleteKehadiran}
          onAddOpd={handleAddOpd}
          onUpdateOpd={handleUpdateOpd}
          onDeleteOpd={handleDeleteOpd}
          onToggleOpdStatus={handleToggleOpdStatus}
          misiList={misiList}
          onAddMisi={handleAddMisi}
          onUpdateMisi={handleUpdateMisi}
          onDeleteMisi={handleDeleteMisi}
          onToggleMisiStatus={handleToggleMisiStatus}
          onAddCsrProgram={handleAddCsrProgram}
          onUpdateCsrProgram={handleUpdateCsrProgram}
          onDeleteCsrProgram={handleDeleteCsrProgram}
          inisiatifList={omsList}
          onAddInisiatif={handleAddInisiatif}
          onUpdateInisiatif={handleUpdateInisiatif}
          onDeleteInisiatif={handleDeleteInisiatif}
          onGoToPortal={() => setActiveTab('rembuk')}
          onOpenFormAspirasi={() => setIsFormAspirasiOpen(true)}
        />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
          {/* Tab: Halaman Login */}
          {activeTab === 'login' && (
            <LoginPage
              usersList={usersList}
              onLoginSuccess={handleLoginSuccess}
              onBackToPortal={() => setActiveTab('rembuk')}
            />
          )}

          {/* Tab 1: Rembuk & Aspirasi Partisipatif */}
          {activeTab === 'rembuk' && (
            <div className="space-y-12">
              <AspirasiList
                aspirasi={aspirasiList}
                onVote={handleVote}
                onSelectAspirasi={(item) => setSelectedAspirasi(item)}
                onOpenForm={() => setIsFormAspirasiOpen(true)}
                filterPillar={filterPillar}
                setFilterPillar={setFilterPillar}
              />

              {/* Interactive Citizen Priority Budgeting Allocator */}
              <SimulasiPrioritas />
            </div>
          )}

          {/* Tab 2: Kemitraan Swasta & CSR */}
          {activeTab === 'csr' && (
            <KemitraanCsrView
              csrPrograms={csrPrograms}
              onCommitCSR={handleCommitCSR}
            />
          )}

          {/* Tab 3: Riset & Rekomendasi Akademisi */}
          {activeTab === 'riset' && (
            <RisetAkademisiView
              risetList={risetList}
              onSubmitRiset={handleSubmitRiset}
              openSubmitModal={isRisetModalOpen}
              onCloseSubmitModal={() => setIsRisetModalOpen(false)}
            />
          )}

          {/* Tab 4: Inisiatif & Advokasi OMS */}
          {activeTab === 'oms' && (
            <InisiatifOmsView
              omsList={omsList}
              onAddInisiatif={handleAddInisiatif}
              openSubmitModal={isOmsModalOpen}
              onCloseSubmitModal={() => setIsOmsModalOpen(false)}
            />
          )}

          {/* Tab 5: Konsultasi Publik & Uji Bab RPJMD */}
          {activeTab === 'konsultasi' && (
            <KonsultasiPublikView
              agendaList={agendaList}
              babList={babList}
              kehadiranList={kehadiranList}
              onAddCatatanBab={handleAddCatatanBab}
              onAddKehadiran={handleAddKehadiran}
            />
          )}

          {/* Tab 6: Dashboard Statistik & Transparansi Sinergi */}
          {activeTab === 'dashboard' && (
            <StatistikDashboard
              onExportCSV={handleExportCSV}
              onPrintReport={handlePrintReport}
            />
          )}
        </main>
      )}

      {/* Detailed Modal for Aspiration View */}
      {selectedAspirasi && (
        <AspirasiModal
          item={selectedAspirasi}
          onClose={() => setSelectedAspirasi(null)}
          onVote={handleVote}
          onAddComment={handleAddComment}
        />
      )}

      {/* Modal for Submitting New Aspiration */}
      <FormAspirasiModal
        isOpen={isFormAspirasiOpen}
        onClose={() => setIsFormAspirasiOpen(false)}
        onSubmit={handleAddAspirasi}
      />

      {/* Footer: only show on public portal tabs, hide on user_dashboard */}
      {activeTab !== 'user_dashboard' && (
        <Footer
          setActiveTab={setActiveTab}
          onOpenForm={() => setIsFormAspirasiOpen(true)}
        />
      )}

    </div>
  );
}
