import React, { useState, useEffect, useMemo } from 'react';
import { Fase, AdminRequest, AdminDocType, TeacherIdentity, AppCategory } from '../types';
import {
  Users, Zap, UserCircle, LayoutDashboard, CheckSquare,
  Lightbulb, BookOpen, GraduationCap, Clock,
  Book, Briefcase, Sparkles, Star, Target, Palette, Box,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { getMataPelajaranByFase, getElemenCPByFaseAndMapel, getMateriByElemen } from '../data/kurikulumData';

interface ModulGeneratorProps {
  category: AppCategory;
  onSubmit: (data: AdminRequest, selectedTypes: AdminDocType[]) => void;
  isLoading: boolean;
  loadingStatus?: string;
  downloadMode: 'combined' | 'separate';
  onDownloadModeChange: (mode: 'combined' | 'separate') => void;
}

// Colors helper
const styles = {
  bg: 'bg-indigo-50',
  text: 'text-indigo-900',
  border: 'border-indigo-100',
  accent: 'text-indigo-600',
  gradient: 'from-indigo-600 to-violet-600',
  button: 'bg-indigo-600 hover:bg-indigo-700',
  lightButton: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
  ring: 'focus:ring-indigo-500'
};

// Helper for Input Wrapper
const InputWrapper = ({ label, icon: Icon, children, tip }: any) => (
  <div className="group w-full">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
      {Icon && <Icon className={`w-4 h-4 ${styles.accent}`} />}
      {label}
    </label>
    {children}
    {tip && <p className="text-[10px] text-slate-400 mt-1.5 ml-1 italic">{tip}</p>}
  </div>
);

const ModulGenerator: React.FC<ModulGeneratorProps> = ({ onSubmit, isLoading, downloadMode, onDownloadModeChange }) => {

  const [identity, setIdentity] = useState<TeacherIdentity>({
    nama: '',
    nip: '',
    sekolah: '',
    kota: '',
    kepalaSekolah: '',
    nipKepala: '',
    semester: '2 (Genap)',
    tahunAjaran: '2025/2026'
  });

  const [formData, setFormData] = useState<Partial<AdminRequest>>({
    fase: Fase.D,
    mataPelajaran: '',
    elemen: '',
    topik: '',
    alokasiWaktu: '2 JP (2 x 40 Menit)',
    modelPembelajaran: 'Deep Learning (Mindful, Meaningful, Joyful)',
    saranaPrasarana: 'Buku Paket, PPT, Laptop, LCD Proyektor',
    jumlahSiswa: '30 Siswa',
    targetPesertaDidik: 'Siswa Reguler',
    profilPelajar: ['Penalaran Kritis', 'Kreativitas', 'Komunikasi'],
  });

  const [showIdentity, setShowIdentity] = useState(true);
  const [isManualModel, setIsManualModel] = useState(false);
  const [isManualMapel, setIsManualMapel] = useState(false);
  const [isManualElemen, setIsManualElemen] = useState(false);
  const [isManualTopik, setIsManualTopik] = useState(false);

  const basicDocs = [
    AdminDocType.ModulAjar, AdminDocType.ATP, AdminDocType.AnalisisCP,
    AdminDocType.BahanBacaan, AdminDocType.KKTP, AdminDocType.Prota, AdminDocType.Promes
  ];
  const assessDocs = [
    AdminDocType.AsesmenFormatif, AdminDocType.AsesmenSumatif,
    AdminDocType.AsesmenDiagnostik, AdminDocType.KisiKisi, AdminDocType.BankSoal
  ];
  const [selectedDocs, setSelectedDocs] = useState<AdminDocType[]>([AdminDocType.ModulAjar, AdminDocType.ATP]);

  // 8 Dimensi Profil Pelajar Pancasila (Deep Learning)
  const profileOptions = [
    "Keimanan dan Ketakwaan",
    "Kewargaan",
    "Penalaran Kritis",
    "Kreativitas",
    "Kolaborasi",
    "Kemandirian",
    "Kesehatan",
    "Komunikasi"
  ];

  // Opsi Model Pembelajaran
  const modelOptions = [
    "Deep Learning (Mindful, Meaningful, Joyful)",
    "Problem Based Learning (PBL)",
    "Project Based Learning (PjBL)",
    "Discovery Learning",
    "Inquiry Learning",
    "Cooperative Learning"
  ];

  // Dynamic options based on Kurikulum Merdeka
  const mataPelajaranOptions = useMemo(() =>
    getMataPelajaranByFase(formData.fase as Fase),
    [formData.fase]
  );

  const elemenOptions = useMemo(() =>
    getElemenCPByFaseAndMapel(formData.fase as Fase, formData.mataPelajaran),
    [formData.fase, formData.mataPelajaran]
  );

  const materiOptions = useMemo(() =>
    getMateriByElemen(formData.mataPelajaran, formData.elemen),
    [formData.mataPelajaran, formData.elemen]
  );

  // Reset mata pelajaran when fase changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, mataPelajaran: '', elemen: '' }));
    setIsManualMapel(false);
    setIsManualElemen(false);
  }, [formData.fase]);

  // Reset elemen when mata pelajaran changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, elemen: '', topik: '' }));
    setIsManualElemen(false);
    setIsManualTopik(false);
  }, [formData.mataPelajaran]);

  // Reset topik when elemen changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, topik: '' }));
    setIsManualTopik(false);
  }, [formData.elemen]);

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setIdentity({ ...identity, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModelSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "MANUAL_INPUT") {
      setIsManualModel(true);
      setFormData({ ...formData, modelPembelajaran: "" });
    } else {
      setIsManualModel(false);
      setFormData({ ...formData, modelPembelajaran: val });
    }
  };

  const handleMapelSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "MANUAL_INPUT") {
      setIsManualMapel(true);
      setFormData({ ...formData, mataPelajaran: "", elemen: "" });
    } else {
      setIsManualMapel(false);
      setFormData({ ...formData, mataPelajaran: val, elemen: "" });
    }
    setIsManualElemen(false);
  };

  const handleElemenSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "MANUAL_INPUT") {
      setIsManualElemen(true);
      setFormData({ ...formData, elemen: "", topik: "" });
    } else {
      setIsManualElemen(false);
      setFormData({ ...formData, elemen: val, topik: "" });
    }
    setIsManualTopik(false);
  };

  const handleTopikSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "MANUAL_INPUT") {
      setIsManualTopik(true);
      setFormData({ ...formData, topik: "" });
    } else {
      setIsManualTopik(false);
      setFormData({ ...formData, topik: val });
    }
  };

  const toggleProfile = (value: string) => {
    const current = formData.profilPelajar || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    setFormData({ ...formData, profilPelajar: updated });
  };

  const toggleDoc = (doc: AdminDocType) => {
    if (selectedDocs.includes(doc)) {
      setSelectedDocs(selectedDocs.filter(d => d !== doc));
    } else {
      setSelectedDocs([...selectedDocs, doc]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDocs.length === 0) {
      alert("Mohon pilih minimal satu dokumen untuk dibuat.");
      return;
    }
    const requestPayload: AdminRequest = {
      docType: selectedDocs[0],
      identity: identity,
      ...formData
    } as AdminRequest;
    onSubmit(requestPayload, selectedDocs);
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden">

      {/* Header Section with Gradient */}
      <div className="relative px-6 py-10 sm:px-10 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-90`}></div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-4 opacity-90">
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-sm font-bold tracking-widest uppercase opacity-80">Administrasi Guru</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
            Selesaikan Administrasi dalam Sekejap. ⚡
          </h2>
          <p className="text-white/80 text-lg max-w-2xl font-light">
            Buat Modul Ajar, ATP, Asesmen, dan dokumen lainnya secara <strong>instan</strong> — tanpa menunggu, tanpa kuota AI!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10 space-y-8">

        {/* Identity Card (Collapsible) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
          <button
            type="button"
            onClick={() => setShowIdentity(!showIdentity)}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                <UserCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-800">Profil Profesional Guru</h3>
                <p className="text-[10px] text-slate-500">Data ini akan menjadi Kop Surat dokumen Anda</p>
              </div>
            </div>
            {showIdentity ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {showIdentity && (
            <div className="p-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
              <InputWrapper label="Nama Lengkap & Gelar">
                <input type="text" name="nama" value={identity.nama} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" placeholder="Contoh: Dwi Wulandari, S.Pd" />
              </InputWrapper>

              <InputWrapper label="NIP Guru">
                <input type="text" name="nip" value={identity.nip} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" placeholder="Opsional" />
              </InputWrapper>

              <InputWrapper label="Nama Sekolah">
                <input type="text" name="sekolah" value={identity.sekolah} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" placeholder="SMP NEGERI ..." />
              </InputWrapper>

              <InputWrapper label="Kota/Kabupaten">
                <input type="text" name="kota" value={identity.kota} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" placeholder="Bandung, Jakarta, Surabaya..." />
              </InputWrapper>

              <InputWrapper label="Tahun Ajaran">
                <input type="text" name="tahunAjaran" value={identity.tahunAjaran} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" />
              </InputWrapper>

              <InputWrapper label="Kepala Sekolah">
                <input type="text" name="kepalaSekolah" value={identity.kepalaSekolah} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" />
              </InputWrapper>

              <div className="grid grid-cols-2 gap-4">
                <InputWrapper label="NIP Kepala Sekolah">
                  <input type="text" name="nipKepala" value={identity.nipKepala} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" placeholder="Opsional" />
                </InputWrapper>
                <InputWrapper label="Semester">
                  <select name="semester" value={identity.semester} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none bg-white">
                    <option value="1 (Ganjil)">1 (Ganjil)</option>
                    <option value="2 (Genap)">2 (Genap)</option>
                  </select>
                </InputWrapper>
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Konteks Pembelajaran */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className={`text-sm font-bold ${styles.text} uppercase mb-5 flex items-center gap-2`}>
            <div className={`p-1.5 rounded-lg ${styles.bg}`}><BookOpen className="w-4 h-4" /></div>
            Konteks Pembelajaran
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputWrapper label="Fase & Kelas" icon={GraduationCap}>
              <select name="fase" value={formData.fase} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none transition-all`}>
                {Object.values(Fase).map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </InputWrapper>

            <InputWrapper label="Mata Pelajaran" icon={Book} tip="Pilih sesuai fase atau input manual">
              <select
                name="mataPelajaranSelector"
                value={isManualMapel ? "MANUAL_INPUT" : (formData.mataPelajaran || "")}
                onChange={handleMapelSelectChange}
                className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none transition-all`}
              >
                <option value="">-- Pilih Mata Pelajaran --</option>
                {mataPelajaranOptions.map(mp => <option key={mp} value={mp}>{mp}</option>)}
                <option value="MANUAL_INPUT">+ Input Manual</option>
              </select>
              {isManualMapel && (
                <input
                  type="text"
                  name="mataPelajaran"
                  value={formData.mataPelajaran}
                  onChange={handleFormChange}
                  className={`mt-2 w-full px-4 py-2 border rounded-xl text-sm ${styles.border} ${styles.bg} focus:ring-2 ${styles.ring}`}
                  placeholder="Ketik nama mata pelajaran..."
                  autoFocus
                />
              )}
            </InputWrapper>

            <InputWrapper label="Elemen CP" icon={Target} tip="Pilih sesuai mata pelajaran atau input manual">
              <select
                name="elemenSelector"
                value={isManualElemen ? "MANUAL_INPUT" : (formData.elemen || "")}
                onChange={handleElemenSelectChange}
                disabled={!formData.mataPelajaran && !isManualMapel}
                className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">-- Pilih Elemen CP --</option>
                {elemenOptions.map(e => <option key={e} value={e}>{e}</option>)}
                <option value="MANUAL_INPUT">+ Input Manual</option>
              </select>
              {isManualElemen && (
                <input
                  type="text"
                  name="elemen"
                  value={formData.elemen}
                  onChange={handleFormChange}
                  className={`mt-2 w-full px-4 py-2 border rounded-xl text-sm ${styles.border} ${styles.bg} focus:ring-2 ${styles.ring}`}
                  placeholder="Ketik elemen CP..."
                  autoFocus
                />
              )}
            </InputWrapper>
          </div>

          <div className={`mt-6 p-5 rounded-xl border ${styles.border} ${styles.bg}`}>
            <InputWrapper label="Topik / Materi Pokok" icon={Sparkles} tip="Pilih sesuai elemen CP atau input manual">
              <select
                name="topikSelector"
                value={isManualTopik ? "MANUAL_INPUT" : (formData.topik || "")}
                onChange={handleTopikSelectChange}
                disabled={!formData.elemen && !isManualElemen}
                className={`w-full px-4 py-3 border border-white/50 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">-- Pilih Materi/Topik --</option>
                {materiOptions.map(m => <option key={m} value={m}>{m}</option>)}
                <option value="MANUAL_INPUT">+ Input Manual</option>
              </select>
              {isManualTopik && (
                <input
                  type="text"
                  name="topik"
                  required
                  value={formData.topik}
                  onChange={handleFormChange}
                  className={`mt-2 w-full px-4 py-2 border rounded-xl text-sm ${styles.border} bg-white focus:ring-2 ${styles.ring}`}
                  placeholder="Contoh: Operasi Hitung Bilangan Bulat"
                  autoFocus
                />
              )}
            </InputWrapper>
          </div>
        </div>

        {/* Section 2: Pedagogi & Strategi */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className={`text-sm font-bold ${styles.text} uppercase mb-5 flex items-center gap-2`}>
            <div className={`p-1.5 rounded-lg ${styles.bg}`}><Palette className="w-4 h-4" /></div>
            Strategi Mengajar (Deep Learning)
          </h3>

          {/* 8 Dimensi Profil Pelajar */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 8 Dimensi Profil Lulusan Deep Learning
            </label>
            <div className="flex flex-wrap gap-2">
              {profileOptions.map(p => {
                const isSelected = formData.profilPelajar?.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleProfile(p)}
                    className={`text-xs px-3 py-2 rounded-lg border transition-all duration-200 text-left ${isSelected ? `bg-slate-800 text-white border-slate-800 shadow-md transform -translate-y-0.5` : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWrapper label="Model Pembelajaran" icon={Lightbulb} tip="Disarankan menggunakan Deep Learning">
              <select
                name="modelPembelajaranSelector"
                value={isManualModel ? "MANUAL_INPUT" : (modelOptions.includes(formData.modelPembelajaran || '') ? formData.modelPembelajaran : "MANUAL_INPUT")}
                onChange={handleModelSelectChange}
                className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none transition-all font-medium`}
              >
                <option value="" disabled>-- Pilih Model --</option>
                {modelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                <option value="MANUAL_INPUT">+ Input Manual</option>
              </select>
              {isManualModel && (
                <input type="text" name="modelPembelajaran" value={formData.modelPembelajaran} onChange={handleFormChange} className={`mt-2 w-full px-4 py-2 border rounded-xl text-sm ${styles.border} ${styles.bg} focus:ring-2 ${styles.ring}`} placeholder="Ketik model..." autoFocus />
              )}
            </InputWrapper>

            <InputWrapper label="Alokasi Waktu" icon={Clock}>
              <input type="text" name="alokasiWaktu" value={formData.alokasiWaktu} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none transition-all`} placeholder="Mis: 2 JP (80 Menit)" />
            </InputWrapper>

            <InputWrapper label="Media & Alat (Sarpras)" icon={Box}>
              <input type="text" name="saranaPrasarana" value={formData.saranaPrasarana} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none transition-all`} placeholder="Laptop, LCD, Kertas Plano..." />
            </InputWrapper>

            <div className="grid grid-cols-2 gap-3">
              <InputWrapper label="Jml Siswa" icon={Users}>
                <input type="text" name="jumlahSiswa" value={formData.jumlahSiswa} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none`} />
              </InputWrapper>
              <InputWrapper label="Target" icon={Target}>
                <input type="text" name="targetPesertaDidik" value={formData.targetPesertaDidik} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none`} />
              </InputWrapper>
            </div>
          </div>
        </div>

        {/* Document Selection */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/60">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Briefcase className={`w-5 h-5 ${styles.accent}`} /> Paket Dokumen
              </h3>
              <p className="text-sm text-slate-500 mt-1">Pilih dokumen yang ingin Anda hasilkan sekaligus.</p>
            </div>
            <button type="button" onClick={() => setSelectedDocs(selectedDocs.length === [...basicDocs, ...assessDocs].length ? [] : [...basicDocs, ...assessDocs])} className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${styles.lightButton}`}>
              {selectedDocs.length > 0 ? 'Hapus Pilihan' : 'Pilih Semua (Paket Lengkap)'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Perangkat Pembelajaran</span>
              <div className="grid grid-cols-2 gap-3">
                {basicDocs.map(doc => (
                  <div
                    key={doc}
                    onClick={() => toggleDoc(doc)}
                    className={`cursor-pointer px-3 py-3 rounded-xl border flex items-center gap-2 transition-all duration-200 ${selectedDocs.includes(doc) ? `bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500` : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selectedDocs.includes(doc) ? `${styles.bg} border-transparent` : 'border-slate-300'}`}>
                      {selectedDocs.includes(doc) && <CheckSquare className={`w-3 h-3 ${styles.accent}`} />}
                    </div>
                    <span className={`text-xs font-bold leading-tight ${selectedDocs.includes(doc) ? 'text-slate-800' : 'text-slate-500'}`}>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Instrumen Asesmen</span>
              <div className="grid grid-cols-2 gap-3">
                {assessDocs.map(doc => (
                  <div
                    key={doc}
                    onClick={() => toggleDoc(doc)}
                    className={`cursor-pointer px-3 py-3 rounded-xl border flex items-center gap-2 transition-all duration-200 ${selectedDocs.includes(doc) ? 'bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selectedDocs.includes(doc) ? 'bg-emerald-50 border-transparent' : 'border-slate-300'}`}>
                      {selectedDocs.includes(doc) && <CheckSquare className="w-3 h-3 text-emerald-600" />}
                    </div>
                    <span className={`text-xs font-bold leading-tight ${selectedDocs.includes(doc) ? 'text-slate-800' : 'text-slate-500'}`}>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Download Mode Toggle */}
        {selectedDocs.length > 1 && (
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Box className="w-4 h-4 text-indigo-600" /> Format Download
                </h4>
                <p className="text-xs text-slate-500 mt-1">Pilih cara download setelah dokumen selesai dibuat</p>
              </div>
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => onDownloadModeChange('combined')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${downloadMode === 'combined'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  📦 Gabung (1 File)
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadModeChange('separate')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${downloadMode === 'separate'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  📄 Pisah ({selectedDocs.length} File)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Submit Button */}
        <div className="pt-4 pb-8">
          <button
            type="submit"
            disabled={isLoading || selectedDocs.length === 0}
            className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${styles.button} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {/* Glossy Effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 pointer-events-none"></div>

            {isLoading ? (
              <span className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/90"></div>
                Membuat Dokumen...
              </span>
            ) : (
              <>
                <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-pulse" />
                <span>Buat {selectedDocs.length} Dokumen INSTAN Sekarang ⚡</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-3">
            ✨ Tanpa AI, Tanpa Kuota, Tanpa Menunggu — Langsung Jadi!
          </p>
        </div>
      </form>
    </div>
  );
};

export default ModulGenerator;