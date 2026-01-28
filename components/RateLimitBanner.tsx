import React from 'react';
import { AlertTriangle, Key, ExternalLink, RefreshCw } from 'lucide-react';

interface RateLimitBannerProps {
    onOpenSettings: () => void;
    onRetry?: () => void;
    errorMessage?: string;
}

/**
 * Banner yang muncul saat rate limit/429 error terjadi
 * Mengarahkan user untuk menggunakan API key pribadi
 */
const RateLimitBanner: React.FC<RateLimitBannerProps> = ({ onOpenSettings, onRetry, errorMessage }) => {
    return (
        <div className="mb-6 animate-fade-in">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-red-800 mb-1 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Batas Penggunaan AI Tercapai
                        </h3>
                        <p className="text-sm text-red-700 mb-3 leading-relaxed">
                            Server sedang sibuk atau batas kuota tercapai.
                            <strong> Gunakan API Key pribadi Anda</strong> untuk pengalaman terbaik tanpa batas.
                        </p>

                        {errorMessage && (
                            <div className="bg-red-100/50 border border-red-200 rounded-lg p-3 mb-4">
                                <p className="text-xs text-red-600 font-mono">{errorMessage}</p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={onOpenSettings}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
                            >
                                <Key className="w-4 h-4" />
                                Masukkan API Key Pribadi
                            </button>

                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 text-red-700 text-sm font-medium rounded-xl border border-red-200 transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Buat API Key Gratis
                            </a>

                            {onRetry && (
                                <button
                                    onClick={onRetry}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-all"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Coba Lagi
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-4 pt-4 border-t border-red-200/50">
                    <p className="text-xs text-red-600 font-medium mb-2">Mengapa ini terjadi?</p>
                    <ul className="text-xs text-red-700 space-y-1 ml-4 list-disc">
                        <li>Banyak pengguna menggunakan layanan secara bersamaan</li>
                        <li>Kuota API gratis memiliki batas pemakaian per menit</li>
                        <li>Dengan <strong>API Key pribadi</strong>, Anda mendapat kuota terpisah dan lebih cepat</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RateLimitBanner;
