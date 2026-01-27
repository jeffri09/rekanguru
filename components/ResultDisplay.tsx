import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Copy, Check, FileText, Edit3, Eye, Download, ArrowLeft } from 'lucide-react';
import { GeneratedDocument } from '../types';

interface ResultDisplayProps {
  document: GeneratedDocument;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ document }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(document.content);

  // Sync content if document changes
  useEffect(() => {
    setEditableContent(document.content);
    setIsEditing(false);
  }, [document.id, document.content]);

  const identity = document.metadata?.identity;
  const docType = document.metadata?.docType || 'DOKUMEN';

  const handleCopy = () => {
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadWord = () => {
    // 1. Get Content HTML from the hidden rendered div
    let contentHtml = '';
    const hiddenRenderDiv = window.document.getElementById('hidden-markdown-render');

    if (hiddenRenderDiv) {
      contentHtml = hiddenRenderDiv.innerHTML;
    } else {
      contentHtml = editableContent
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `<p>${line}</p>`)
        .join('');
    }

    // 2. Build Formal Header (Kop Surat Style)
    const headerHtml = identity ? `
      <div class="header">
        <p style="text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 0;">${docType.toUpperCase()}</p>
        ${identity.sekolah ? `<p style="text-align: center; font-size: 12pt; font-weight: bold; margin: 0;">${identity.sekolah.toUpperCase()}</p>` : ''}
        ${identity.tahunAjaran ? `<p style="text-align: center; font-size: 11pt; margin: 0;">TAHUN AJARAN ${identity.tahunAjaran}</p>` : ''}
        <div style="border-bottom: 3px double #000; margin-top: 10px; margin-bottom: 20px;"></div>

        <table style="width: 100%; border: none; margin-bottom: 20px; font-size: 11pt;">
          <tr style="border: none;">
            <td style="width: 180px; border: none; padding: 2px; font-weight: bold;">Mata Pelajaran</td>
            <td style="width: 10px; border: none; padding: 2px;">:</td>
            <td style="border: none; padding: 2px;">${document.title.split('-')[1]?.trim() || '-'}</td>
          </tr>
           <tr style="border: none;">
            <td style="border: none; padding: 2px; font-weight: bold;">Fase / Kelas / Semester</td>
            <td style="border: none; padding: 2px;">:</td>
            <td style="border: none; padding: 2px;">${identity.semester}</td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; padding: 2px; font-weight: bold;">Penyusun</td>
            <td style="border: none; padding: 2px;">:</td>
            <td style="border: none; padding: 2px;">${identity.nama}</td>
          </tr>
        </table>
      </div>
    ` : `
      <div style="text-align: center; margin-bottom: 20px;">
         <h3 style="text-transform: uppercase; font-weight: bold;">${document.title}</h3>
      </div>
    `;

    // 3. Build Footer (Signature Block) - Automatic Check
    // Gunakan tabel untuk layout tanda tangan agar rapi di Word dan page-break-avoid
    // Generate current date in Indonesian format
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const now = new Date();
    const tanggal = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const kotaTanggal = identity?.kota ? `${identity.kota}, ${tanggal}` : tanggal;

    const footerHtml = identity ? `
      <br class="page-break" />
      <div class="footer" style="margin-top: 40px; page-break-inside: avoid;">
        <table style="width: 100%; border: none;">
          <tr style="border: none;">
            <td style="width: 50%; border: none; text-align: center; vertical-align: top;">
              Mengetahui,<br>
              Kepala Sekolah
              <br><br><br><br><br>
              <strong><u>${identity.kepalaSekolah || '.........................'}</u></strong><br>
              ${identity.nipKepala ? `NIP. ${identity.nipKepala}` : ''}
            </td>
            <td style="width: 50%; border: none; text-align: center; vertical-align: top;">
              ${kotaTanggal}<br>
              Guru Mata Pelajaran
              <br><br><br><br><br>
              <strong><u>${identity.nama || '.........................'}</u></strong><br>
              ${identity.nip ? `NIP. ${identity.nip}` : ''}
            </td>
          </tr>
        </table>
      </div>
    ` : '';

    // 4. Enhanced Styles for Word
    const cssStyle = `
      <style>
        @page {
          size: A4;
          margin: 2.54cm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #000;
          background: #fff;
        }
        h1, h2, h3, h4, h5, h6 { color: #000; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: bold; }
        h1 { font-size: 14pt; text-align: center; text-transform: uppercase; }
        h2 { font-size: 13pt; border-bottom: 1px solid #000; padding-bottom: 5px; margin-top: 1.5em; }
        h3 { font-size: 12pt; }
        table { width: 100%; border-collapse: collapse; margin: 1.5em 0; border: 1px solid #000; }
        th, td { border: 1px solid #000; padding: 6px; vertical-align: top; text-align: left; }
        th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
        .header table, .footer table, .header td, .footer td { border: none !important; }
        .footer { page-break-inside: avoid; margin-top: 50px; }
      </style>
    `;

    // 5. Assemble Full HTML
    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${document.title}</title>
        ${cssStyle}
      </head>
      <body>
        ${headerHtml}
        <div class="content">
          ${contentHtml}
        </div>
        ${footerHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    const safeTitle = document.title.replace(/[^a-zA-Z0-9\s-]/g, '').trim().replace(/\s+/g, '_');
    const filename = `${safeTitle || 'dokumen'}.doc`;
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = filename;
    window.document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in-up">
      <div id="hidden-markdown-render" className="hidden">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>{editableContent}</ReactMarkdown>
      </div>

      {/* Modern Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-6 py-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{document.title}</h3>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">{docType}</span>
            <span>•</span>
            <span>Siap dicetak atau diedit</span>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setIsEditing(false)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${!isEditing ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Eye className="w-4 h-4" /> Pratinjau
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${isEditing ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Edit3 className="w-4 h-4" /> Edit Teks
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Salin Teks"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={handleDownloadWord}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-200 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Word
          </button>
        </div>
      </div>

      {/* Paper Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        <div className="max-w-[210mm] mx-auto bg-white shadow-2xl shadow-slate-200 min-h-[297mm] p-[2.5cm] relative">
          {/* Texture/Pattern for Paper (Subtle) */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')]"></div>

          {/* Header Rendering (Preview Only) */}
          {!isEditing && identity && (
            <div className="mb-8 pb-6 border-b-2 border-black/80 select-none font-serif text-black relative z-10">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold uppercase tracking-wide">{docType}</h2>
                {identity.sekolah && <h3 className="text-lg font-bold uppercase mt-1">{identity.sekolah}</h3>}
                {identity.tahunAjaran && <p className="text-sm mt-1">TAHUN AJARAN {identity.tahunAjaran}</p>}
                <div className="border-b-[3px] border-double border-black mt-4 w-full"></div>
              </div>

              <div className="text-sm leading-relaxed">
                <div className="grid grid-cols-[160px_10px_1fr] gap-y-1">
                  <div className="font-bold">Mata Pelajaran</div><div>:</div><div>{document.title.split('-')[1]?.trim() || '-'}</div>
                  <div className="font-bold">Fase / Kelas</div><div>:</div><div>{identity.semester}</div>
                  <div className="font-bold">Penyusun</div><div>:</div><div>{identity.nama}</div>
                </div>
              </div>
            </div>
          )}

          {/* Content Body */}
          {isEditing ? (
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              className="w-full h-full min-h-[600px] p-4 font-mono text-sm border-2 border-dashed border-slate-200 rounded-lg focus:ring-0 focus:border-indigo-400 outline-none resize-none bg-slate-50/50 text-slate-800 leading-relaxed"
              placeholder="Mulai ketik atau edit konten markdown di sini..."
            />
          ) : (
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-justify prose-p:leading-relaxed prose-table:border prose-table:w-full prose-td:border prose-th:border prose-td:p-2 prose-th:p-2 prose-th:bg-slate-100 font-serif text-black relative z-10">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {editableContent}
              </ReactMarkdown>

              {/* Footer Signatures - Auto Generated by App to prevent AI Redundancy */}
              {identity && (
                <div className="mt-16 pt-8 break-inside-avoid font-serif text-sm page-break-avoid">
                  {/* Generate current date in Indonesian format */}
                  {(() => {
                    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                    const now = new Date();
                    const tanggal = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
                    const kotaTanggal = identity.kota ? `${identity.kota}, ${tanggal}` : tanggal;
                    return (
                      <div className="grid grid-cols-2 gap-12 text-center">
                        <div>
                          <p className="mb-20">Mengetahui,<br />Kepala Sekolah</p>
                          <p className="font-bold underline">{identity.kepalaSekolah || '.........................'}</p>
                          {identity.nipKepala && <p className="mt-1">NIP. {identity.nipKepala}</p>}
                        </div>
                        <div>
                          <p className="mb-20">{kotaTanggal}<br />Guru Mata Pelajaran</p>
                          <p className="font-bold underline">{identity.nama || '.........................'}</p>
                          {identity.nip && <p className="mt-1">NIP. {identity.nip}</p>}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;