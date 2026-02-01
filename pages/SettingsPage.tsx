import React from 'react';
import { Key, ExternalLink, CheckCircle, AlertCircle, Zap, Shield, Gift } from 'lucide-react';

interface SettingsPageProps {
    onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
    const [apiKey, setApiKey] = React.useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('custom_gemini_api_key') || '';
        }
        return '';
    });
    const [saved, setSaved] = React.useState(false);

    const handleSave = () => {
        if (typeof window !== 'undefined') {
            if (apiKey.trim()) {
                localStorage.setItem('custom_gemini_api_key', apiKey.trim());
            } else {
                localStorage.removeItem('custom_gemini_api_key');
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="text-indigo-600 font-medium hover:text-indigo-700 mb-4 flex items-center gap-2"
                    >
                        ← Kembali ke Beranda
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Pengaturan API</h1>
                    <p className="text-slate-600">Kelola API key untuk menggunakan fitur AI</p>
                </div>

                {/* API Key Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center">
                            <Key className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">API Key Gemini</h2>
                            <p className="text-slate-500 text-sm">Kunci untuk mengakses AI Google Gemini</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Masukkan API Key Anda
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="AIzaSy..."
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            {saved ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Tersimpan!
                                </>
                            ) : (
                                'Simpan API Key'
                            )}
                        </button>
                    </div>
                </div>

                {/* How to Get API Key */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Cara Mendapatkan API Key (GRATIS)</h2>

                    <div className="space-y-6">
                        {[
                            {
                                step: 1,
                                title: 'Buka Google AI Studio',
                                desc: 'Kunjungi aistudio.google.com dan login dengan akun Google Anda.'
                            },
                            {
                                step: 2,
                                title: 'Klik "Get API Key"',
                                desc: 'Di halaman utama, cari tombol "Get API Key" atau "Create API Key".'
                            },
                            {
                                step: 3,
                                title: 'Buat Project Baru',
                                desc: 'Pilih "Create API key in new project" untuk membuat key baru.'
                            },
                            {
                                step: 4,
                                title: 'Salin API Key',
                                desc: 'Copy API key yang muncul dan paste di form di atas.'
                            }
                        ].map((item) => (
                            <div key={item.step} className="flex gap-4">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                    {item.step}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-slate-600 text-sm">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                        Buka Google AI Studio
                    </a>
                </div>

                {/* Benefits of Own API Key */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Keuntungan Menggunakan API Key Sendiri</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Gift className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">100% Gratis</h3>
                                <p className="text-slate-600 text-sm">Google memberikan kuota gratis yang cukup besar untuk penggunaan pribadi.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Zap className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Tidak Ada Antrian</h3>
                                <p className="text-slate-600 text-sm">Akses langsung tanpa menunggu giliran pengguna lain.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Lebih Stabil</h3>
                                <p className="text-slate-600 text-sm">Tidak terpengaruh limit rate dari pengguna lain.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning */}
                <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-amber-800">Penting!</h3>
                        <p className="text-amber-700 text-sm">
                            Jangan bagikan API key Anda kepada orang lain. API key bersifat rahasia dan terkait dengan akun Google Anda.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
