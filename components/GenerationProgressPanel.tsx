import React from 'react';
import { Play, Download, Trash2, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { GenerationProgress, AdminDocType } from '../types';

interface GenerationProgressPanelProps {
    progress: GenerationProgress;
    onResume: () => void;
    onDownloadCompleted: () => void;
    onClear: () => void;
    isResuming?: boolean;
}

/**
 * Panel yang menampilkan status generasi dokumen yang tertunda/error
 * Memungkinkan user untuk melanjutkan, download, atau hapus progress
 */
const GenerationProgressPanel: React.FC<GenerationProgressPanelProps> = ({
    progress,
    onResume,
    onDownloadCompleted,
    onClear,
    isResuming = false
}) => {
    const totalDocs = progress.selectedTypes.length;
    const completedCount = progress.completedDocs.length;
    const pendingCount = progress.pendingTypes.length;
    const progressPercent = Math.round((completedCount / totalDocs) * 100);

    const getStatusIcon = () => {
        switch (progress.status) {
            case 'error':
                return <XCircle className="w-6 h-6 text-red-500" />;
            case 'paused':
                return <Clock className="w-6 h-6 text-amber-500" />;
            case 'completed':
                return <CheckCircle className="w-6 h-6 text-green-500" />;
            default:
                return <Clock className="w-6 h-6 text-blue-500 animate-spin" />;
        }
    };

    const getStatusText = () => {
        switch (progress.status) {
            case 'error':
                return 'Terhenti karena error';
            case 'paused':
                return 'Dijeda';
            case 'completed':
                return 'Selesai';
            default:
                return 'Sedang berjalan...';
        }
    };

    const getStatusColor = () => {
        switch (progress.status) {
            case 'error':
                return 'border-red-200 bg-red-50';
            case 'paused':
                return 'border-amber-200 bg-amber-50';
            case 'completed':
                return 'border-green-200 bg-green-50';
            default:
                return 'border-blue-200 bg-blue-50';
        }
    };

    return (
        <div className={`mb-6 rounded-2xl border-2 ${getStatusColor()} p-5 shadow-sm animate-fade-in`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <div>
                        <h3 className="font-bold text-slate-800">Generasi Dokumen</h3>
                        <p className="text-sm text-slate-500">{getStatusText()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">{completedCount}/{totalDocs}</p>
                    <p className="text-xs text-slate-500">dokumen selesai</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mb-4">
                <div
                    className={`h-full transition-all duration-500 ${progress.status === 'error' ? 'bg-red-500' :
                            progress.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Document List */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {progress.selectedTypes.map((docType) => {
                    const isCompleted = progress.completedDocs.some(d => d.docType === docType);
                    const isPending = progress.pendingTypes.includes(docType);

                    return (
                        <div
                            key={docType}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${isCompleted
                                    ? 'bg-green-100 text-green-700'
                                    : isPending
                                        ? 'bg-slate-100 text-slate-500'
                                        : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {isCompleted ? (
                                <CheckCircle className="w-3 h-3" />
                            ) : (
                                <FileText className="w-3 h-3" />
                            )}
                            <span className="truncate">{docType}</span>
                        </div>
                    );
                })}
            </div>

            {/* Error Message */}
            {progress.lastError && (
                <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-red-700 font-medium">Error: {progress.lastError}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                {pendingCount > 0 && progress.status !== 'in_progress' && (
                    <button
                        onClick={onResume}
                        disabled={isResuming}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                        {isResuming ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Melanjutkan...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                Lanjutkan ({pendingCount} tersisa)
                            </>
                        )}
                    </button>
                )}

                {completedCount > 0 && (
                    <button
                        onClick={onDownloadCompleted}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Download {completedCount} Dokumen
                    </button>
                )}

                <button
                    onClick={onClear}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-xl transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                    Hapus & Mulai Baru
                </button>
            </div>
        </div>
    );
};

export default GenerationProgressPanel;
