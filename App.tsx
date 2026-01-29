import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Sparkles, FileText, Menu, X, ChevronLeft, Loader2, Trash2, Settings } from 'lucide-react';
import ModulGenerator from './components/ModulGenerator';
import QuizGenerator from './components/QuizGenerator';
import ResultDisplay from './components/ResultDisplay';
import SettingsModal from './components/SettingsModal';
import RateLimitBanner from './components/RateLimitBanner';
import GenerationProgressPanel from './components/GenerationProgressPanel';
import { generateAdminDocs, generateQuizFromPDF } from './services/geminiService';
import { AppCategory, GeneratedDocument, AdminRequest, AdminDocType, QuizRequest, GenerationProgress } from './types';

const PROGRESS_STORAGE_KEY = 'rekanGuruProgress';

const App: React.FC = () => {
    // Gunakan useLayoutEffect agar perubahan DOM terjadi sinkron sebelum browser painting
    // Ini mencegah "flash" atau loader yang nyangkut
    useLayoutEffect(() => {
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.classList.add('hidden-loader');
            // Hapus elemen dari DOM setelah transisi CSS selesai (300ms)
            const timer = setTimeout(() => {
                if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
            }, 350);
            return () => clearTimeout(timer);
        }
    }, []);

    const [documents, setDocuments] = useState<GeneratedDocument[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('rekanGuruDocs');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Corrupted storage:", e);
            return [];
        }
    });

    // State untuk progress yang bisa dilanjutkan
    const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(() => {
        if (typeof window === 'undefined') return null;
        try {
            const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Hanya kembalikan jika masih ada yang pending
                if (parsed && parsed.pendingTypes && parsed.pendingTypes.length > 0) {
                    return parsed;
                }
            }
            return null;
        } catch (e) {
            console.error("Corrupted progress storage:", e);
            return null;
        }
    });

    const [currentView, setCurrentView] = useState<'form' | 'results'>('form');
    const [activeCategory, setActiveCategory] = useState<AppCategory>(AppCategory.Administrasi);
    const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingStatus, setLoadingStatus] = useState('');
    const [showRateLimitError, setShowRateLimitError] = useState(false);
    const [rateLimitErrorMessage, setRateLimitErrorMessage] = useState('');
    const [downloadMode, setDownloadMode] = useState<'combined' | 'separate'>('combined');

    useEffect(() => {
        try {
            localStorage.setItem('rekanGuruDocs', JSON.stringify(documents));
        } catch (e) {
            console.error("Gagal menyimpan ke storage:", e);
        }
    }, [documents]);

    // Save generation progress to localStorage
    const saveProgress = (progressData: GenerationProgress) => {
        try {
            localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
            setGenerationProgress(progressData);
        } catch (e) {
            console.error("Gagal menyimpan progress:", e);
        }
    };

    // Clear generation progress
    const clearProgress = () => {
        try {
            localStorage.removeItem(PROGRESS_STORAGE_KEY);
            setGenerationProgress(null);
            setShowRateLimitError(false);
        } catch (e) {
            console.error("Gagal menghapus progress:", e);
        }
    };

    // Core document generation with partial save
    const handleAdminSubmit = async (data: AdminRequest, selectedTypes: AdminDocType[], existingProgress?: GenerationProgress) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setProgress(5);
        setLoadingStatus('Mempersiapkan...');
        setShowRateLimitError(false);

        // Initialize or use existing progress
        const sessionId = existingProgress?.sessionId || Date.now().toString();
        const currentProgress: GenerationProgress = existingProgress || {
            sessionId,
            requestData: data,
            selectedTypes,
            completedDocs: [],
            pendingTypes: [...selectedTypes],
            status: 'in_progress'
        };
        currentProgress.status = 'in_progress';
        currentProgress.lastError = undefined;
        saveProgress(currentProgress);

        const totalDocs = selectedTypes.length;
        const allContents: string[] = [...currentProgress.completedDocs.map(d => `\n\n---\n\n# 📄 ${d.docType}\n\n${d.content}`)];

        try {
            // Start from pending types
            for (let i = 0; i < currentProgress.pendingTypes.length; i++) {
                const docType = currentProgress.pendingTypes[i];
                const completedCount = currentProgress.completedDocs.length;
                const overallIndex = completedCount + i;

                setLoadingStatus(`Membuat ${docType} (${overallIndex + 1}/${totalDocs})...`);

                // Calculate progress: base progress for completed docs + current doc progress
                const baseProgress = Math.round((overallIndex / totalDocs) * 100);
                const progressPerDoc = 100 / totalDocs;

                try {
                    const content = await generateAdminDocs(
                        { ...data, docType },
                        (p) => setProgress(Math.round(baseProgress + (p * progressPerDoc / 100)))
                    );

                    // Save immediately after success!
                    currentProgress.completedDocs.push({
                        docType,
                        content,
                        timestamp: Date.now()
                    });
                    currentProgress.pendingTypes = currentProgress.pendingTypes.filter(t => t !== docType);
                    saveProgress(currentProgress);

                    // Add to contents
                    if (totalDocs > 1) {
                        allContents.push(`\n\n---\n\n# 📄 ${docType}\n\n${content}`);
                    } else {
                        allContents.push(content);
                    }
                } catch (docError: any) {
                    // Save error state but DON'T lose progress!
                    currentProgress.status = 'error';
                    currentProgress.lastError = docError.message || 'Gagal membuat dokumen';
                    currentProgress.pendingTypes = currentProgress.pendingTypes.filter(t => t !== docType);
                    currentProgress.pendingTypes.unshift(docType); // Put failed doc at front
                    saveProgress(currentProgress);

                    // Check if it's rate limit error
                    const errorMsg = docError.message || '';
                    if (errorMsg.includes('429') || errorMsg.includes('Rate Limit') || errorMsg.includes('quota') || errorMsg.includes('Batas')) {
                        setShowRateLimitError(true);
                        setRateLimitErrorMessage(errorMsg);
                    }

                    setIsProcessing(false);
                    setProgress(0);
                    setLoadingStatus('');
                    return; // Stop but keep saved progress
                }
            }

            // All completed!
            setLoadingStatus('Menyimpan dokumen...');
            setProgress(98);

            const combinedContent = allContents.join('\n');
            const titleSuffix = totalDocs > 1
                ? `${totalDocs} Dokumen - ${data.mataPelajaran || 'Umum'}`
                : `${selectedTypes[0]} - ${data.mataPelajaran || 'Umum'}`;

            const newDoc: GeneratedDocument = {
                id: Date.now().toString(),
                title: titleSuffix,
                type: 'admin',
                content: combinedContent,
                metadata: { identity: data.identity, docType: selectedTypes[0], category: activeCategory },
                createdAt: Date.now()
            };

            setDocuments(prev => [newDoc, ...prev]);
            setActiveDocumentId(newDoc.id);
            setCurrentView('results');

            // Clear progress since completed
            currentProgress.status = 'completed';
            clearProgress();

        } catch (error: any) {
            // Unexpected error - still save what we have
            currentProgress.status = 'error';
            currentProgress.lastError = error.message || 'Terjadi kesalahan';
            saveProgress(currentProgress);

            const errorMsg = error.message || '';
            if (errorMsg.includes('429') || errorMsg.includes('Rate Limit') || errorMsg.includes('quota')) {
                setShowRateLimitError(true);
                setRateLimitErrorMessage(errorMsg);
            }
        } finally {
            setIsProcessing(false);
            setProgress(0);
            setLoadingStatus('');
        }
    };

    // Resume generation from saved progress
    const handleResumeGeneration = async () => {
        if (!generationProgress || generationProgress.pendingTypes.length === 0) return;
        setShowRateLimitError(false);
        await handleAdminSubmit(
            generationProgress.requestData,
            generationProgress.selectedTypes,
            generationProgress
        );
    };

    // Download completed documents from progress
    const handleDownloadCompleted = () => {
        if (!generationProgress || generationProgress.completedDocs.length === 0) return;

        const cssStyle = `
            <style>
                @page { size: A4; margin: 2.54cm; }
                body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; color: #000; }
                h1, h2, h3 { font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
                h1 { font-size: 14pt; text-align: center; }
                h2 { font-size: 13pt; border-bottom: 1px solid #000; }
                h3 { font-size: 12pt; }
                table { width: 100%; border-collapse: collapse; margin: 1em 0; }
                th, td { border: 1px solid #000; padding: 6px; }
                th { background-color: #f0f0f0; font-weight: bold; }
            </style>
        `;

        const convertMarkdownToHtml = (content: string) => {
            return content
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
        };

        const downloadSingleDoc = (docType: string, content: string, index?: number) => {
            const docHtml = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset="utf-8">
                    <title>${docType}</title>
                    ${cssStyle}
                </head>
                <body>
                    <h1 style="text-align: center; font-size: 14pt; font-weight: bold;">${docType}</h1>
                    <div style="white-space: pre-wrap; font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5;">
                        ${convertMarkdownToHtml(content)}
                    </div>
                </body>
                </html>
            `;

            const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const safeTitle = docType.replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_');
            link.download = `${safeTitle || 'dokumen'}.doc`;
            document.body.appendChild(link);

            // Use timeout to stagger downloads for separate mode
            setTimeout(() => {
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, index ? index * 500 : 0);
        };

        if (downloadMode === 'separate') {
            // Download each document separately
            generationProgress.completedDocs.forEach((doc, index) => {
                downloadSingleDoc(doc.docType, doc.content, index);
            });
        } else {
            // Combined mode: all docs in one file
            const documentsHtml = generationProgress.completedDocs
                .map(d => `
                    <div style="page-break-after: always;">
                        <h1 style="text-align: center; font-size: 14pt; font-weight: bold;">${d.docType}</h1>
                        <div style="white-space: pre-wrap; font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5;">
                            ${convertMarkdownToHtml(d.content)}
                        </div>
                    </div>
                `)
                .join('');

            const fullHtml = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset="utf-8">
                    <title>Dokumen Administrasi</title>
                    ${cssStyle}
                </head>
                <body>
                    ${documentsHtml}
                </body>
                </html>
            `;

            const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `dokumen-lengkap-${Date.now()}.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const handleQuizSubmit = async (data: QuizRequest) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setProgress(10);
        setShowRateLimitError(false);

        try {
            const content = await generateQuizFromPDF(data, (p) => setProgress(p));
            const newDoc: GeneratedDocument = {
                id: Date.now().toString(),
                title: `Kuis: ${data.topik}`,
                type: 'quiz',
                content: content,
                metadata: { identity: data.identity, docType: AdminDocType.SoalQuiz, category: AppCategory.Kuis },
                createdAt: Date.now()
            };
            setDocuments(prev => [newDoc, ...prev]);
            setActiveDocumentId(newDoc.id);
            setCurrentView('results');
        } catch (error: any) {
            const errorMsg = error.message || '';
            if (errorMsg.includes('429') || errorMsg.includes('Rate Limit') || errorMsg.includes('quota')) {
                setShowRateLimitError(true);
                setRateLimitErrorMessage(errorMsg);
            } else {
                alert("Kendala AI: " + (error.message || "Gagal memproses PDF"));
            }
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const activeDoc = documents.find(d => d.id === activeDocumentId);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-indigo-600 w-6 h-6" />
                        <h1 className="font-bold text-xl text-slate-800">RekanGuru</h1>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500">
                        <X size={20} />
                    </button>
                </div>
                <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Menu Utama</p>
                    {Object.values(AppCategory).map(cat => (
                        <button
                            key={cat}
                            onClick={() => { setActiveCategory(cat); setCurrentView('form'); setIsSidebarOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all font-medium flex items-center gap-2 ${activeCategory === cat && currentView === 'form' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'hover:bg-slate-100 text-slate-600'}`}
                        >
                            {cat}
                        </button>
                    ))}

                    <div className="pt-8">
                        <div className="flex items-center justify-between px-2 mb-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Riwayat Dokumen</p>
                            {documents.length > 0 && (
                                <button onClick={() => { if (confirm('Hapus semua riwayat?')) setDocuments([]) }} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Hapus Semua"><Trash2 size={12} /></button>
                            )}
                        </div>
                        <div className="space-y-1">
                            {documents.length === 0 && (
                                <div className="px-4 py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                    <FileText className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                                    <p className="text-[10px] text-slate-400">Belum ada dokumen yang dibuat</p>
                                </div>
                            )}
                            {documents.map(doc => (
                                <button
                                    key={doc.id}
                                    onClick={() => { setActiveDocumentId(doc.id); setCurrentView('results'); setIsSidebarOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-xs rounded-lg truncate block border transition-all ${activeDocumentId === doc.id ? 'bg-indigo-50 border-indigo-100 text-indigo-700 font-medium' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {doc.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 py-4 mt-auto border-t border-slate-100">
                        <button
                            onClick={() => { setIsSettingsOpen(true); setIsSidebarOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all group"
                        >
                            <Settings size={18} className="text-slate-400 group-hover:text-indigo-600" />
                            <span className="font-medium text-sm">Pengaturan API</span>
                        </button>
                    </div>
                </nav>
            </aside>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            {/* Main Content - Added md:ml-64 to prevent sidebar overlap on desktop */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative md:ml-64 transition-all duration-300 h-screen">
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 z-20 sticky top-0">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"><Menu size={20} /></button>
                    <span className="font-bold text-indigo-600 text-lg">RekanGuru</span>
                    <div className="w-8" />
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-5xl mx-auto pb-20">

                        {/* Rate Limit Error Banner */}
                        {showRateLimitError && (
                            <RateLimitBanner
                                onOpenSettings={() => setIsSettingsOpen(true)}
                                onRetry={generationProgress ? handleResumeGeneration : undefined}
                                errorMessage={rateLimitErrorMessage}
                            />
                        )}

                        {/* Generation Progress Panel - Show if there's pending work */}
                        {generationProgress && generationProgress.pendingTypes.length > 0 && !isProcessing && (
                            <GenerationProgressPanel
                                progress={generationProgress}
                                onResume={handleResumeGeneration}
                                onDownloadCompleted={handleDownloadCompleted}
                                onClear={clearProgress}
                                isResuming={isProcessing}
                                downloadMode={downloadMode}
                                onDownloadModeChange={setDownloadMode}
                            />
                        )}

                        {isProcessing && (
                            <div className="mb-8 p-6 bg-white rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-100/50 flex flex-col items-center gap-4">
                                <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
                                <div className="text-center">
                                    <p className="text-sm font-bold text-slate-800">{loadingStatus || 'Memproses...'}</p>
                                    <p className="text-xs text-slate-500 mt-1">Progress: {progress}% - Harap tunggu</p>
                                    {generationProgress && generationProgress.completedDocs.length > 0 && (
                                        <p className="text-xs text-green-600 mt-2">
                                            ✅ {generationProgress.completedDocs.length} dokumen sudah tersimpan otomatis
                                        </p>
                                    )}
                                </div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden max-w-md">
                                    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        )}

                        {currentView === 'form' ? (
                            activeCategory === AppCategory.Kuis ? (
                                <QuizGenerator onSubmit={handleQuizSubmit} isLoading={isProcessing} onOpenSettings={() => setIsSettingsOpen(true)} />
                            ) : (
                                <ModulGenerator category={activeCategory} onSubmit={handleAdminSubmit} isLoading={isProcessing} loadingStatus={loadingStatus} onOpenSettings={() => setIsSettingsOpen(true)} downloadMode={downloadMode} onDownloadModeChange={setDownloadMode} />
                            )
                        ) : (
                            activeDoc && (
                                <div className="space-y-4 animate-fade-in-up">
                                    <button onClick={() => setCurrentView('form')} className="group flex items-center gap-2 text-indigo-600 font-bold text-sm bg-white px-4 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all w-fit">
                                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Menu Utama
                                    </button>
                                    <ResultDisplay document={activeDoc} />
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;