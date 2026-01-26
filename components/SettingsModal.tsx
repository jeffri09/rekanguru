import React, { useState, useEffect } from 'react';
import { X, Save, Key, Trash2, AlertTriangle, CheckCircle2, Loader2, Signal } from 'lucide-react';
import { testConnection } from '../services/geminiService';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [savedKey, setSavedKey] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'failed'>('idle');

    useEffect(() => {
        if (isOpen) {
            const stored = localStorage.getItem('custom_gemini_api_key');
            if (stored) {
                setSavedKey(stored);
                setApiKey(stored);
            } else {
                setSavedKey(null);
                setApiKey('');
            }
            setIsSaved(false);
            setTestStatus('idle');
        }
    }, [isOpen]);

    const handleSave = () => {
        if (!apiKey.trim()) return;
        localStorage.setItem('custom_gemini_api_key', apiKey.trim());
        setSavedKey(apiKey.trim());
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus API Key kustom? Aplikasi akan kembali menggunakan API Key default (rotasi).')) {
            localStorage.removeItem('custom_gemini_api_key');
            setSavedKey(null);
            setApiKey('');
            setTestStatus('idle');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-800">
                        <Key className="w-5 h-5 text-indigo-600" />
                        <h2 className="font-bold text-lg">Pengaturan API Key</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-800 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-indigo-600 shrink-0" />
                        <p>
                            Masukkan API Key Gemini Anda sendiri untuk menghindari batas penggunaan (Rate Limit) dan mendapatkan performa yang lebih stabil.
                            Key tersimpan secara lokal di browser Anda.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 block">Gemini API Key</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => {
                                    setApiKey(e.target.value);
                                    setTestStatus('idle');
                                }}
                                placeholder="AIzaSy..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
                            />
                            <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <p className="text-xs text-slate-500 flex justify-between">
                            <span>Dapatkan key di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Google AI Studio</a></span>
                            {savedKey && <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle2 size={12} /> Tersimpan</span>}
                        </p>
                    </div>

                    {testStatus === 'failed' && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs flex items-center gap-2 animate-fade-in">
                            <AlertTriangle size={16} /> API Key tidak valid atau kuota habis. Pastikan key benar.
                        </div>
                    )}
                    {testStatus === 'success' && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-xs flex items-center gap-2 animate-fade-in">
                            <CheckCircle2 size={16} /> Koneksi berhasil! Key valid dan siap digunakan.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        {savedKey && (
                            <button
                                onClick={handleDelete}
                                className="text-red-500 hover:text-red-700 p-2 rounded-lg transition-colors"
                                title="Hapus Key"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                setIsTesting(true);
                                setTestStatus('idle');
                                const valid = await testConnection(apiKey);
                                setTestStatus(valid ? 'success' : 'failed');
                                setIsTesting(false);
                            }}
                            disabled={!apiKey.trim() || isTesting}
                            className="px-3 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            {isTesting ? <Loader2 size={16} className="animate-spin" /> : <Signal size={16} />}
                            {isTesting ? 'Testing...' : 'Test Koneksi'}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!apiKey.trim() || apiKey === savedKey || isTesting || testStatus === 'failed'}
                            className={`px-6 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2 shadow-sm transition-all
                ${!apiKey.trim() || apiKey === savedKey || isTesting || testStatus === 'failed'
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : isSaved
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 shadow-indigo-100'
                                }`}
                        >
                            {isSaved ? (
                                <>
                                    <CheckCircle2 size={16} /> Tersimpan
                                </>
                            ) : (
                                <>
                                    <Save size={16} /> Simpan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
