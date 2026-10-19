import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Download,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Sliders,
  Check,
  Eye,
  Film,
} from 'lucide-react';
import { LogoConcept, AnimationType, BackdropType } from '../types/logo';
import {
  generateAnimatedSvg,
  downloadBlob,
  recordAnimatedWebm,
  renderSvgToCanvas,
  canvasToPngBlob,
} from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface AnimatedLogoViewerProps {
  logo: LogoConcept;
  onSelectAnotherConcept?: () => void;
}

export const AnimatedLogoViewer: React.FC<AnimatedLogoViewerProps> = ({ logo }) => {
  const [animation, setAnimation] = useState<AnimationType>(logo.recommendedAnimation || 'neon');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [backdrop, setBackdrop] = useState<BackdropType>('dark');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingProgress, setRecordingProgress] = useState<string>('');
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [replayKey, setReplayKey] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync animation when logo changes
  useEffect(() => {
    if (logo.recommendedAnimation) {
      setAnimation(logo.recommendedAnimation);
    }
  }, [logo.id]);

  const animationPresets: { id: AnimationType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'construct',
      label: 'Linhas Vivas',
      icon: <Layers className="w-4 h-4" />,
      desc: 'Desenho gradual das linhas e contornos do símbolo',
    },
    {
      id: 'pulse',
      label: 'Pulso & Aura',
      icon: <Activity className="w-4 h-4" />,
      desc: 'Levitação suave e respiração luminosa contínua',
    },
    {
      id: 'spin',
      label: 'Giro Dinâmico',
      icon: <RotateCcw className="w-4 h-4" />,
      desc: 'Rotação dimensional fluida com transições orgânicas',
    },
    {
      id: 'neon',
      label: 'Cyber Neon',
      icon: <Zap className="w-4 h-4" />,
      desc: 'Cintilação eletrizante e brilho neon multicamada',
    },
    {
      id: 'bounce',
      label: 'Impacto Pop',
      icon: <Sparkles className="w-4 h-4" />,
      desc: 'Entrada elástica energética com rebote expressivo',
    },
    {
      id: 'cinematic',
      label: 'Cinemático Flare',
      icon: <Film className="w-4 h-4" />,
      desc: 'Varredura de luz premium e flare cinematográfico',
    },
  ];

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
    setIsPlaying(true);
  };

  const handleDownloadAnimatedSvg = () => {
    const animatedSvgMarkup = generateAnimatedSvg(logo, animation);
    const blob = new Blob([animatedSvgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const safeBrand = logo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadBlob(blob, `${safeBrand}-animado-${animation}.svg`);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const handleRecordVideo = async () => {
    try {
      setIsRecording(true);
      setRecordingProgress('Renderizando frames de alta definição (60fps)...');

      const videoBlob = await recordAnimatedWebm(
        logo.svgMarkup,
        animation,
        4000,
        1080,
        1080,
        logo.colors
      );

      setRecordingProgress('Finalizando arquivo WebM...');
      const safeBrand = logo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      downloadBlob(videoBlob, `${safeBrand}-animacao-${animation}-1080p.webm`);

      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    } catch (err: any) {
      console.error('Erro na gravação de vídeo:', err);
      setErrorMessage('Não foi possível gravar o vídeo no navegador atual. Baixe o SVG animado ou tente tirar uma foto HD.');
    } finally {
      setIsRecording(false);
      setRecordingProgress('');
    }
  };

  const handleDownloadSnapshot = async () => {
    const canvas = await renderSvgToCanvas(logo.svgMarkup, 1920, 1920, backdrop, logo.colors, 0.2);
    const blob = await canvasToPngBlob(canvas);
    const safeBrand = logo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    downloadBlob(blob, `${safeBrand}-snapshot-1920p.png`);
  };

  // Generate the active SVG with style overrides
  const activeSvg = generateAnimatedSvg(logo, isPlaying ? animation : ('none' as any));

  // Determine container backdrop style
  const getBackdropClass = () => {
    switch (backdrop) {
      case 'light':
        return 'bg-slate-100 text-slate-900 border-slate-200';
      case 'gradient':
        return 'bg-gradient-to-br from-[#0c0e1a] via-[#1a1236] to-[#0a0d18] border-purple-900/40';
      case 'mesh':
        return 'bg-gradient-to-tr from-[#090d16] via-[#0f2438] to-[#120e2e] border-cyan-900/40';
      case 'transparent':
        return 'bg-[linear-gradient(45deg,#18181b_25%,transparent_25%),linear-gradient(-45deg,#18181b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#18181b_75%),linear-gradient(-45deg,transparent_75%,#18181b_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] border-zinc-800';
      case 'dark':
      default:
        return 'bg-[#080B12] border-zinc-800';
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Stage Container */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-xl overflow-hidden shadow-2xl p-6 md:p-8">
        {/* Top bar inside stage */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPlaying ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <div>
              <h3 className="text-base font-semibold text-white tracking-wide flex items-center gap-2">
                {logo.conceptName}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  {animation.toUpperCase()}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Resolução Vetorial 100% Responsiva • Animação em 60 FPS
              </p>
            </div>
          </div>

          {/* Quick Backdrop Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-400 px-2 flex items-center gap-1">
              <Eye className="w-3 h-3" /> Fundo:
            </span>
            {(
              [
                { id: 'dark', label: 'Escuro' },
                { id: 'light', label: 'Claro' },
                { id: 'gradient', label: 'Gradiente' },
                { id: 'mesh', label: 'Aurora' },
                { id: 'transparent', label: 'Grade' },
              ] as { id: BackdropType; label: string }[]
            ).map((bg) => (
              <button
                key={bg.id}
                onClick={() => setBackdrop(bg.id)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
                  backdrop === bg.id
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {bg.label}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-white hover:text-amber-100 font-bold ml-3"
            >
              ✕
            </button>
          </div>
        )}

        {/* The Animated Canvas Stage */}
        <div
          ref={containerRef}
          className={`relative w-full aspect-square max-w-[540px] mx-auto rounded-2xl flex items-center justify-center p-8 transition-colors duration-500 border ${getBackdropClass()} shadow-inner overflow-hidden`}
        >
          {/* Ambient Radial Glow */}
          {backdrop === 'dark' && (
            <div
              className="absolute inset-0 pointer-events-none opacity-40 blur-3xl transition-opacity duration-700"
              style={{
                background: `radial-gradient(circle at center, ${logo.colors.primary}60 0%, ${logo.colors.secondary}20 50%, transparent 70%)`,
              }}
            />
          )}

          {/* SVG Animated Element */}
          <div
            key={replayKey}
            className="w-full h-full flex items-center justify-center relative z-10 transition-transform"
            style={{
              animationDuration: `${(1 / speed).toFixed(2)}s`,
            }}
            dangerouslySetInnerHTML={{ __html: activeSvg }}
          />

          {/* Recording Overlay */}
          {isRecording && (
            <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
              <p className="text-white font-medium text-sm mb-1">{recordingProgress}</p>
              <p className="text-zinc-400 text-xs">Capturando vídeo em alta definição para Instagram Reels e Stories...</p>
            </div>
          )}
        </div>

        {/* Interactive Playback & Speed Controls Bar */}
        <div className="mt-6 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pausar' : 'Reproduzir'}
            </button>

            <button
              onClick={handleReplay}
              title="Reiniciar animação do início"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>

            <div className="h-5 w-px bg-zinc-800 mx-1 hidden sm:block" />

            {/* Speed Options */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <span className="text-[11px] text-zinc-400 px-1.5 flex items-center gap-1 font-mono">
                <Sliders className="w-3 h-3" /> Vel:
              </span>
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded transition-all ${
                    speed === s
                      ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRecordVideo}
              disabled={isRecording}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium flex items-center gap-2 transition-all border border-zinc-700 active:scale-95 disabled:opacity-50"
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Vídeo (.webm)</span>
            </button>

            <button
              onClick={handleDownloadAnimatedSvg}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium flex items-center gap-2 transition-all border border-zinc-700 active:scale-95"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>SVG Animado</span>
            </button>

            <button
              onClick={handleDownloadSnapshot}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium flex items-center gap-2 transition-all border border-zinc-700 active:scale-95"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Foto HD</span>
            </button>
          </div>
        </div>

        {/* Animation Presets Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Estilos de Animação para Redes Sociais &amp; Vídeos:
            </label>
            <span className="text-xs text-zinc-400 font-mono">
              {animationPresets.find((p) => p.id === animation)?.label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {animationPresets.map((preset) => {
              const isSelected = animation === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setAnimation(preset.id);
                    setIsPlaying(true);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 group relative ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-indigo-500 text-white'
                          : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'
                      }`}
                    >
                      {preset.icon}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-zinc-300'
                      }`}
                    >
                      {preset.label}
                    </div>
                    <div className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5">
                      {preset.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
