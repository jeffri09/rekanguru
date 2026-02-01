import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Home, FileText, FolderOpen, Settings, Zap, ChevronLeft } from 'lucide-react';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import ResultsPage from './pages/ResultsPage';
import ModulGenerator from './components/ModulGenerator';
import ResultDisplay from './components/ResultDisplay';
import { AppCategory, GeneratedDocument, AdminRequest, AdminDocType } from './types';
import { convertMarkdownToHtml } from './utils/markdownToHtml';
import { generateDocument, TemplateData } from './templates/documentTemplates';

type PageType = 'home' | 'generator' | 'results' | 'settings' | 'document-view';

const App: React.FC = () => {
    // Initial loader removal
    useLayoutEffect(() => {
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    }, []);

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
    const [isProcessing, setIsProcessing] = useState(false);
    const [downloadMode, setDownloadMode] = useState<'combined' | 'separate'>('combined');

    // Persist documents
    useEffect(() => {
        try {
            localStorage.setItem('rekanGuruDocs', JSON.stringify(documents));
        } catch (e) {
            console.error("Failed to save:", e);
        }
    }, [documents]);

    // INSTANT Document generation using templates (NO AI)
    const handleAdminSubmit = (data: AdminRequest, selectedTypes: AdminDocType[]) => {
        setIsProcessing(true);

        const allContents: string[] = [];
        const totalDocs = selectedTypes.length;

        // Generate all documents instantly using templates
        for (let i = 0; i < selectedTypes.length; i++) {
            const docType = selectedTypes[i];

            const templateData: TemplateData = {
                identity: data.identity,
                fase: data.fase || '',
                mapel: data.mataPelajaran || '',
                elemen: data.elemen || '',
                topik: data.topik || '',
                waktu: data.alokasiWaktu || '2 JP',
                modelPembelajaran: data.modelPembelajaran || 'Problem Based Learning',
                sarana: data.saranaPrasarana || 'Buku, LCD, Laptop',
                jumlahSiswa: data.jumlahSiswa || '30',
                targetPeserta: data.targetPesertaDidik || 'Peserta didik reguler',
                profilPelajar: data.profilPelajar || ['Bernalar Kritis', 'Kreatif', 'Mandiri']
            };

            const content = generateDocument(docType, templateData);

            if (downloadMode === 'separate') {
                downloadSingleDocWord(docType, content);
            }

            if (totalDocs > 1) {
                allContents.push(`\n\n---\n\n# 📄 ${docType}\n\n${content}`);
            } else {
                allContents.push(content);
            }
        }

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
        setIsProcessing(false);
    };

    // Download single document as Word
    const downloadSingleDocWord = (docType: string, content: string) => {
        const htmlContent = convertMarkdownToHtml(content);
        const cssStyle = `
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; }
            h1 { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 12pt; }
            h2 { font-size: 14pt; font-weight: bold; margin-top: 12pt; }
            h3 { font-size: 12pt; font-weight: bold; }
            table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
            th, td { border: 1px solid #000; padding: 6pt 8pt; text-align: left; }
            th { background-color: #f0f0f0; font-weight: bold; }
            ul, ol { margin-left: 20pt; }
        `;
        const docHtml = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
            <head><meta charset='utf-8'><style>${cssStyle}</style></head>
            <body>${htmlContent}</body></html>
        `;
        const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${docType.replace(/\s+/g, '_')}_${Date.now()}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Download combined document as Word
    const handleDownloadDoc = () => {
        if (!activeDocument) return;
        const htmlContent = convertMarkdownToHtml(activeDocument.content);
        const cssStyle = `
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; }
            h1 { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 12pt; }
            h2 { font-size: 14pt; font-weight: bold; margin-top: 12pt; }
            h3 { font-size: 12pt; font-weight: bold; }
            table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
            th, td { border: 1px solid #000; padding: 6pt 8pt; text-align: left; }
            th { background-color: #f0f0f0; font-weight: bold; }
            ul, ol { margin-left: 20pt; }
        `;
        const docHtml = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
            <head><meta charset='utf-8'><style>${cssStyle}</style></head>
            <body>${htmlContent}</body></html>
        `;
        const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeDocument.title.replace(/\s+/g, '_')}_${Date.now()}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Delete single document
    const handleDeleteDoc = (docId: string) => {
        setDocuments(prev => prev.filter(d => d.id !== docId));
        if (activeDocument?.id === docId) {
            setActiveDocument(null);
            setCurrentPage('results');
        }
    };

    // Delete all documents
    const handleDeleteAllDocs = () => {
        if (window.confirm('Hapus semua dokumen yang tersimpan?')) {
            setDocuments([]);
            setActiveDocument(null);
            setCurrentPage('results');
        }
    };

    // View a document
    const handleViewDocument = (doc: GeneratedDocument) => {
        setActiveDocument(doc);
        setCurrentPage('document-view');
    };

    // Navigation items
    const navItems = [
        { id: 'home' as PageType, label: 'Beranda', icon: Home },
        { id: 'generator' as PageType, label: 'Mulai Buat', icon: Zap },
        { id: 'results' as PageType, label: 'Hasil', icon: FolderOpen },
        { id: 'settings' as PageType, label: 'Pengaturan', icon: Settings },
    ];

    // Render page content
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage onNavigate={setCurrentPage} />;
            case 'settings':
                return <SettingsPage />;
            case 'results':
                return (
                    <ResultsPage
                        documents={documents}
                        onViewDocument={handleViewDocument}
                        onDeleteDocument={handleDeleteDoc}
                        onDeleteAll={handleDeleteAllDocs}
                        onNavigate={setCurrentPage}
                    />
                );
            case 'generator':
                return (
                    <div className="max-w-5xl mx-auto">
                        <button
                            onClick={() => setCurrentPage('home')}
                            className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            ← Kembali ke Beranda
                        </button>

                        {isProcessing && (
                            <div className="mb-8 p-6 bg-white rounded-2xl border border-indigo-100 shadow-lg shadow-indigo-100/50 flex flex-col items-center gap-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-slate-800">Membuat dokumen...</p>
                                </div>
                            </div>
                        )}

                        <ModulGenerator
                            category={AppCategory.Administrasi}
                            onSubmit={handleAdminSubmit}
                            isLoading={isProcessing}
                            downloadMode={downloadMode}
                            onDownloadModeChange={setDownloadMode}
                        />
                    </div>
                );
            case 'document-view':
                return activeDocument ? (
                    <div className="max-w-5xl mx-auto">
                        <button
                            onClick={() => setCurrentPage('results')}
                            className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            ← Kembali ke Hasil
                        </button>
                        <ResultDisplay
                            result={activeDocument.content}
                            onDownload={handleDownloadDoc}
                            onClose={() => setCurrentPage('results')}
                            title={activeDocument.title}
                        />
                    </div>
                ) : null;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20">
            {/* Desktop Top Navigation */}
            <nav className="hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
                            R
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800">RekanGuru</h1>
                            <p className="text-[10px] text-slate-500">Asisten Kurikulum Merdeka</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${currentPage === item.id
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pb-24 md:pb-8 px-4 md:px-8 py-6 md:py-8">
                {renderPage()}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-lg z-50">
                <div className="flex justify-around items-center py-2 px-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${currentPage === item.id
                                ? 'text-indigo-600 bg-indigo-50'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default App;