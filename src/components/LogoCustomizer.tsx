import React, { useState } from 'react';
import {
  Palette,
  Type as TypeIcon,
  Sparkles,
  RotateCcw,
  Check,
  Wand2,
  Loader2,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import { LogoConcept, LogoColors } from '../types/logo';

interface LogoCustomizerProps {
  logo: LogoConcept;
  onUpdateLogo: (updated: LogoConcept) => void;
}

export const LogoCustomizer: React.FC<LogoCustomizerProps> = ({ logo, onUpdateLogo }) => {
  const [brandName, setBrandName] = useState<string>(logo.brandName);
  const [tagline, setTagline] = useState<string>(logo.tagline || '');
  const [colors, setColors] = useState<LogoColors>(logo.colors);
  const [fontFamily, setFontFamily] = useState<string>(logo.fontFamily);
  const [refinePrompt, setRefinePrompt] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  const fontOptions = [
    { id: 'Space Grotesk', label: 'Space Grotesk (Tech & Futurista)' },
    { id: 'Outfit', label: 'Outfit (Moderno & Amigável)' },
    { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Corporativo Clean)' },
    { id: 'Montserrat', label: 'Montserrat (Geométrico & Sólido)' },
    { id: 'Cinzel', label: 'Cinzel (Luxo & Editorial)' },
  ];

  // Apply real-time client-side changes into the SVG markup
  const applyLiveEdits = (
    newBrandName: string,
    newTagline: string,
    newColors: LogoColors,
    newFont: string
  ) => {
    let markup = logo.svgMarkup;

    // Replace brand name text
    if (logo.brandName) {
      markup = markup.replace(
        new RegExp(`>${logo.brandName}<`, 'g'),
        `>${newBrandName}<`
      );
    }

    // Replace tagline text
    if (logo.tagline && newTagline) {
      markup = markup.replace(
        new RegExp(`>${logo.tagline}<`, 'g'),
        `>${newTagline}<`
      );
    }

    // Replace colors in svg
    markup = markup.replace(new RegExp(logo.colors.primary, 'gi'), newColors.primary);
    markup = markup.replace(new RegExp(logo.colors.secondary, 'gi'), newColors.secondary);
    markup = markup.replace(new RegExp(logo.colors.accent, 'gi'), newColors.accent);

    const updated: LogoConcept = {
      ...logo,
      brandName: newBrandName,
      tagline: newTagline,
      colors: newColors,
      fontFamily: newFont,
      svgMarkup: markup,
    };

    onUpdateLogo(updated);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBrandName(val);
    applyLiveEdits(val, tagline, colors, fontFamily);
  };

  const handleTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTagline(val);
    applyLiveEdits(brandName, val, colors, fontFamily);
  };

  const handleColorChange = (key: keyof LogoColors, hexVal: string) => {
    const newColors = { ...colors, [key]: hexVal };
    setColors(newColors);
    applyLiveEdits(brandName, tagline, newColors, fontFamily);
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFontFamily(val);
    applyLiveEdits(brandName, tagline, colors, val);
  };

  // AI Refinement handler
  const handleAiRefine = async () => {
    if (!refinePrompt.trim()) return;

    try {
      setIsRefining(true);
      setRefineError(null);

      const res = await fetch('/api/refine-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentLogo: logo,
          instruction: refinePrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Falha ao processar ajuste com IA.');
      }

      onUpdateLogo(data.logo);
      setBrandName(data.logo.brandName);
      setTagline(data.logo.tagline || '');
      setColors(data.logo.colors);
      setFontFamily(data.logo.fontFamily);
      setRefinePrompt('');
    } catch (err: any) {
      console.error(err);
      setRefineError(err.message || 'Erro ao refinar logotipo.');
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-semibold text-white">
            Personalizar &amp; Ajustar Logotipo
          </h3>
        </div>
        <span className="text-xs text-zinc-400">Edição em tempo real</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. TEXTS */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
            <TypeIcon className="w-4 h-4 text-indigo-400" /> Textos da Marca
          </label>

          <div>
            <label className="text-[11px] text-zinc-400 mb-1 block">Nome da Empresa:</label>
            <input
              type="text"
              value={brandName}
              onChange={handleNameChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 mb-1 block">Slogan / Tagline:</label>
            <input
              type="text"
              value={tagline}
              onChange={handleTaglineChange}
              placeholder="Ex: Inovação & Tecnologia"
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 mb-1 block">Fonte Tipográfica:</label>
            <div className="relative">
              <select
                value={fontFamily}
                onChange={handleFontChange}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 appearance-none pr-8 cursor-pointer"
              >
                {fontOptions.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 2. COLOR PALETTE */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Palette className="w-4 h-4 text-purple-400" /> Paleta de Cores
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Cor Primária:</label>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <input
                  type="color"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-zinc-300 uppercase">
                  {colors.primary}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Cor Secundária:</label>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <input
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-zinc-300 uppercase">
                  {colors.secondary}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Destaque (Accent):</label>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <input
                  type="color"
                  value={colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-zinc-300 uppercase">
                  {colors.accent}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 mb-1 block">Fundo Escuro:</label>
              <div className="flex items-center gap-2 p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <input
                  type="color"
                  value={colors.backgroundDark}
                  onChange={(e) => handleColorChange('backgroundDark', e.target.value)}
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-zinc-300 uppercase">
                  {colors.backgroundDark}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. AI REFINEMENT CHAT */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Wand2 className="w-4 h-4 text-emerald-400" /> Refinar com IA
          </label>
          <p className="text-[11px] text-zinc-400">
            Deseja mudar as formas ou estilo? Peça ao Gemini para ajustar o design.
          </p>

          <textarea
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            rows={3}
            placeholder="Ex: 'torne o símbolo mais minimalista e com linhas mais grossas', 'adicione tons dourados', 'deixe o visual mais geométrico'..."
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 resize-none"
          />

          {refineError && (
            <p className="text-[11px] text-rose-400">{refineError}</p>
          )}

          <button
            onClick={handleAiRefine}
            disabled={isRefining || !refinePrompt.trim()}
            className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isRefining ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isRefining ? 'Ajustando Design...' : 'Aplicar Ajuste com IA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
