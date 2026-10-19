import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Download,
  Play,
  Pause,
  RotateCcw,
  Check,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Video,
  FileImage,
  FolderArchive,
  Eye,
  Layers,
  Palette,
  Loader2,
  Instagram,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { LogoConcept, AnimationType, BackdropType } from './types/logo';
import { SAMPLE_LOGOS, INSPIRATION_PROMPTS } from './data/sampleLogos';
import { SOCIAL_PRESETS } from './data/socialPresets';
import {
  generateAnimatedSvg,
  renderSvgToCanvas,
  canvasToPngBlob,
  downloadBlob,
  downloadCompleteBrandKitZip,
  recordAnimatedWebm,
} from './utils/exportUtils';
import confetti from 'canvas-confetti';

export default function App() {
  // Step 1: Informações, Step 2: Escolher & Animar, Step 3: Baixar
  const [currentStep, setCurrentStep] = useState<number>(2); // Default to Step 2 so user immediately sees an animated logo!
  const [concepts, setConcepts] = useState<LogoConcept[]>(SAMPLE_LOGOS);
  const [selectedLogo, setSelectedLogo] = useState<LogoConcept>(SAMPLE_LOGOS[0]);

  // Form State (Simple & Non-technical)
  const [companyName, setCompanyName] = useState<string>('Grão & Alma');
  const [description, setDescription] = useState<string>('Cafeteria artesanal e torrefação de cafés especiais com ambiente acolhedor');
  const [styleChoice, setStyleChoice] = useState<string>('Moderna & Tecnológica');

  // Animation State
  const [activeAnimation, setActiveAnimation] = useState<AnimationType>('pulse');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [replayKey, setReplayKey] = useState<number>(0);

  // Loading & Feedback States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<string>('');
  const [isRecordingVideo, setIsRecordingVideo] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Quick Colors Switcher (friendly color circles)
  const quickColors = [
    { label: 'Azul Confiança', primary: '#2563EB', secondary: '#38BDF8', bgDark: '#0B132B' },
    { label: 'Verde Natureza', primary: '#10B981', secondary: '#059669', bgDark: '#062016' },
    { label: 'Dourado Café', primary: '#D97706', secondary: '#92400E', bgDark: '#1C1510' },
    { label: 'Roxo Inovação', primary: '#8B5CF6', secondary: '#EC4899', bgDark: '#130924' },
    { label: 'Laranja Criativo', primary: '#F97316', secondary: '#EF4444', bgDark: '#1A0C06' },
    { label: 'Preto Elegante', primary: '#F3F4F6', secondary: '#9CA3AF', bgDark: '#0A0A0C' },
  ];

  // Simple animations list
  const friendlyAnimations: { id: AnimationType; label: string; desc: string; icon: string }[] = [
    { id: 'construct', label: 'Desenho dos Traços', desc: 'Parece desenhado à mão na hora', icon: '✏️' },
    { id: 'pulse', label: 'Pulso & Respiração', desc: 'Flutua com brilho suave', icon: '💨' },
    { id: 'neon', label: 'Brilho Neon', desc: 'Luz brilhante e moderna', icon: '⚡' },
    { id: 'spin', label: 'Giro Dinâmico', desc: 'Gira com elegância 3D', icon: '🌀' },
    { id: 'bounce', label: 'Entrada Animada', desc: 'Movimento alegre e marcante', icon: '💥' },
    { id: 'cinematic', label: 'Cinematográfico', desc: 'Efeito de cinema luxuoso', icon: '🎬' },
  ];

  // Handle generation from Gemini API
  const handleGenerateLogos = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!companyName.trim()) {
      setStatusMessage('Por favor, digite o nome da sua empresa.');
      return;
    }
    if (!description.trim()) {
      setStatusMessage('Por favor, conte em poucas palavras o que sua empresa faz.');
      return;
    }

    try {
      setIsGenerating(true);
      setStatusMessage(null);

      const res = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          description,
          style: styleChoice,
          count: 3,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Não foi possível criar o logo. Tente novamente.');
      }

      if (data.logos && data.logos.length > 0) {
        setConcepts(data.logos);
        setSelectedLogo(data.logos[0]);
        setActiveAnimation(data.logos[0].recommendedAnimation || 'pulse');
        setCurrentStep(2); // Advance directly to Step 2 to see the animated logo!
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage(err.message || 'Houve um erro temporário ao criar seu logotipo. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Change palette with 1 click
  const handleApplyQuickColor = (color: (typeof quickColors)[0]) => {
    let markup = selectedLogo.svgMarkup;
    markup = markup.replace(new RegExp(selectedLogo.colors.primary, 'gi'), color.primary);
    markup = markup.replace(new RegExp(selectedLogo.colors.secondary, 'gi'), color.secondary);

    const updated: LogoConcept = {
      ...selectedLogo,
      colors: {
        ...selectedLogo.colors,
        primary: color.primary,
        secondary: color.secondary,
        backgroundDark: color.bgDark,
      },
      svgMarkup: markup,
    };

    setSelectedLogo(updated);
    setConcepts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setReplayKey((k) => k + 1);
  };

  // Download complete package (.ZIP)
  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      setZipProgress('Preparando imagens em alta resolução...');

      await downloadCompleteBrandKitZip(selectedLogo, SOCIAL_PRESETS, (percent, label) => {
        setZipProgress(`${label} (${percent}%)`);
      });

      confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
      setStatusMessage('Download do pacote concluído com sucesso!');
    } catch (e) {
      console.error(e);
      setStatusMessage('Não foi possível gerar o arquivo ZIP completo. Tente baixar as imagens pelos botões individuais.');
    } finally {
      setIsZipping(false);
      setZipProgress('');
    }
  };

  // Download single social preset
  const handleDownloadSinglePreset = async (presetId: string, filenameSuffix: string) => {
    try {
      setStatusMessage('Gerando imagem...');
      const preset = SOCIAL_PRESETS.find((p) => p.id === presetId) || SOCIAL_PRESETS[0];
      const isIcon = preset.category === 'icon' || (preset.category === 'profile' && preset.width <= 512);

      const canvas = await renderSvgToCanvas(
        selectedLogo.svgMarkup,
        preset.width,
        preset.height,
        'dark',
        selectedLogo.colors,
        preset.category === 'banner' ? 0.14 : 0.22,
        isIcon,
        selectedLogo.symbolSvgOnly
      );

      const blob = await canvasToPngBlob(canvas);
      const safeName = selectedLogo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      downloadBlob(blob, `${safeName}-${filenameSuffix}.png`);
      setStatusMessage('Imagem baixada com sucesso!');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } catch (e) {
      console.error(e);
      setStatusMessage('Erro ao baixar imagem. Tente novamente.');
    }
  };

  // Record short video for stories / reels
  const handleDownloadVideo = async () => {
    try {
      setIsRecordingVideo(true);
      setStatusMessage('Gravando vídeo animado para Stories e Reels...');

      const videoBlob = await recordAnimatedWebm(
        selectedLogo.svgMarkup,
        activeAnimation,
        4000,
        1080,
        1080,
        selectedLogo.colors
      );

      const safeName = selectedLogo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      downloadBlob(videoBlob, `${safeName}-video-animado.webm`);
      setStatusMessage('Vídeo animado baixado com sucesso!');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch (e) {
      console.error(e);
      setStatusMessage('Não foi possível gerar o vídeo animado neste navegador. Você pode baixar o arquivo vetorial ou imagem.');
    } finally {
      setIsRecordingVideo(false);
    }
  };

  // SVG rendered for active animation
  const activeSvgMarkup = generateAnimatedSvg(
    selectedLogo,
    isPlaying ? activeAnimation : ('none' as any)
  );

  return (
    <div className="min-h-screen bg-[#090C15] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Glow background */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-25 blur-[120px] transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${selectedLogo.colors.primary} 0%, ${selectedLogo.colors.secondary} 50%, transparent 80%)`,
        }}
      />

      {/* SIMPLE HEADER */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md px-4 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">
                Criador de Logo Fácil
              </h1>
              <p className="text-[11px] text-zinc-400">
                Para redes sociais, WhatsApp e impressão
              </p>
            </div>
          </div>

          {/* Step Progress Pills */}
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl">
            {[
              { num: 1, label: '1. Descrever' },
              { num: 2, label: '2. Ver Animado' },
              { num: 3, label: '3. Baixar' },
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : isPast
                      ? 'text-indigo-300 hover:text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {isPast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* FEEDBACK STATUS BANNER */}
      {statusMessage && (
        <div className="max-w-5xl mx-auto w-full px-4 pt-4">
          <div className="p-3 rounded-xl bg-indigo-950/90 border border-indigo-500/40 text-indigo-200 text-xs flex items-center justify-between shadow-lg">
            <span>{statusMessage}</span>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-white hover:text-indigo-300 font-bold ml-3 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col gap-6 relative z-10">
        {/* ========================================================= */}
        {/* PASSO 1: DESCREVER SUA EMPRESA */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="w-full max-w-2xl mx-auto rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
            <div className="text-center">
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Passo 1 de 3
              </span>
              <h2 className="text-2xl font-bold text-white mt-2">
                Conte-nos sobre o seu negócio
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                Basta informar o nome da sua empresa e o que ela faz. Nossa inteligência artificial cria os designs ideais para você.
              </p>
            </div>

            <form onSubmit={handleGenerateLogos} className="flex flex-col gap-5">
              {/* Field 1: Name */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  1. Qual é o nome da sua empresa? *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex: Doce Sabor, Silva Advocacia, Nexus Tecnologia..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Field 2: Description */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                  2. O que sua empresa faz ou vende? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Fazemos bolos caseiros e doces para festas, com entrega rápida e atendimento carinhoso..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Field 3: Style (Friendly options with emojis) */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-2">
                  3. Qual estilo você mais gosta?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Moderna & Tech', icon: '🚀' },
                    { label: 'Elegante & Luxo', icon: '💎' },
                    { label: 'Natural & Orgânica', icon: '🌿' },
                    { label: 'Clean & Simples', icon: '✨' },
                  ].map((st) => (
                    <button
                      type="button"
                      key={st.label}
                      onClick={() => setStyleChoice(st.label)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        styleChoice === st.label
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold shadow-md'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="text-xl mb-1">{st.icon}</div>
                      <div className="text-xs">{st.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isGenerating || !companyName.trim() || !description.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50 mt-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Criando seus logotipos profissionais...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Criar Meu Logotipo com IA</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Inspiration Pills */}
            <div className="border-t border-zinc-800/80 pt-4 mt-2">
              <span className="text-[11px] text-zinc-400 block mb-2 font-medium">
                Ou clique em um exemplo pronto para testar:
              </span>
              <div className="flex flex-wrap gap-2">
                {INSPIRATION_PROMPTS.slice(0, 4).map((item) => (
                  <button
                    key={item.company}
                    type="button"
                    onClick={() => {
                      setCompanyName(item.company);
                      setDescription(item.description);
                      setStyleChoice(item.style);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PASSO 2: ESCOLHER SEU LOGO E VER ANIMADO */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="w-full flex flex-col gap-6 animate-fadeIn">
            {/* Step navigation & encouragement */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  Passo 2 de 3
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white mt-1.5">
                  Veja a versão animada do seu logotipo
                </h2>
                <p className="text-xs text-zinc-400">
                  Escolha um dos 3 modelos abaixo e teste os efeitos de movimento para chamar atenção nas redes sociais.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Mudar Nome / Dados</span>
                </button>

                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all transform active:scale-95"
                >
                  <span>Avançar para Baixar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3 Logo Choices Grid (clean and visual) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {concepts.map((concept, idx) => {
                const isSelected = concept.id === selectedLogo.id;
                return (
                  <button
                    key={concept.id}
                    onClick={() => {
                      setSelectedLogo(concept);
                      setActiveAnimation(concept.recommendedAnimation || 'pulse');
                      setReplayKey((k) => k + 1);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-zinc-900 border-indigo-500 shadow-xl shadow-indigo-500/15 ring-2 ring-indigo-500/60'
                        : 'bg-zinc-950/70 border-zinc-800 hover:bg-zinc-900/60 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-indigo-400">
                        Opção {idx + 1}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Escolhido
                        </span>
                      )}
                    </div>

                    <div
                      className="w-full aspect-[16/10] rounded-xl flex items-center justify-center p-3 border border-zinc-800/80"
                      style={{ backgroundColor: concept.colors.backgroundDark }}
                    >
                      <div
                        className="w-full h-full max-w-[130px] flex items-center justify-center pointer-events-none"
                        dangerouslySetInnerHTML={{ __html: concept.svgMarkup }}
                      />
                    </div>

                    <div className="text-xs font-bold text-white truncate">
                      {concept.conceptName}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* MAIN ANIMATED LOGO STAGE */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center">
              {/* Playback status */}
              <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-white">
                    {selectedLogo.brandName} • Animação Ao Vivo
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-800 flex items-center gap-1.5"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pausar' : 'Reproduzir'}</span>
                  </button>

                  <button
                    onClick={() => setReplayKey((k) => k + 1)}
                    title="Reiniciar animação"
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* The Visual Stage */}
              <div
                className="w-full max-w-[420px] aspect-square rounded-2xl flex items-center justify-center p-6 border border-zinc-800/90 shadow-2xl relative overflow-hidden transition-all duration-500"
                style={{ backgroundColor: selectedLogo.colors.backgroundDark }}
              >
                {/* Subtle radial glow behind */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-35 blur-2xl"
                  style={{
                    background: `radial-gradient(circle at center, ${selectedLogo.colors.primary} 0%, transparent 70%)`,
                  }}
                />

                <div
                  key={replayKey}
                  className="w-full h-full flex items-center justify-center relative z-10"
                  dangerouslySetInnerHTML={{ __html: activeSvgMarkup }}
                />
              </div>

              {/* ANIMATION EFFECT SELECTOR (Friendly buttons) */}
              <div className="w-full mt-6">
                <label className="text-xs font-semibold text-zinc-300 block mb-2.5 text-center sm:text-left">
                  Escolha como você quer que o logo se mova:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {friendlyAnimations.map((anim) => {
                    const isSelected = activeAnimation === anim.id;
                    return (
                      <button
                        key={anim.id}
                        onClick={() => {
                          setActiveAnimation(anim.id);
                          setIsPlaying(true);
                          setReplayKey((k) => k + 1);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-md'
                            : 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="text-lg mb-0.5">{anim.icon}</div>
                        <div className="text-xs font-semibold">{anim.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QUICK COLOR SELECTOR (1-Click circles) */}
              <div className="w-full mt-6 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                  <Palette className="w-4 h-4 text-indigo-400" />
                  <span>Trocar paleta de cores:</span>
                </div>

                <div className="flex items-center gap-2">
                  {quickColors.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => handleApplyQuickColor(c)}
                      title={c.label}
                      className="w-7 h-7 rounded-full border-2 border-zinc-700 hover:scale-115 transition-transform flex items-center justify-center shadow-md relative"
                      style={{ backgroundColor: c.primary }}
                    >
                      {selectedLogo.colors.primary.toUpperCase() === c.primary.toUpperCase() && (
                        <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Next Step Bar */}
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-xl shadow-emerald-600/30 flex items-center gap-2.5 transition-all transform active:scale-95"
              >
                <span>Gostei deste logo! Avançar para Baixar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PASSO 3: BAIXAR PARA REDES SOCIAIS & IMPRESSÃO */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <div className="w-full flex flex-col gap-6 animate-fadeIn">
            {/* Step navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Passo 3 de 3 • Conclusão
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white mt-1.5">
                  Tudo pronto para você usar no seu negócio!
                </h2>
                <p className="text-xs text-zinc-400">
                  As imagens já estão cortadas nos tamanhos exatos recomendados para não cortar seu nome nem distorcer.
                </p>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar e Mudar Animação</span>
              </button>
            </div>

            {/* BIG 1-CLICK ZIP DOWNLOAD CARD */}
            <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/80 via-zinc-950 to-teal-950/80 p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-2 max-w-lg">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Recomendado para donos de empresas</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Baixar Todas as Imagens Prontas em 1 Arquivo (.ZIP)
                </h3>
                <p className="text-xs text-zinc-300">
                  Inclui tudo o que você precisa: foto de perfil para WhatsApp e Instagram, capas para LinkedIn e Facebook, stories em alta resolução, arquivo de vídeo animado e o vetor original em alta definição para gráficas.
                </p>
              </div>

              <button
                onClick={handleDownloadAllZip}
                disabled={isZipping}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition-all transform active:scale-95 disabled:opacity-60 shrink-0"
              >
                {isZipping ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Compactando ({zipProgress})...</span>
                  </>
                ) : (
                  <>
                    <FolderArchive className="w-5 h-5" />
                    <span>Baixar Pacote Completo (.ZIP)</span>
                  </>
                )}
              </button>
            </div>

            {/* INDIVIDUAL EASY DOWNLOAD CARDS */}
            <div className="flex items-center justify-between mt-2">
              <h3 className="text-sm font-bold text-white">
                Ou baixe apenas a rede social que você precisa agora:
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. WhatsApp & Instagram Profile */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 flex flex-col justify-between gap-4 hover:border-zinc-700 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xl">📸</span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      Foto de Perfil (WhatsApp &amp; Instagram)
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      1080 x 1080 px • Corte circular perfeito, não corta o símbolo.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadSinglePreset('instagram-profile', 'perfil-whatsapp-instagram')}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Baixar Foto de Perfil (PNG)</span>
                </button>
              </div>

              {/* 2. Instagram & TikTok Stories */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 flex flex-col justify-between gap-4 hover:border-zinc-700 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xl">📲</span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      Stories &amp; Reels (Vertical)
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      1080 x 1920 px • Ocupa a tela cheia do celular perfeitamente.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadSinglePreset('instagram-story', 'stories-reels-vertical')}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-pink-400" />
                  <span>Baixar Imagem Stories (PNG)</span>
                </button>
              </div>

              {/* 3. Short Animated Video */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 flex flex-col justify-between gap-4 hover:border-zinc-700 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xl">🎬</span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      Vídeo Curto Animado
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Vídeo de 4 segundos com a animação para postar nos Reels ou Stories.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadVideo}
                  disabled={isRecordingVideo}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isRecordingVideo ? (
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  ) : (
                    <Video className="w-4 h-4 text-indigo-400" />
                  )}
                  <span>{isRecordingVideo ? 'Gerando Vídeo...' : 'Baixar Vídeo Animado (.webm)'}</span>
                </button>
              </div>

              {/* 4. LinkedIn & Facebook Banner */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 flex flex-col justify-between gap-4 hover:border-zinc-700 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xl">💼</span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      Capa de Página (LinkedIn &amp; Facebook)
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      1584 x 396 px • Banner horizontal para o topo da página da sua empresa.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadSinglePreset('linkedin-banner', 'capa-banner-linkedin')}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Baixar Banner de Capa (PNG)</span>
                </button>
              </div>

              {/* 5. Master 4K Ultra HD for print */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 flex flex-col justify-between gap-4 hover:border-zinc-700 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xl">🖨️</span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      Alta Resolução 4K (Para Gráficas)
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      4096 x 4096 px • Para cartões de visita, uniformes, adesivos e banners.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadSinglePreset('master-4k', 'alta-resolucao-4k')}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-purple-400" />
                  <span>Baixar Imagem 4K (PNG)</span>
                </button>
              </div>

              {/* 6. Original Vector SVG */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 flex flex-col justify-between gap-4 hover:border-zinc-700 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xl">📐</span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      Vetor Original (.SVG)
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Arquivo mestre com qualidade infinita que nunca perde a nitidez.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const blob = new Blob([selectedLogo.svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
                    const safeName = selectedLogo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                    downloadBlob(blob, `${safeName}-vetor-original.svg`);
                    setStatusMessage('Arquivo vetorial SVG baixado!');
                    confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
                  }}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-teal-400" />
                  <span>Baixar Arquivo Vetorial (.SVG)</span>
                </button>
              </div>
            </div>

            {/* PREVIEW ON PHONE SECTION */}
            <div className="mt-4 p-6 rounded-3xl border border-zinc-800 bg-zinc-950/60 flex flex-col items-center">
              <span className="text-xs font-semibold text-zinc-400 mb-3 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                Como vai ficar no perfil do Instagram e WhatsApp:
              </span>

              <div className="w-full max-w-sm p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full border-2 border-indigo-500/80 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-lg"
                  style={{ backgroundColor: selectedLogo.colors.backgroundDark }}
                >
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: selectedLogo.symbolSvgOnly || selectedLogo.svgMarkup,
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1">
                    {selectedLogo.brandName}
                    <span className="text-[10px] text-sky-400">✓</span>
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-1">
                    {selectedLogo.tagline || 'Página Oficial da Empresa'}
                  </p>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">
                    ● Pronto para publicação
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-zinc-950/60 py-6 px-4 text-center text-xs text-zinc-500">
        <p>Criador de Logotipos • Criado com inteligência artificial para o seu negócio</p>
      </footer>
    </div>
  );
}
