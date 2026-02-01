import React from 'react';
import { FileText, Download, Trash2, Eye, Clock, FolderOpen } from 'lucide-react';
import { GeneratedDocument } from '../types';

interface ResultsPageProps {
    documents: GeneratedDocument[];
    onViewDocument: (doc: GeneratedDocument) => void;
    onDeleteDocument: (id: string) => void;
    onDeleteAll: () => void;
    onBack: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({
    documents,
    onViewDocument,
    onDeleteDocument,
    onDeleteAll,
    onBack
}) => {
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <button
                            onClick={onBack}
                            className="text-indigo-600 font-medium hover:text-indigo-700 mb-2 flex items-center gap-2"
                        >
                            ← Kembali ke Beranda
                        </button>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Hasil Generate</h1>
                        <p className="text-slate-600">Semua dokumen yang telah Anda buat tersimpan di sini</p>
                    </div>

                    {documents.length > 0 && (
                        <button
                            onClick={() => {
                                if (confirm('Hapus semua dokumen? Tindakan ini tidak dapat dibatalkan.')) {
                                    onDeleteAll();
                                }
                            }}
                            className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Hapus Semua
                        </button>
                    )}
                </div>

                {/* Empty State */}
                {documents.length === 0 && (
                    <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FolderOpen className="w-10 h-10 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Dokumen</h2>
                        <p className="text-slate-600 mb-6">Dokumen yang Anda buat akan muncul di sini</p>
                        <button
                            onClick={onBack}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                            Mulai Buat Dokumen
                        </button>
                    </div>
                )}

                {/* Document List */}
                {documents.length > 0 && (
                    <div className="space-y-4">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1 min-w-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-slate-900 truncate">{doc.title}</h3>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatDate(doc.createdAt)}
                                                </span>
                                                {doc.metadata?.docType && (
                                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                                        {doc.metadata.docType}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onViewDocument(doc)}
                                            className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                            title="Lihat Dokumen"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Hapus dokumen ini?')) {
                                                    onDeleteDocument(doc.id);
                                                }
                                            }}
                                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats */}
                {documents.length > 0 && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl text-center">
                        <p className="text-slate-600">
                            Total <span className="font-bold text-indigo-600">{documents.length}</span> dokumen tersimpan
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsPage;
