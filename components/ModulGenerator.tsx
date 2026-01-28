import React, { useState, useEffect, useMemo } from 'react';
import { Fase, AdminRequest, AdminDocType, TeacherIdentity, AppCategory } from '../types';
import {
  Users, Zap, UserCircle, LayoutDashboard, CheckSquare,
  FileText, Lightbulb, BookOpen, GraduationCap, Clock,
  Book, Briefcase, Sparkles, Star, Target, Palette, Box,
  ChevronDown, ChevronUp, AlertCircle, Quote, HeartHandshake, Key
} from 'lucide-react';
import { getMataPelajaranByFase, getElemenCPByFaseAndMapel, getMateriByElemen } from '../data/kurikulumData';
import { useApiKey } from '../hooks/useApiKey';
import ApiKeyBanner from './ApiKeyBanner';

interface ModulGeneratorProps {
  category: AppCategory;
  onSubmit: (data: AdminRequest, selectedTypes: AdminDocType[]) => void;
  isLoading: boolean;
  loadingStatus?: string;
  onOpenSettings?: () => void;
}

// Colors helper based on category
const getCategoryStyles = (category: AppCategory) => {
  switch (category) {
    case AppCategory.Administrasi:
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-900',
        border: 'border-indigo-100',
        accent: 'text-indigo-600',
        gradient: 'from-indigo-600 to-violet-600',
        button: 'bg-indigo-600 hover:bg-indigo-700',
        lightButton: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
        ring: 'focus:ring-indigo-500'
      };
    case AppCategory.Publikasi:
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-900',
        border: 'border-emerald-100',
        accent: 'text-emerald-600',
        gradient: 'from-emerald-600 to-teal-600',
        button: 'bg-emerald-600 hover:bg-emerald-700',
        lightButton: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
        ring: 'focus:ring-emerald-500'
      };
    case AppCategory.Kinerja:
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-900',
        border: 'border-orange-100',
        accent: 'text-orange-600',
        gradient: 'from-orange-500 to-amber-600',
        button: 'bg-orange-600 hover:bg-orange-700',
        lightButton: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
        ring: 'focus:ring-orange-500'
      };
    case AppCategory.Bimbingan:
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-900',
        border: 'border-rose-100',
        accent: 'text-rose-600',
        gradient: 'from-rose-500 to-pink-600',
        button: 'bg-rose-600 hover:bg-rose-700',
        lightButton: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
        ring: 'focus:ring-rose-500'
      };
    default:
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-900',
        border: 'border-indigo-100',
        accent: 'text-indigo-600',
        gradient: 'from-indigo-600 to-violet-600',
        button: 'bg-indigo-600 hover:bg-indigo-700',
        lightButton: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
        ring: 'focus:ring-indigo-500'
      };
  }
};

// Helper for Input Wrapper - Defined OUTSIDE to prevent re-render focus loss
const InputWrapper = ({ label, icon: Icon, children, tip, accentClass }: any) => (
  <div className="group w-full">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
      {Icon && <Icon className={`w-4 h-4 ${accentClass}`} />}
      {label}
    </label>
    {children}
    {tip && <p className="text-[10px] text-slate-400 mt-1.5 ml-1 italic">{tip}</p>}
  </div>
);

const ModulGenerator: React.FC<ModulGeneratorProps> = ({ category, onSubmit, isLoading, loadingStatus, onOpenSettings }) => {
  const styles = getCategoryStyles(category);
  const { hasApiKey, refreshApiKey } = useApiKey();

  // Refresh API key status when component mounts or settings might have changed
  useEffect(() => {
    refreshApiKey();
  }, [refreshApiKey]);

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
    // Default Deep Learning sesuai kurikulum 2026
    modelPembelajaran: 'Deep Learning (Mindful, Meaningful, Joyful)',
    saranaPrasarana: 'Buku Paket, PPT, Laptop, LCD Proyektor',
    jumlahSiswa: '30 Siswa',
    targetPesertaDidik: 'Siswa Reguler',
    // Default profiles (8 Dimensi Deep Learning)
    profilPelajar: ['Penalaran Kritis', 'Kreativitas', 'Komunikasi'],
    masalah: '',
    solusi: '',
    namaDiklat: '',
    penyelenggara: '',
    waktuDiklat: '',
    kasusSiswa: '',
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
  const [selectedSingleDoc, setSelectedSingleDoc] = useState<AdminDocType | null>(null);

  // 8 Dimensi Profil Lulusan Pembelajaran Mendalam (Deep Learning)
  // Integrasi 4K dengan Nilai Pancasila & UU Sisdiknas
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

  // Opsi Model Pembelajaran (Mengutamakan Deep Learning)
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

  // Re-sync single doc selection when category changes
  useEffect(() => {
    if (category === AppCategory.Publikasi) setSelectedSingleDoc(AdminDocType.ProposalPTK);
    else if (category === AppCategory.Kinerja) setSelectedSingleDoc(AdminDocType.LaporanDiklat);
    else if (category === AppCategory.Bimbingan) setSelectedSingleDoc(AdminDocType.JurnalSikap);
    else setSelectedSingleDoc(null);
  }, [category]);

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
    // Toggle logic (no more number prefix to strip)
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
    let typesToGenerate: AdminDocType[] = [];
    if (category === AppCategory.Administrasi) {
      if (selectedDocs.length === 0) {
        alert("Mohon pilih minimal satu dokumen untuk dibuat.");
        return;
      }
      typesToGenerate = selectedDocs;
    } else {
      if (!selectedSingleDoc) return;
      typesToGenerate = [selectedSingleDoc];
    }
    const requestPayload: AdminRequest = {
      docType: typesToGenerate[0],
      identity: identity,
      ...formData
    } as AdminRequest;
    onSubmit(requestPayload, typesToGenerate);
  };

  const renderCategoryInputs = () => {
    switch (category) {
      case AppCategory.Administrasi:
        return (
          <div className="space-y-8 animate-fade-in-up">

            {/* Section 1: Konteks Pembelajaran */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className={`text-sm font-bold ${styles.text} uppercase mb-5 flex items-center gap-2`}>
                <div className={`p-1.5 rounded-lg ${styles.bg}`}><BookOpen className="w-4 h-4" /></div>
                Konteks Pembelajaran
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputWrapper label="Fase & Kelas" icon={GraduationCap} accentClass={styles.accent}>
                  <select name="fase" value={formData.fase} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none transition-all`}>
                    {Object.values(Fase).map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </InputWrapper>

                <InputWrapper label="Mata Pelajaran" icon={Book} accentClass={styles.accent} tip="Pilih sesuai fase atau input manual">
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

                <InputWrapper label="Elemen CP" icon={Target} tip="Pilih sesuai mata pelajaran atau input manual" accentClass={styles.accent}>
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
                <InputWrapper label="Topik / Materi Pokok" icon={Sparkles} tip="Pilih sesuai elemen CP atau input manual" accentClass={styles.accent}>
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

              {/* 8 Dimensi Profil Pelajar Pancasila */}
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
                <InputWrapper label="Model Pembelajaran" icon={Lightbulb} accentClass={styles.accent} tip="Disarankan menggunakan Deep Learning">
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

                <InputWrapper label="Alokasi Waktu" icon={Clock} accentClass={styles.accent}>
                  <input type="text" name="alokasiWaktu" value={formData.alokasiWaktu} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none transition-all`} placeholder="Mis: 2 JP (80 Menit)" />
                </InputWrapper>

                <InputWrapper label="Media & Alat (Sarpras)" icon={Box} accentClass={styles.accent}>
                  <input type="text" name="saranaPrasarana" value={formData.saranaPrasarana} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none transition-all`} placeholder="Laptop, LCD, Kertas Plano..." />
                </InputWrapper>

                <div className="grid grid-cols-2 gap-3">
                  <InputWrapper label="Jml Siswa" icon={Users} accentClass={styles.accent}>
                    <input type="text" name="jumlahSiswa" value={formData.jumlahSiswa} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none`} />
                  </InputWrapper>
                  <InputWrapper label="Target" icon={Target} accentClass={styles.accent}>
                    <input type="text" name="targetPesertaDidik" value={formData.targetPesertaDidik} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none`} />
                  </InputWrapper>
                </div>
              </div>
            </div>
          </div>
        );

      case AppCategory.Publikasi:
        return (
          <div className="animate-fade-in-up space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: AdminDocType.ProposalPTK, label: 'Proposal PTK', desc: 'Penelitian Tindakan Kelas Bab 1-3' },
                { id: AdminDocType.BestPractice, label: 'Best Practice', desc: 'Metode STAR (Situasi, Tantangan, Aksi)' },
                { id: AdminDocType.IdeInovasi, label: 'Ide Inovasi', desc: 'Rancangan Alat Peraga & Media' }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedSingleDoc(item.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${selectedSingleDoc === item.id ? `${styles.bg} ${styles.border} ring-1 ring-emerald-400 shadow-md` : 'bg-white border-slate-200 hover:border-emerald-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center mb-3 ${selectedSingleDoc === item.id ? 'border-emerald-600' : 'border-slate-300'}`}>
                    {selectedSingleDoc === item.id && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>}
                  </div>
                  <h4 className="font-bold text-slate-800">{item.label}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              {selectedSingleDoc === AdminDocType.ProposalPTK && (
                <div className="space-y-5 animate-fade-in">
                  <InputWrapper label="Masalah Utama di Kelas" icon={AlertCircle} accentClass={styles.accent}>
                    <textarea name="masalah" rows={3} value={formData.masalah} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none`} placeholder="Ceritakan kegelisahan Anda tentang kondisi kelas..." />
                  </InputWrapper>
                  <InputWrapper label="Solusi yang Ditawarkan" icon={Lightbulb} accentClass={styles.accent}>
                    <textarea name="solusi" rows={3} value={formData.solusi} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none`} placeholder="Metode atau media apa yang ingin Anda coba?" />
                  </InputWrapper>
                </div>
              )}
              {selectedSingleDoc === AdminDocType.BestPractice && (
                <div className="space-y-5 animate-fade-in">
                  <InputWrapper label="Situasi & Tantangan" icon={AlertCircle} accentClass={styles.accent}>
                    <textarea name="masalah" rows={3} value={formData.masalah} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none`} placeholder="Kondisi awal siswa dan hambatan yang dihadapi..." />
                  </InputWrapper>
                  <InputWrapper label="Aksi & Strategi (STAR)" icon={Zap} accentClass={styles.accent}>
                    <textarea name="solusi" rows={3} value={formData.solusi} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 ${styles.ring} outline-none`} placeholder="Langkah-langkah jitu yang Anda lakukan..." />
                  </InputWrapper>
                </div>
              )}
              {selectedSingleDoc === AdminDocType.IdeInovasi && (
                <div className="p-10 text-center">
                  <Sparkles className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                  <p className="text-slate-500">Silakan isi kolom Identitas & Topik Materi di atas. AI akan merancang inovasi alat peraga yang relevan untuk Anda.</p>
                </div>
              )}
            </div>
          </div>
        );

      case AppCategory.Kinerja:
      case AppCategory.Bimbingan:
        return (
          <div className="animate-fade-in-up">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <label className={`block text-sm font-bold mb-4 ${styles.text}`}>Pilih Jenis Laporan</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {(category === AppCategory.Kinerja ?
                  [{ id: AdminDocType.LaporanDiklat, label: 'Laporan Diklat' }, { id: AdminDocType.RefleksiDiri, label: 'Refleksi Pembelajaran' }] :
                  [{ id: AdminDocType.JurnalSikap, label: 'Jurnal Sikap' }, { id: AdminDocType.SkenarioRestitusi, label: 'Segitiga Restitusi' }]
                ).map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedSingleDoc(item.id)}
                    className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${selectedSingleDoc === item.id ? `${styles.bg} ${styles.border} ring-1 ring-current` : 'bg-slate-50 border-slate-100'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedSingleDoc === item.id ? 'border-current' : 'border-slate-400'}`}>
                      {selectedSingleDoc === item.id && <div className="w-3 h-3 rounded-full bg-current"></div>}
                    </div>
                    <span className="font-bold text-slate-700">{item.label}</span>
                  </div>
                ))}
              </div>

              {selectedSingleDoc === AdminDocType.LaporanDiklat && (
                <div className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputWrapper label="Nama Diklat / Webinar" accentClass={styles.accent}>
                      <input type="text" name="namaDiklat" required value={formData.namaDiklat} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 ${styles.ring} outline-none`} />
                    </InputWrapper>
                    <InputWrapper label="Penyelenggara" accentClass={styles.accent}>
                      <input type="text" name="penyelenggara" required value={formData.penyelenggara} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 ${styles.ring} outline-none`} />
                    </InputWrapper>
                  </div>
                  <InputWrapper label="Materi Inti yang Dipelajari" accentClass={styles.accent}>
                    <textarea name="topik" required rows={3} value={formData.topik} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 ${styles.ring} outline-none`} />
                  </InputWrapper>
                </div>
              )}

              {(selectedSingleDoc === AdminDocType.RefleksiDiri || selectedSingleDoc === AdminDocType.JurnalSikap || selectedSingleDoc === AdminDocType.SkenarioRestitusi) && (
                <div className="animate-fade-in">
                  <InputWrapper label="Deskripsi Kasus / Kejadian / Pengalaman" icon={Quote} accentClass={styles.accent}>
                    <textarea name="kasusSiswa" required rows={5} value={formData.kasusSiswa} onChange={handleFormChange} className={`w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 ${styles.ring} outline-none bg-slate-50`} placeholder="Ceritakan apa yang terjadi secara spesifik..." />
                  </InputWrapper>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden">

      {/* Header Section with Gradient */}
      <div className={`relative px-6 py-10 sm:px-10 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-90`}></div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 mb-4 opacity-90">
            {category === AppCategory.Administrasi && <LayoutDashboard className="w-6 h-6" />}
            {category === AppCategory.Publikasi && <BookOpen className="w-6 h-6" />}
            {category === AppCategory.Kinerja && <GraduationCap className="w-6 h-6" />}
            {category === AppCategory.Bimbingan && <Users className="w-6 h-6" />}
            <span className="text-sm font-bold tracking-widest uppercase opacity-80">{category}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
            {category === AppCategory.Administrasi && "Selesaikan Administrasi dalam Sekejap."}
            {category === AppCategory.Publikasi && "Tulis Karya Ilmiah Tanpa Hambatan."}
            {category === AppCategory.Kinerja && "Laporan Kinerja yang Memukau."}
            {category === AppCategory.Bimbingan && "Catat Perkembangan Siswa dengan Hati."}
          </h2>
          <p className="text-white/80 text-lg max-w-2xl font-light">
            {category === AppCategory.Administrasi ? "Hemat waktu berharga Anda. Biarkan AI menyusun Modul Ajar, ATP, dan perangkat lainnya secara profesional." :
              "Fokus pada ide inovasi Anda, biarkan kami yang merapikan struktur kalimat dan formatnya."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10 space-y-8">

        {/* API Key Warning Banner */}
        {!hasApiKey && onOpenSettings && (
          <ApiKeyBanner onOpenSettings={onOpenSettings} />
        )}

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
              <InputWrapper label="Nama Lengkap & Gelar" accentClass={styles.accent}>
                <input type="text" name="nama" value={identity.nama} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" placeholder="Contoh: Dwi Wulandari, S.Pd" />
              </InputWrapper>

              <InputWrapper label="NIP Guru" accentClass={styles.accent}>
                <input type="text" name="nip" value={identity.nip} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" placeholder="Opsional" />
              </InputWrapper>

              <InputWrapper label="Nama Sekolah" accentClass={styles.accent}>
                <input type="text" name="sekolah" value={identity.sekolah} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" placeholder="SMP NEGERI ..." />
              </InputWrapper>

              <InputWrapper label="Kota/Kabupaten" accentClass={styles.accent}>
                <input type="text" name="kota" value={identity.kota} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" placeholder="Bandung, Jakarta, Surabaya..." />
              </InputWrapper>

              <InputWrapper label="Tahun Ajaran" accentClass={styles.accent}>
                <input type="text" name="tahunAjaran" value={identity.tahunAjaran} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" />
              </InputWrapper>

              <InputWrapper label="Kepala Sekolah" accentClass={styles.accent}>
                <input type="text" name="kepalaSekolah" value={identity.kepalaSekolah} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" />
              </InputWrapper>

              <div className="grid grid-cols-2 gap-4">
                <InputWrapper label="NIP Kepala Sekolah" accentClass={styles.accent}>
                  <input type="text" name="nipKepala" value={identity.nipKepala} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none" placeholder="Opsional" />
                </InputWrapper>
                <InputWrapper label="Semester" accentClass={styles.accent}>
                  <select name="semester" value={identity.semester} onChange={handleIdentityChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-400 outline-none bg-white">
                    <option value="1 (Ganjil)">1 (Ganjil)</option>
                    <option value="2 (Genap)">2 (Genap)</option>
                  </select>
                </InputWrapper>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Form Content */}
        {renderCategoryInputs()}

        {/* Document Selection - "Shopping Cart" Style for Admin */}
        {category === AppCategory.Administrasi && (
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
                      className={`cursor-pointer px-3 py-3 rounded-xl border flex items-center gap-2 transition-all duration-200 ${selectedDocs.includes(doc) ? `bg-white border-${styles.accent.split('-')[1]}-500 shadow-md ring-1 ring-${styles.accent.split('-')[1]}-500` : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
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
        )}

        {/* Hero Submit Button */}
        <div className="pt-4 pb-8">
          <button
            type="submit"
            disabled={isLoading || !hasApiKey || (category === AppCategory.Administrasi && selectedDocs.length === 0)}
            className={`w-full py-5 rounded-2xl text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${!hasApiKey ? 'bg-slate-400 cursor-not-allowed' : styles.button}`}
          >
            {/* Glossy Effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 pointer-events-none"></div>

            {isLoading ? (
              <span className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/90"></div>
                {loadingStatus || 'Sedang Meracik Keajaiban...'}
              </span>
            ) : (
              <>
                <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-pulse" />
                <span>
                  {category === AppCategory.Administrasi
                    ? `Buat ${selectedDocs.length} Dokumen Ajaib Sekarang`
                    : 'Mulai Tulis Dokumen Saya'}
                </span>
                <span className="text-xs font-normal opacity-80 bg-black/10 px-2 py-1 rounded-lg ml-2 group-hover:bg-black/20 transition-colors">
                  Hemat ±3 Jam Kerja
                </span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400 mt-4">
            Didukung oleh Gemini AI Pro • Privasi Data Terjamin • Dibuat dengan ❤️ untuk Guru Indonesia
          </p>
        </div>

      </form>
    </div>
  );
};

export default ModulGenerator;