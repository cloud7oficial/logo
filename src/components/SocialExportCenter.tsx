import React, { useState, useEffect } from 'react';
import {
  Download,
  PackageCheck,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle,
  FileCode,
  ShieldCheck,
  Loader2,
  FolderArchive,
} from 'lucide-react';
import { LogoConcept, SocialExportPreset, BackdropType } from '../types/logo';
import { SOCIAL_PRESETS } from '../data/socialPresets';
import {
  exportSocialPresetPng,
  downloadCompleteBrandKitZip,
  downloadBlob,
  renderSvgToCanvas,
} from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface SocialExportCenterProps {
  logo: LogoConcept;
}

export const SocialExportCenter: React.FC<SocialExportCenterProps> = ({ logo }) => {
  const [selectedBackdrop, setSelectedBackdrop] = useState<BackdropType>('dark');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<{ percent: number; label: string }>({
    percent: 0,
    label: '',
  });
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [previewThumbnails, setPreviewThumbnails] = useState<Record<string, string>>({});
  const [exportError, setExportError] = useState<string | null>(null);

  // Generate preview thumbnails for presets
  useEffect(() => {
    let isCancelled = false;

    async function generateThumbs() {
      const thumbs: Record<string, string> = {};
      for (const preset of SOCIAL_PRESETS) {
        if (isCancelled) break;
        try {
          const isIcon = preset.category === 'icon' || (preset.category === 'profile' && preset.width <= 512);
          // Scale down for fast preview
          const previewW = Math.min(preset.width, 320);
          const previewH = Math.round((preset.height / preset.width) * previewW);

          const canvas = await renderSvgToCanvas(
            logo.svgMarkup,
            previewW,
            previewH,
            selectedBackdrop,
            logo.colors,
            preset.category === 'banner' ? 0.14 : 0.2,
            isIcon,
            logo.symbolSvgOnly
          );
          thumbs[preset.id] = canvas.toDataURL('image/jpeg', 0.85);
        } catch (e) {
          // ignore
        }
      }
      if (!isCancelled) {
        setPreviewThumbnails(thumbs);
      }
    }

    generateThumbs();
    return () => {
      isCancelled = true;
    };
  }, [logo.id, selectedBackdrop]);

  const handleDownloadSingle = async (preset: SocialExportPreset) => {
    try {
      setDownloadingId(preset.id);
      await exportSocialPresetPng(logo, preset, selectedBackdrop);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (err: any) {
      console.error('Erro ao baixar preset:', err);
      setExportError('Falha ao exportar a imagem. Tente novamente.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadZipKit = async () => {
    try {
      setIsZipping(true);
      setExportError(null);
      setZipProgress({ percent: 5, label: 'Iniciando compilação do Brand Kit...' });

      await downloadCompleteBrandKitZip(logo, SOCIAL_PRESETS, (percent, label) => {
        setZipProgress({ percent, label });
      });

      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('Erro ao gerar kit ZIP:', err);
      setExportError('Falha ao compilar arquivo ZIP. Tente baixar os arquivos individualmente.');
    } finally {
      setIsZipping(false);
      setZipProgress({ percent: 0, label: '' });
    }
  };

  const handleDownloadSvgMaster = () => {
    const blob = new Blob([logo.svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const safeBrand = logo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadBlob(blob, `${safeBrand}-vetor-original-master.svg`);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
  };

  const filteredPresets =
    filterPlatform === 'all'
      ? SOCIAL_PRESETS
      : SOCIAL_PRESETS.filter((p) => p.platform.toLowerCase().includes(filterPlatform.toLowerCase()));

  const platformsList = [
    { id: 'all', label: 'Todas as Redes' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'twitter', label: 'Twitter / X' },
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'favicon', label: 'Favicon & Apps' },
    { id: 'master', label: 'Master 4K' },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner / Callout for 1-Click Complete Kit */}
      <div className="relative rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/80 via-zinc-950 to-purple-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Pronto para Uso Imediato em Todas as Redes
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Kit Completo de Identidade Visual em Alta Resolução
          </h2>
          <p className="text-xs md:text-sm text-zinc-300">
            Exportação calibrada com os tamanhos exatos exigidos pelo Instagram, LinkedIn, YouTube, X, WhatsApp e Favicons. Inclui arquivo vetorial SVG (resolução infinita) e PNGs em 4K.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-2 w-full md:w-auto">
          <button
            onClick={handleDownloadZipKit}
            disabled={isZipping}
            className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-95 disabled:opacity-60"
          >
            {isZipping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FolderArchive className="w-5 h-5 text-indigo-200" />
            )}
            <span>
              {isZipping ? 'Gerando Pacote ZIP...' : 'Baixar Kit Completo em ZIP'}
            </span>
          </button>

          <button
            onClick={handleDownloadSvgMaster}
            className="w-full md:w-auto px-4 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 border border-zinc-700 transition-all"
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Baixar Vetor Master (.SVG Puro)</span>
          </button>
        </div>

        {/* Loading Progress bar inside banner */}
        {isZipping && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${zipProgress.percent}%` }}
            />
          </div>
        )}
      </div>

      {/* Progress Toast notification */}
      {isZipping && (
        <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs text-indigo-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>{zipProgress.label}</span>
          </div>
          <span className="font-mono font-bold text-white">{zipProgress.percent}%</span>
        </div>
      )}

      {exportError && (
        <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
          <span>{exportError}</span>
          <button
            onClick={() => setExportError(null)}
            className="text-white hover:text-amber-100 font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters and Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
        {/* Platform category filter */}
        <div className="flex flex-wrap gap-1">
          {platformsList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterPlatform(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium ${
                filterPlatform === cat.id
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Global Backdrop for exports */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span>Cor de Fundo:</span>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setSelectedBackdrop('dark')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                selectedBackdrop === 'dark'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Escuro da Marca
            </button>
            <button
              onClick={() => setSelectedBackdrop('light')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                selectedBackdrop === 'light'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Branco Puro
            </button>
            <button
              onClick={() => setSelectedBackdrop('transparent')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                selectedBackdrop === 'transparent'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Transparente (PNG)
            </button>
          </div>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPresets.map((preset) => {
          const isDownloading = downloadingId === preset.id;
          const thumbUrl = previewThumbnails[preset.id];

          return (
            <div
              key={preset.id}
              className="rounded-xl border border-zinc-800/90 bg-zinc-950/70 backdrop-blur-md overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all group"
            >
              {/* Card Header */}
              <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase font-mono">
                    {preset.platform}
                  </span>
                  <h4 className="text-xs font-semibold text-white tracking-wide truncate max-w-[180px]">
                    {preset.name}
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {preset.width}x{preset.height}
                </span>
              </div>

              {/* Thumbnail Preview Stage */}
              <div
                className="w-full aspect-[16/10] bg-zinc-900/60 relative flex items-center justify-center p-3 overflow-hidden border-b border-zinc-800/50"
              >
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={preset.name}
                    className="max-w-full max-h-full object-contain rounded shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gerando...</span>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-zinc-400 backdrop-blur-sm">
                  {preset.aspectRatio}
                </div>
              </div>

              {/* Card Footer with Download Button */}
              <div className="p-3 flex items-center justify-between gap-2 bg-zinc-950">
                <p className="text-[10px] text-zinc-400 line-clamp-1 flex-1">
                  {preset.description}
                </p>

                <button
                  onClick={() => handleDownloadSingle(preset)}
                  disabled={isDownloading}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-indigo-600 text-zinc-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all border border-zinc-800 hover:border-indigo-500 active:scale-95 disabled:opacity-50 shrink-0"
                >
                  {isDownloading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Baixar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
