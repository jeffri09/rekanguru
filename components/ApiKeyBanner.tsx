import React from 'react';
import { AlertTriangle, Key, ExternalLink } from 'lucide-react';

interface ApiKeyBannerProps {
    onOpenSettings: () => void;
}

/**
 * Banner warning yang muncul jika API Key belum dikonfigurasi
 * Memberikan instruksi jelas kepada pengguna untuk input API Key
 */
const ApiKeyBanner: React.FC<ApiKeyBannerProps> = ({ onOpenSettings }) => {
    return (
        <div className="mb-6 animate-fade-in">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Key className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-amber-800 mb-1 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            API Key Diperlukan
                        </h3>
                        <p className="text-sm text-amber-700 mb-4 leading-relaxed">
                            Untuk menggunakan fitur AI, Anda perlu memasukkan <strong>Gemini API Key</strong> terlebih dahulu.
                            API Key gratis dan dapat dibuat dalam 30 detik.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={onOpenSettings}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
                            >
                                <Key className="w-4 h-4" />
                                Masukkan API Key
                            </button>

                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-amber-50 text-amber-700 text-sm font-medium rounded-xl border border-amber-200 transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Buat API Key Gratis
                            </a>
                        </div>
                    </div>
                </div>

                {/* Quick Guide */}
                <div className="mt-4 pt-4 border-t border-amber-200/50">
                    <p className="text-xs text-amber-600 font-medium mb-2">Langkah Cepat:</p>
                    <ol className="text-xs text-amber-700 space-y-1 ml-4 list-decimal">
                        <li>Klik <strong>"Buat API Key Gratis"</strong> → Login dengan akun Google</li>
                        <li>Klik <strong>"Create API key"</strong> → Copy API Key yang muncul</li>
                        <li>Kembali ke sini → Klik <strong>"Masukkan API Key"</strong> → Paste dan Simpan</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyBanner;
