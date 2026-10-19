import JSZip from 'jszip';
import { LogoConcept, SocialExportPreset, BackdropType, AnimationType } from '../types/logo';

/**
 * Downloads a Blob directly with specified filename
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Downloads text as a file
 */
export function downloadText(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

/**
 * Renders an SVG markup string to a high-DPI Canvas at exact dimensions
 */
export async function renderSvgToCanvas(
  svgMarkup: string,
  width: number,
  height: number,
  backdrop: BackdropType = 'dark',
  colors?: LogoConcept['colors'],
  paddingFactor = 0.22,
  useSymbolOnly = false,
  symbolSvgOnly?: string
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: true });

  if (!ctx) {
    throw new Error('Não foi possível inicializar o contexto 2D do Canvas.');
  }

  // Draw background
  if (backdrop === 'transparent') {
    // Keep transparent
  } else if (backdrop === 'dark') {
    const bg = colors?.backgroundDark || '#0A0D18';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Subtle radial aura in center
    const radial = ctx.createRadialGradient(
      width / 2,
      height / 2,
      10,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.7
    );
    radial.addColorStop(0, colors?.primary ? `${colors.primary}25` : 'rgba(99, 102, 241, 0.15)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
  } else if (backdrop === 'light') {
    ctx.fillStyle = colors?.backgroundLight || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  } else if (backdrop === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, colors?.backgroundDark || '#0A0D18');
    grad.addColorStop(0.5, colors?.primary ? `${colors.primary}40` : '#1E1B4B');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = colors?.backgroundDark || '#090D16';
    ctx.fillRect(0, 0, width, height);
  }

  // Select target markup
  const targetSvg = (useSymbolOnly && symbolSvgOnly) ? symbolSvgOnly : svgMarkup;

  // Create an image from SVG blob
  const svgBlob = new Blob([targetSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(new Error('Erro ao carregar SVG no canvas: ' + String(e)));
    img.src = url;
  });

  // Calculate scaling and placement
  const maxContentW = width * (1 - paddingFactor * 2);
  const maxContentH = height * (1 - paddingFactor * 2);

  const imgW = img.naturalWidth || 500;
  const imgH = img.naturalHeight || 500;

  const scale = Math.min(maxContentW / imgW, maxContentH / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  const drawX = (width - drawW) / 2;
  const drawY = (height - drawH) / 2;

  ctx.drawImage(img, drawX, drawY, drawW, drawH);

  URL.revokeObjectURL(url);
  return canvas;
}

/**
 * Converts canvas to PNG Blob
 */
export async function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Falha ao exportar imagem PNG'));
    }, 'image/png', 1.0);
  });
}

/**
 * Export a single Social Media preset as PNG
 */
export async function exportSocialPresetPng(
  logo: LogoConcept,
  preset: SocialExportPreset,
  backdrop: BackdropType = 'dark'
) {
  const isIcon = preset.category === 'icon' || (preset.category === 'profile' && preset.width < 500);
  const canvas = await renderSvgToCanvas(
    logo.svgMarkup,
    preset.width,
    preset.height,
    backdrop,
    logo.colors,
    preset.category === 'banner' ? 0.14 : 0.2,
    isIcon,
    logo.symbolSvgOnly
  );

  const blob = await canvasToPngBlob(canvas);
  const safeBrand = logo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  downloadBlob(blob, `${safeBrand}-${preset.id}-${preset.width}x${preset.height}.png`);
}

/**
 * Generates an animated standalone SVG with self-contained CSS keyframes
 */
export function generateAnimatedSvg(logo: LogoConcept, animationType: AnimationType): string {
  const css = getSvgKeyframesCss(animationType);
  const parser = new DOMParser();
  const doc = parser.parseFromString(logo.svgMarkup, 'image/svg+xml');
  const svgEl = doc.querySelector('svg');

  if (!svgEl) return logo.svgMarkup;

  const styleEl = doc.createElementNS('http://www.w3.org/2000/svg', 'style');
  styleEl.textContent = css;
  svgEl.insertBefore(styleEl, svgEl.firstChild);

  return new XMLSerializer().serializeToString(doc);
}

/**
 * CSS keyframes embedded in SVG for smooth native playback
 */
export function getSvgKeyframesCss(type: AnimationType): string {
  switch (type) {
    case 'construct':
      return `
        #symbol path, #symbol polygon, #symbol circle, #symbol line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: constructDraw 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        }
        #typography, #tagline {
          animation: fadeIn 3.2s ease-in-out infinite alternate;
        }
        @keyframes constructDraw {
          0% { stroke-dashoffset: 1000; opacity: 0; }
          40% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes fadeIn {
          0%, 40% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `;
    case 'pulse':
      return `
        #symbol {
          transform-origin: 250px 190px;
          animation: pulseBreath 3s ease-in-out infinite alternate;
        }
        #typography {
          transform-origin: 250px 360px;
          animation: subtleTextPulse 3s ease-in-out infinite alternate;
        }
        @keyframes pulseBreath {
          0% { transform: scale(0.96) translateY(2px); filter: brightness(0.95); }
          100% { transform: scale(1.05) translateY(-4px); filter: brightness(1.15) drop-shadow(0 0 16px rgba(99,102,241,0.5)); }
        }
        @keyframes subtleTextPulse {
          0% { opacity: 0.85; }
          100% { opacity: 1; filter: drop-shadow(0 0 8px rgba(255,255,255,0.3)); }
        }
      `;
    case 'spin':
      return `
        #symbol {
          transform-origin: 250px 190px;
          animation: orbitRotate 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        #typography, #tagline {
          animation: breathe 3s ease-in-out infinite alternate;
        }
        @keyframes orbitRotate {
          0% { transform: rotate(0deg) scale(0.95); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(0.95); }
        }
        @keyframes breathe {
          0% { opacity: 0.8; }
          100% { opacity: 1; }
        }
      `;
    case 'neon':
      return `
        #symbol, #typography {
          animation: neonFlicker 2.8s ease-in-out infinite alternate;
        }
        @keyframes neonFlicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            filter: drop-shadow(0 0 6px #6366F1) drop-shadow(0 0 18px #06B6D4) drop-shadow(0 0 35px #EC4899);
            opacity: 1;
          }
          20%, 24%, 55% {
            filter: none;
            opacity: 0.7;
          }
        }
      `;
    case 'bounce':
      return `
        #symbol {
          transform-origin: 250px 190px;
          animation: elasticPop 2.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate;
        }
        #typography {
          transform-origin: 250px 360px;
          animation: textSpring 2.2s ease-in-out infinite alternate;
        }
        @keyframes elasticPop {
          0% { transform: scale(0.85) translateY(10px); }
          100% { transform: scale(1.08) translateY(-6px); }
        }
        @keyframes textSpring {
          0% { transform: scale(0.98); opacity: 0.8; }
          100% { transform: scale(1.02); opacity: 1; }
        }
      `;
    case 'cinematic':
    default:
      return `
        #symbol {
          transform-origin: 250px 190px;
          animation: cinematicFloat 4s ease-in-out infinite alternate;
        }
        #typography {
          animation: shimmer 4s ease-in-out infinite alternate;
        }
        @keyframes cinematicFloat {
          0% { transform: scale(0.98) translateY(4px); filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5)); }
          100% { transform: scale(1.03) translateY(-6px); filter: drop-shadow(0 15px 25px rgba(99,102,241,0.4)) brightness(1.1); }
        }
        @keyframes shimmer {
          0% { letter-spacing: 6px; opacity: 0.85; }
          100% { letter-spacing: 9px; opacity: 1; }
        }
      `;
  }
}

/**
 * Records animated SVG frames into a real .webm video file using MediaRecorder
 */
export async function recordAnimatedWebm(
  svgMarkup: string,
  animationType: AnimationType,
  durationMs = 4000,
  width = 1080,
  height = 1080,
  colors?: LogoConcept['colors']
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const animatedSvgString = generateAnimatedSvg(
    { svgMarkup, colors: colors || { primary: '#6366F1', secondary: '#EC4899', accent: '#06B6D4', backgroundDark: '#0A0D18', backgroundLight: '#FFFFFF', textColor: '#FFFFFF' } } as any,
    animationType
  );

  const stream = canvas.captureStream(60);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 5000000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const svgBlob = new Blob([animatedSvgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();

  await new Promise<void>((res) => {
    img.onload = () => res();
    img.src = url;
  });

  mediaRecorder.start();

  const startTime = performance.now();

  return new Promise((resolve) => {
    function drawFrame(now: number) {
      const elapsed = now - startTime;
      const progress = (elapsed % 3000) / 3000;

      // Draw background
      ctx.fillStyle = colors?.backgroundDark || '#0A0D18';
      ctx.fillRect(0, 0, width, height);

      // Radial aura
      const rad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
      rad.addColorStop(0, colors?.primary ? `${colors.primary}35` : 'rgba(99,102,241,0.25)');
      rad.addColorStop(1, 'transparent');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, width, height);

      // Apply dynamic transform simulating the animation
      ctx.save();
      ctx.translate(width / 2, height / 2);

      if (animationType === 'spin') {
        ctx.rotate(progress * Math.PI * 2);
      } else if (animationType === 'pulse') {
        const s = 1 + Math.sin(progress * Math.PI * 2) * 0.05;
        ctx.scale(s, s);
      } else if (animationType === 'bounce') {
        const bounce = Math.abs(Math.sin(progress * Math.PI * 2)) * 0.08;
        ctx.scale(1 + bounce, 1 + bounce);
      }

      const imgW = width * 0.65;
      const imgH = height * 0.65;
      ctx.drawImage(img, -imgW / 2, -imgH / 2, imgW, imgH);
      ctx.restore();

      if (elapsed < durationMs) {
        requestAnimationFrame(drawFrame);
      } else {
        mediaRecorder.stop();
      }
    }

    mediaRecorder.onstop = () => {
      URL.revokeObjectURL(url);
      resolve(new Blob(chunks, { type: 'video/webm' }));
    };

    requestAnimationFrame(drawFrame);
  });
}

/**
 * Creates and downloads a complete Social Media & Brand Kit ZIP archive
 */
export async function downloadCompleteBrandKitZip(
  logo: LogoConcept,
  socialPresets: SocialExportPreset[],
  onProgress?: (progress: number, label: string) => void
) {
  const zip = new JSZip();
  const safeName = logo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  const totalSteps = socialPresets.length + 5;
  let currentStep = 0;

  const updateProgress = (label: string) => {
    currentStep++;
    if (onProgress) {
      onProgress(Math.round((currentStep / totalSteps) * 100), label);
    }
  };

  // 1. Vector SVG Files
  updateProgress('Criando arquivos vetoriais SVG...');
  const vectorFolder = zip.folder('01_arquivos_vetoriais_svg')!;
  vectorFolder.file(`${safeName}-logo-vetor.svg`, logo.svgMarkup);
  if (logo.symbolSvgOnly) {
    vectorFolder.file(`${safeName}-simbolo-vetor.svg`, logo.symbolSvgOnly);
  }
  const animatedSvg = generateAnimatedSvg(logo, logo.recommendedAnimation);
  vectorFolder.file(`${safeName}-logo-animado.svg`, animatedSvg);

  // 2. Ultra 4K Master PNGs
  updateProgress('Renderizando Master 4K Ultra HD (4096px)...');
  const masterFolder = zip.folder('02_ultra_hd_4k_master')!;
  
  // 4K Transparent
  const canvas4kTrans = await renderSvgToCanvas(logo.svgMarkup, 4096, 4096, 'transparent', logo.colors, 0.15);
  const blob4kTrans = await canvasToPngBlob(canvas4kTrans);
  masterFolder.file(`${safeName}-4k-transparente.png`, blob4kTrans);

  // 4K Dark
  const canvas4kDark = await renderSvgToCanvas(logo.svgMarkup, 4096, 4096, 'dark', logo.colors, 0.18);
  const blob4kDark = await canvasToPngBlob(canvas4kDark);
  masterFolder.file(`${safeName}-4k-fundo-escuro.png`, blob4kDark);

  // 4K Light
  const canvas4kLight = await renderSvgToCanvas(logo.svgMarkup, 4096, 4096, 'light', logo.colors, 0.18);
  const blob4kLight = await canvasToPngBlob(canvas4kLight);
  masterFolder.file(`${safeName}-4k-fundo-claro.png`, blob4kLight);

  // 3. Social Media Presets
  const socialFolder = zip.folder('03_redes_sociais_alta_resolucao')!;
  for (const preset of socialPresets) {
    if (preset.category === 'master') continue;
    updateProgress(`Gerando ${preset.platform} (${preset.name})...`);

    const isIcon = preset.category === 'icon' || (preset.category === 'profile' && preset.width <= 512);
    const canvas = await renderSvgToCanvas(
      logo.svgMarkup,
      preset.width,
      preset.height,
      'dark',
      logo.colors,
      preset.category === 'banner' ? 0.14 : 0.22,
      isIcon,
      logo.symbolSvgOnly
    );
    const blob = await canvasToPngBlob(canvas);
    const cleanId = preset.id;
    socialFolder.file(`${cleanId}-${preset.width}x${preset.height}.png`, blob);
  }

  // 4. Favicon & Web App Pack
  updateProgress('Criando pacote de Favicons...');
  const iconFolder = zip.folder('04_favicons_e_web_app')!;
  const iconSizes = [32, 64, 192, 512];
  for (const s of iconSizes) {
    const canvas = await renderSvgToCanvas(
      logo.svgMarkup,
      s,
      s,
      'dark',
      logo.colors,
      0.15,
      true,
      logo.symbolSvgOnly
    );
    const blob = await canvasToPngBlob(canvas);
    iconFolder.file(`favicon-${s}x${s}.png`, blob);
  }

  // 5. Brand Identity Guide & Palette JSON
  updateProgress('Compilando manual e paleta de cores...');
  const guideFolder = zip.folder('05_manual_de_identidade')!;

  const paletteJson = JSON.stringify(
    {
      brandName: logo.brandName,
      tagline: logo.tagline,
      colors: logo.colors,
      typography: {
        recommendedFont: logo.fontFamily,
      },
      recommendedAnimation: logo.recommendedAnimation,
      styleKeywords: logo.styleKeywords,
      generatedDate: new Date().toISOString(),
    },
    null,
    2
  );
  guideFolder.file('paleta-de-cores.json', paletteJson);

  const brandManualText = `=====================================================
MANUAL DE IDENTIDADE VISUAL & GUIA DE MARCA
Empresa: ${logo.brandName}
Slogan: ${logo.tagline || 'N/A'}
=====================================================

1. CONCEITO DA MARCA:
${logo.conceptName}
${logo.rationale}

2. PALETA DE CORES OFICIAL:
- Cor Primária: ${logo.colors.primary}
- Cor Secundária: ${logo.colors.secondary}
- Destaque (Accent): ${logo.colors.accent}
- Fundo Escuro: ${logo.colors.backgroundDark}
- Fundo Claro: ${logo.colors.backgroundLight}
- Texto: ${logo.colors.textColor}

3. TIPOGRAFIA RECOMENDADA:
- Família Principal: ${logo.fontFamily} (disponível no Google Fonts)

4. PRESET DE ANIMAÇÃO SUGERIDO:
- Tipo: ${logo.recommendedAnimation.toUpperCase()}

5. ARQUIVOS INCLUSOS NESTE PACOTE:
- 01_arquivos_vetoriais_svg: SVG vetorial puro com escala infinita.
- 02_ultra_hd_4k_master: Arquivos PNG em 4096 x 4096 px para impressões e outdoors.
- 03_redes_sociais_alta_resolucao: Imagens formatadas para Instagram, LinkedIn, YouTube, X, Facebook, WhatsApp.
- 04_favicons_e_web_app: Ícones em 32px, 64px, 192px e 512px.
- 05_manual_de_identidade: Este arquivo e o arquivo JSON com códigos hexadecimais.

Gerado com tecnologia de ponta pelo Logomaker Studio AI.
`;
  guideFolder.file('manual-da-marca.txt', brandManualText);

  updateProgress('Compactando arquivo ZIP final...');
  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, `${safeName}-kit-completo-redes-sociais.zip`);
}
