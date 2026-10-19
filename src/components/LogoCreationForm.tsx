import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Building2,
  Tag,
  Palette,
  Compass,
  Lightbulb,
  Loader2,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { INSPIRATION_PROMPTS } from '../data/sampleLogos';

interface LogoCreationFormProps {
  onGenerate: (formData: {
    companyName: string;
    tagline: string;
    description: string;
    industry: string;
    style: string;
    colorPreference: string;
    symbolPreference: string;
  }) => Promise<void>;
  isGenerating: boolean;
}

export const LogoCreationForm: React.FC<LogoCreationFormProps> = ({
  onGenerate,
  isGenerating,
}) => {
  const [companyName, setCompanyName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [industry, setIndustry] = useState<string>('Tecnologia');
  const [style, setStyle] = useState<string>('Minimalista & Futurista');
  const [colorPreference, setColorPreference] = useState<string>('Azul elétrico, ciano e violeta');
  const [symbolPreference, setSymbolPreference] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const industries = [
    'Tecnologia / Software / IA',
    'Gastronomia & Cafeterias',
    'Saúde, Medicina & Estética',
    'Finanças, Investimentos & Jurídico',
    'Moda, Beleza & Vestuário',
    'Arquitetura, Engenharia & Imobiliária',
    'Educação & Treinamento',
    'Esportes & Fitness',
    'Consultoria & Negócios',
    'Arte, Música & Entretenimento',
  ];

  const styleOptions = [
    {
      id: 'minimalist',
      title: 'Minimalista & Clean',
      desc: 'Linhas precisas, formas puras e sem excessos',
    },
    {
      id: 'modern-tech',
      title: 'High-Tech & Futurista',
      desc: 'Gradientes modernos, nós quânticos e neon',
    },
    {
      id: 'luxury',
      title: 'Luxo & Editorial',
      desc: 'Tipografia serifada nobre, dourado e imponência',
    },
    {
      id: 'organic',
      title: 'Orgânico & Botânico',
      desc: 'Curvas naturais, folhas, terra e harmonia zen',
    },
    {
      id: 'geometric',
      title: 'Geométrico & Abstrato',
      desc: 'Simetria impecável, proporção áurea e dinamismo',
    },
    {
      id: 'playful',
      title: 'Criativo & Amigável',
      desc: 'Energia jovem, formas calorosas e acessíveis',
    },
  ];

  const colorPalettes = [
    { label: 'Cyber Neon', val: 'Ciano elétrico, azul neon e magenta (#06B6D4, #6366F1, #EC4899)' },
    { label: 'Ouro & Safira', val: 'Dourado champanhe e azul marinho profundo (#D97706, #1E1B4B)' },
    { label: 'Esmeralda & Floresta', val: 'Verde esmeralda, menta e grafite escuro (#10B981, #064E3B)' },
    { label: 'Pôr do Sol Flame', val: 'Laranja vibrante, vermelho coral e âmbar (#F97316, #EF4444)' },
    { label: 'Preto & Branco Minimal', val: 'Monocromático de alto contraste preto e branco' },
    { label: 'Acolhedor Café', val: 'Tons de caramelo, café tostado e creme (#92400E, #D97706)' },
  ];

  const handleApplyInspiration = (item: (typeof INSPIRATION_PROMPTS)[0]) => {
    setCompanyName(item.company);
    setTagline(item.tagline);
    setDescription(item.description);
    setIndustry(item.industry);
    setStyle(item.style);
    setColorPreference(item.colorPreference);
    setSymbolPreference('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!companyName.trim() || !description.trim()) {
      setFormError('Por favor, informe ao menos o nome da empresa e a descrição.');
      return;
    }

    onGenerate({
      companyName,
      tagline,
      description,
      industry,
      style,
      colorPreference,
      symbolPreference,
    });
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Creation Box */}
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-3xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden"
      >
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Designer de Marcas IA
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Descreva sua empresa e crie o logotipo ideal
          </h2>
          <p className="text-xs md:text-sm text-zinc-400">
            Nossa IA analisa seu segmento, valores e público para gerar marcas vetoriais exclusivas, com animação e kit de redes sociais em alta resolução.
          </p>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
            <span>{formError}</span>
            <button
              type="button"
              onClick={() => setFormError(null)}
              className="text-white hover:text-amber-100 font-bold ml-3"
            >
              ✕
            </button>
          </div>
        )}

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Nome da Empresa *
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Luminar Soluções, Grão Nobre, Nexus..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Slogan */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Slogan / Tagline (Opcional)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ex: Inteligência para o Futuro, Torrefação Artesanal..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Description textarea */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            Descrição da Empresa, Valores e Público-Alvo *
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Conte um pouco sobre o que sua empresa faz, o que a torna especial, quem são seus clientes e a sensação que deseja transmitir (ex: segurança, velocidade, acolhimento, sofisticação)..."
            className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        {/* Industry & Symbol preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
              Ramo de Atuação:
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
              Símbolo ou Motivo Gráfico (Opcional):
            </label>
            <input
              type="text"
              value={symbolPreference}
              onChange={(e) => setSymbolPreference(e.target.value)}
              placeholder="Ex: Monograma, onda fluida, átomo, folha, triângulo..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Style Selection Cards */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 mb-2.5 block">
            Estilo Visual Preferido:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {styleOptions.map((opt) => {
              const isSelected = style === opt.title;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setStyle(opt.title)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-zinc-200'
                      }`}
                    >
                      {opt.title}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color presets */}
        <div>
          <label className="text-xs font-semibold text-zinc-300 mb-2.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            Preferência de Cores:
          </label>
          <div className="flex flex-wrap gap-2">
            {colorPalettes.map((c) => {
              const isSelected = colorPreference === c.val;
              return (
                <button
                  type="button"
                  key={c.label}
                  onClick={() => setColorPreference(c.val)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-semibold'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isGenerating || !companyName.trim() || !description.trim()}
          className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2.5 transition-all transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Gerando Conceitos Vetoriais com IA...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Criar Logotipos para Minha Empresa</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Inspiration Suggestions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Ou teste com um clique um dos modelos prontos:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {INSPIRATION_PROMPTS.map((insp) => (
            <button
              key={insp.company}
              onClick={() => handleApplyInspiration(insp)}
              className="p-3.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all text-left flex flex-col justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {insp.title}
                </div>
                <div className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                  {insp.description}
                </div>
              </div>
              <span className="text-[10px] text-indigo-400 font-medium mt-2 flex items-center gap-1">
                Carregar dados no formulário →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
