import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Home, FileText, FolderOpen, Settings, Sparkles, Loader2, ChevronLeft } from 'lucide-react';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import ResultsPage from './pages/ResultsPage';
import ModulGenerator from './components/ModulGenerator';
import ResultDisplay from './components/ResultDisplay';
import RateLimitBanner from './components/RateLimitBanner';
import GenerationProgressPanel from './components/GenerationProgressPanel';
import { generateAdminDocs } from './services/geminiService';
import { AppCategory, GeneratedDocument, AdminRequest, AdminDocType, GenerationProgress } from './types';
import { convertMarkdownToHtml } from './utils/markdownToHtml';

const PROGRESS_STORAGE_KEY = 'rekanGuruProgress';

type PageType = 'home' | 'generator' | 'results' | 'settings' | 'document-view';

const App: React.FC = () => {
    // Initial loader removal
    useLayoutEffect(() => {
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.classList.add('hidden-loader');
            const timer = setTimeout(() => {
                if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
            }, 350);
            return () => clearTimeout(timer);
        }
    }, []);

    // State
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [documents, setDocuments] = useState<GeneratedDocument[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('rekanGuruDocs');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    });
    const [activeDocument, setActiveDocument] = useState<GeneratedDocument | null>(null);
    const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(() => {
        if (typeof window === 'undefined') return null;
        try {
            const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.pendingTypes && parsed.pendingTypes.length > 0) {
                    return parsed;
                }
            }
            return null;
        } catch (e) {
            return null;
        }
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadingStatus, setLoadingStatus] = useState('');
    const [showRateLimitError, setShowRateLimitError] = useState(false);
    const [rateLimitErrorMessage, setRateLimitErrorMessage] = useState('');
    const [downloadMode, setDownloadMode] = useState<'combined' | 'separate'>('combined');

    // Persist documents
    useEffect(() => {
        try {
            localStorage.setItem('rekanGuruDocs', JSON.stringify(documents));
        } catch (e) {
            console.error("Failed to save:", e);
        }
    }, [documents]);

    // Progress management
    const saveProgress = (progressData: GenerationProgress) => {
        try {
            localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
            setGenerationProgress(progressData);
        } catch (e) {
            console.error("Failed to save progress:", e);
        }
    };

    const clearProgress = () => {
        try {
            localStorage.removeItem(PROGRESS_STORAGE_KEY);
            setGenerationProgress(null);
            setShowRateLimitError(false);
        } catch (e) {
            console.error("Failed to clear progress:", e);
        }
    };

    // Document generation
    const handleAdminSubmit = async (data: AdminRequest, selectedTypes: AdminDocType[], existingProgress?: GenerationProgress) => {
        if (isProcessing) return;
        setIsProcessing(true);
        setProgress(5);
        setLoadingStatus('Mempersiapkan...');
        setShowRateLimitError(false);

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
            for (let i = 0; i < currentProgress.pendingTypes.length; i++) {
                const docType = currentProgress.pendingTypes[i];
                const completedCount = currentProgress.completedDocs.length;
                const overallIndex = completedCount + i;

                setLoadingStatus(`Membuat ${docType} (${overallIndex + 1}/${totalDocs})...`);
                const baseProgress = Math.round((overallIndex / totalDocs) * 100);
                const progressPerDoc = 100 / totalDocs;

                try {
                    const content = await generateAdminDocs(
                        { ...data, docType },
                        (p) => setProgress(Math.round(baseProgress + (p * progressPerDoc / 100)))
                    );

                    currentProgress.completedDocs.push({
                        docType,
                        content,
                        timestamp: Date.now()
                    });
                    currentProgress.pendingTypes = currentProgress.pendingTypes.filter(t => t !== docType);
                    saveProgress(currentProgress);

                    if (downloadMode === 'separate') {
                        downloadSingleDocWord(docType, content);
                    }

                    if (totalDocs > 1) {
                        allContents.push(`\n\n---\n\n# 📄 ${docType}\n\n${content}`);
                    } else {
                        allContents.push(content);
                    }
                } catch (docError: any) {
                    currentProgress.status = 'error';
                    currentProgress.lastError = docError.message || 'Gagal membuat dokumen';
                    currentProgress.pendingTypes = currentProgress.pendingTypes.filter(t => t !== docType);
                    currentProgress.pendingTypes.unshift(docType);
                    saveProgress(currentProgress);

                    const errorMsg = docError.message || '';
                    if (errorMsg.includes('429') || errorMsg.includes('Rate Limit') || errorMsg.includes('quota') || errorMsg.includes('Batas')) {
                        setShowRateLimitError(true);
                        setRateLimitErrorMessage(errorMsg);
                    }

                    setIsProcessing(false);
                    setProgress(0);
                    setLoadingStatus('');
                    return;
                }
            }

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
                metadata: { identity: data.identity, docType: selectedTypes[0], category: AppCategory.Administrasi },
                createdAt: Date.now()
            };

            setDocuments(prev => [newDoc, ...prev]);
            setActiveDocument(newDoc);
            setCurrentPage('document-view');
            currentProgress.status = 'completed';
            clearProgress();

        } catch (error: any) {
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

    const handleResumeGeneration = async () => {
        if (!generationProgress || generationProgress.pendingTypes.length === 0) return;
        setShowRateLimitError(false);
        await handleAdminSubmit(
            generationProgress.requestData,
            generationProgress.selectedTypes,
            generationProgress
        );
    };

    // Download helpers
    const downloadSingleDocWord = (docType: string, content: string) => {
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
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

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

            setTimeout(() => {
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, index ? index * 500 : 0);
        };

        if (downloadMode === 'separate') {
            generationProgress.completedDocs.forEach((doc, index) => {
                downloadSingleDoc(doc.docType, doc.content, index);
            });
        } else {
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

    // Navigation handlers
    const handleNavigate = (page: 'generator' | 'results' | 'settings') => {
        setCurrentPage(page);
    };

    const handleViewDocument = (doc: GeneratedDocument) => {
        setActiveDocument(doc);
        setCurrentPage('document-view');
    };

    const handleDeleteDocument = (id: string) => {
        setDocuments(prev => prev.filter(d => d.id !== id));
    };

    const handleDeleteAllDocuments = () => {
        setDocuments([]);
    };

    // Bottom navigation items
    const navItems = [
        { key: 'home', icon: Home, label: 'Beranda' },
        { key: 'generator', icon: FileText, label: 'Mulai Buat' },
        { key: 'results', icon: FolderOpen, label: 'Hasil' },
        { key: 'settings', icon: Settings, label: 'Pengaturan' }
    ];

    // Render current page
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage onNavigate={handleNavigate} />;

            case 'settings':
                return <SettingsPage onBack={() => setCurrentPage('home')} />;

            case 'results':
                return (
                    <ResultsPage
                        documents={documents}
                        onViewDocument={handleViewDocument}
                        onDeleteDocument={handleDeleteDocument}
                        onDeleteAll={handleDeleteAllDocuments}
                        onBack={() => setCurrentPage('home')}
                    />
                );

            case 'generator':
                return (
                    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8 px-4">
                        <div className="max-w-5xl mx-auto">
                            <button
                                onClick={() => setCurrentPage('home')}
                                className="text-indigo-600 font-medium hover:text-indigo-700 mb-6 flex items-center gap-2"
                            >
                                ← Kembali ke Beranda
                            </button>

                            {showRateLimitError && (
                                <RateLimitBanner
                                    onOpenSettings={() => setCurrentPage('settings')}
                                    onRetry={generationProgress ? handleResumeGeneration : undefined}
                                    errorMessage={rateLimitErrorMessage}
                                />
                            )}

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
                                        <p className="text-xs text-slate-500 mt-1">Progress: {progress}%</p>
                                        {generationProgress && generationProgress.completedDocs.length > 0 && (
                                            <p className="text-xs text-green-600 mt-2">
                                                ✅ {generationProgress.completedDocs.length} dokumen tersimpan
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden max-w-md">
                                        <div
                                            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <ModulGenerator
                                category={AppCategory.Administrasi}
                                onSubmit={handleAdminSubmit}
                                isLoading={isProcessing}
                                loadingStatus={loadingStatus}
                                onOpenSettings={() => setCurrentPage('settings')}
                                downloadMode={downloadMode}
                                onDownloadModeChange={setDownloadMode}
                            />
                        </div>
                    </div>
                );

            case 'document-view':
                return activeDocument ? (
                    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-8 px-4">
                        <div className="max-w-5xl mx-auto">
                            <button
                                onClick={() => setCurrentPage('results')}
                                className="group flex items-center gap-2 text-indigo-600 font-bold text-sm bg-white px-4 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all w-fit mb-6"
                            >
                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Kembali ke Hasil
                            </button>
                            <ResultDisplay document={activeDocument} />
                        </div>
                    </div>
                ) : null;

            default:
                return <HomePage onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen pb-20 md:pb-0">
            {/* Main Content */}
            {renderPage()}

            {/* Bottom Navigation - Mobile */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 md:hidden">
                <div className="flex justify-around items-center h-16">
                    {navItems.map(({ key, icon: Icon, label }) => (
                        <button
                            key={key}
                            onClick={() => setCurrentPage(key as PageType)}
                            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${currentPage === key || (currentPage === 'document-view' && key === 'results')
                                    ? 'text-indigo-600'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${currentPage === key ? 'stroke-2' : ''}`} />
                            <span className="text-xs mt-1 font-medium">{label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Top Navigation - Desktop */}
            <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-slate-200 z-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Sparkles className="text-indigo-600 w-6 h-6" />
                            <span className="font-bold text-xl text-slate-800">RekanGuru</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {navItems.map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setCurrentPage(key as PageType)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === key || (currentPage === 'document-view' && key === 'results')
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Desktop top padding */}
            <div className="hidden md:block h-16" />
        </div>
    );
};

export default App;