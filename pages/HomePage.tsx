import React from 'react';
import { Sparkles, FileText, Zap, Clock, Shield, ArrowRight, CheckCircle } from 'lucide-react';

interface HomePageProps {
    onNavigate: (page: 'generator' | 'results' | 'settings') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-violet-600/5" />
                <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            Powered by AI - Kurikulum Merdeka
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                            Hemat <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">5+ Jam</span> Per Minggu
                        </h1>

                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Buat dokumen administrasi guru lengkap dengan bantuan AI.
                            <strong className="text-slate-800"> Fokus mengajar, bukan administrasi.</strong>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button
                                onClick={() => onNavigate('generator')}
                                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Mulai Buat Dokumen
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => onNavigate('settings')}
                                className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                            >
                                Lihat Cara Pakai
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Mengapa RekanGuru?</h2>
                        <p className="text-slate-600">Solusi praktis untuk guru sibuk yang ingin fokus pada pembelajaran</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group p-8 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Clock className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Hemat Waktu</h3>
                            <p className="text-slate-600">Dokumen yang biasa memakan waktu berjam-jam, selesai dalam hitungan menit dengan bantuan AI.</p>
                        </div>

                        <div className="group p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Standar Kurikulum</h3>
                            <p className="text-slate-600">Semua dokumen dibuat sesuai standar Kurikulum Merdeka terbaru dengan format resmi.</p>
                        </div>

                        <div className="group p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl hover:shadow-xl transition-all">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Mudah Digunakan</h3>
                            <p className="text-slate-600">Cukup isi form sederhana, AI akan membuat dokumen lengkap yang siap digunakan.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-gradient-to-br from-slate-50 to-indigo-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Cara Pakai</h2>
                        <p className="text-slate-600">3 langkah mudah untuk membuat dokumen administrasi</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Isi Form', desc: 'Masukkan informasi dasar seperti mata pelajaran, fase, dan topik pembelajaran.' },
                            { step: '2', title: 'AI Bekerja', desc: 'Tunggu beberapa detik sementara AI membuat dokumen sesuai standar Kurikulum Merdeka.' },
                            { step: '3', title: 'Download', desc: 'Dokumen siap! Download dalam format Word dan gunakan langsung di sekolah.' }
                        ].map((item) => (
                            <div key={item.step} className="relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 mt-4">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Document Types Section */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Dokumen yang Dapat Dibuat</h2>
                        <p className="text-slate-600">Lengkap untuk semua kebutuhan administrasi guru</p>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[
                            'Analisis CP & TP',
                            'ATP (Alur Tujuan Pembelajaran)',
                            'Modul Ajar (RPP Plus)',
                            'Bahan Bacaan',
                            'KKTP',
                            'Program Tahunan',
                            'Program Semester',
                            'Asesmen Diagnostik',
                            'Asesmen Formatif',
                            'Asesmen Sumatif',
                            'Kisi-Kisi Penilaian',
                            'Bank Soal'
                        ].map((doc) => (
                            <div key={doc} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors">
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                <span className="text-sm font-medium text-slate-700">{doc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Siap Menghemat Waktu Anda?
                    </h2>
                    <p className="text-indigo-100 text-lg mb-8">
                        Ribuan guru sudah merasakan manfaatnya. Giliran Anda sekarang!
                    </p>
                    <button
                        onClick={() => onNavigate('generator')}
                        className="group px-10 py-5 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto"
                    >
                        <FileText className="w-5 h-5" />
                        Buat Dokumen Sekarang
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-slate-900 text-center">
                <p className="text-slate-400 text-sm">
                    © 2026 RekanGuru - Asisten Administrasi Guru Berbasis AI
                </p>
            </footer>
        </div>
    );
};

export default HomePage;
