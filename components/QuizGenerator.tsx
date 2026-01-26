
import React, { useState, useRef } from 'react';
import { QuizRequest, TeacherIdentity } from '../types';
import { FileText, Upload, BrainCircuit, UserCircle, ChevronUp, ChevronDown, Sparkles, X, CheckCircle2, Layers, BookOpen, Calculator, PenTool } from 'lucide-react';

interface QuizGeneratorProps {
  onSubmit: (data: QuizRequest) => void;
  isLoading: boolean;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onSubmit, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jumlahSoal, setJumlahSoal] = useState<number>(10);
  const [jenisSoal, setJenisSoal] = useState<'Pilihan Ganda' | 'Esai' | 'Campuran'>('Pilihan Ganda');
  const [topik, setTopik] = useState('');
  const [mataPelajaran, setMataPelajaran] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const [identity, setIdentity] = useState<TeacherIdentity>({
    nama: '',
    nip: '',
    sekolah: '',
    kepalaSekolah: '',
    nipKepala: '',
    semester: '2 (Genap)',
    tahunAjaran: '2025/2026'
  });
  const [showIdentity, setShowIdentity] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setIdentity({ ...identity, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      // Auto-fill topik based on filename clean up
      const filename = selectedFile.name.replace('.pdf', '').replace(/[-_]/g, ' ');
      if (!topik) setTopik(filename);
    } else {
      alert('Mohon unggah file PDF saja.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:application/pdf;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Mohon unggah file PDF materi terlebih dahulu.");
      return;
    }

    try {
      const base64 = await convertToBase64(file);
      onSubmit({
        fileBase64: base64,
        mimeType: file.type,
        jumlahSoal,
        jenisSoal,
        identity,
        topik,
        mataPelajaran
      });
    } catch (error) {
      console.error("File conversion error", error);
      alert("Gagal memproses file. Silakan coba lagi.");
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const styles = {
    bg: 'bg-violet-50',
    text: 'text-violet-900',
    border: 'border-violet-100',
    accent: 'text-violet-600',
    gradient: 'from-violet-600 to-fuchsia-600',
    button: 'bg-violet-600 hover:bg-violet-700',
    ring: 'focus:ring-violet-500'
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden animate-fade-in-up">
        {/* Header Section */}
        <div className={`relative px-6 py-10 sm:px-10 overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-90`}></div>
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-white">
                <div className="flex items-center gap-3 mb-4 opacity-90">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <BrainCircuit className="w-5 h-5 text-white"/>
                    </div>
                    <span className="text-sm font-bold tracking-widest uppercase opacity-80">Bank Soal AI</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
                    Ubah Buku Paket Jadi Soal Ujian.
                </h2>
                <p className="text-white/80 text-lg max-w-2xl font-light">
                    Unggah materi pelajaran (PDF), dan AI akan menyusun soal HOTS, LOTS, beserta kunci jawaban lengkap secara otomatis.
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
                 <h3 className="text-sm font-bold text-slate-800">Profil Guru & Kop Soal</h3>
                 <p className="text-[10px] text-slate-500">Data ini akan muncul di header lembar soal</p>
               </div>
             </div>
             {showIdentity ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
          
          {showIdentity && (
            <div className="p-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Nama Guru</label>
                <input type="text" name="nama" value={identity.nama} onChange={handleIdentityChange} className="w-full px-4 py-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-violet-200 outline-none" placeholder="Nama Lengkap" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Sekolah</label>
                <input type="text" name="sekolah" value={identity.sekolah} onChange={handleIdentityChange} className="w-full px-4 py-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-violet-200 outline-none" placeholder="Nama Sekolah" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Tahun Ajaran</label>
                <input type="text" name="tahunAjaran" value={identity.tahunAjaran} onChange={handleIdentityChange} className="w-full px-4 py-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-violet-200 outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Semester</label>
                <select name="semester" value={identity.semester} onChange={handleIdentityChange} className="w-full px-4 py-2 border rounded-lg text-sm mt-1 focus:ring-2 focus:ring-violet-200 outline-none bg-white">
                    <option value="1 (Ganjil)">1 (Ganjil)</option>
                    <option value="2 (Genap)">2 (Genap)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-violet-600" /> Unggah Materi (PDF)
                </label>
                
                {!file ? (
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all ${isDragging ? 'border-violet-500 bg-violet-50' : 'border-slate-300 hover:border-violet-400 hover:bg-slate-50'}`}
                    >
                        <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-4 text-violet-600">
                            <FileText className="w-8 h-8" />
                        </div>
                        <p className="font-bold text-slate-700">Klik untuk upload atau drag PDF</p>
                        <p className="text-xs text-slate-400 mt-2">Maksimal 10MB</p>
                        <input 
                            type="file" 
                            accept="application/pdf" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            className="hidden" 
                        />
                    </div>
                ) : (
                    <div className="border border-violet-200 bg-violet-50 rounded-2xl p-6 relative h-64 flex flex-col items-center justify-center text-center">
                         <button 
                            type="button" 
                            onClick={removeFile}
                            className="absolute top-4 right-4 p-1.5 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm hover:shadow-md transition-all"
                         >
                            <X className="w-4 h-4" />
                         </button>
                         <FileText className="w-16 h-16 text-violet-600 mb-4" />
                         <p className="font-bold text-violet-900 line-clamp-2 px-4">{file.name}</p>
                         <p className="text-xs text-violet-600 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                         <div className="flex items-center gap-2 mt-4 px-4 py-1.5 bg-white rounded-full text-xs font-bold text-green-600 border border-green-200">
                             <CheckCircle2 className="w-3.5 h-3.5" /> Siap Diproses
                         </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                     <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-violet-600" /> Konfigurasi Soal
                    </label>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Mata Pelajaran</label>
                        <div className="relative">
                            <input type="text" value={mataPelajaran} onChange={(e) => setMataPelajaran(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all" placeholder="Contoh: IPA / Sejarah" />
                            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Topik / Materi Spesifik</label>
                        <input type="text" value={topik} onChange={(e) => setTopik(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all" placeholder="Otomatis dari nama file (bisa diedit)" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Jumlah Soal</label>
                             <div className="relative">
                                <input type="number" min={1} max={50} value={jumlahSoal} onChange={(e) => setJumlahSoal(parseInt(e.target.value))} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all" />
                                <Calculator className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                             </div>
                        </div>
                        <div>
                             <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Jenis Soal</label>
                             <div className="relative">
                                <select value={jenisSoal} onChange={(e) => setJenisSoal(e.target.value as any)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all bg-white appearance-none">
                                    <option value="Pilihan Ganda">Pilihan Ganda</option>
                                    <option value="Esai">Esai / Uraian</option>
                                    <option value="Campuran">Campuran</option>
                                </select>
                                <PenTool className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                             </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading || !file}
                        className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2 group relative overflow-hidden ${!file ? 'bg-slate-300 cursor-not-allowed' : styles.button}`}
                    >
                         {isLoading ? (
                            <span className="flex items-center gap-2">Memproses PDF...</span>
                         ) : (
                            <>
                                <Sparkles className="w-5 h-5 animate-pulse" /> Buat Soal Sekarang
                            </>
                         )}
                    </button>
                    {!file && <p className="text-center text-xs text-slate-400 mt-2">Upload file PDF untuk mengaktifkan tombol</p>}
                </div>
            </div>
        </div>
      </form>
    </div>
  );
};

export default QuizGenerator;
