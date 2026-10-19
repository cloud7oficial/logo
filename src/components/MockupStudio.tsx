import React, { useState } from 'react';
import {
  Smartphone,
  CreditCard,
  Globe,
  Instagram,
  ShoppingBag,
  Building,
  Check,
  Eye,
} from 'lucide-react';
import { LogoConcept } from '../types/logo';

interface MockupStudioProps {
  logo: LogoConcept;
}

type MockupType = 'smartphone' | 'business-card' | 'website' | 'instagram' | 'merch' | 'storefront';

export const MockupStudio: React.FC<MockupStudioProps> = ({ logo }) => {
  const [activeMockup, setActiveMockup] = useState<MockupType>('smartphone');

  const mockups: { id: MockupType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'smartphone',
      label: 'App Mobile (iOS)',
      icon: <Smartphone className="w-4 h-4" />,
      desc: 'Ícone na tela inicial do celular',
    },
    {
      id: 'instagram',
      label: 'Feed do Instagram',
      icon: <Instagram className="w-4 h-4" />,
      desc: 'Perfil e post patrocinado oficial',
    },
    {
      id: 'business-card',
      label: 'Cartão de Visita',
      icon: <CreditCard className="w-4 h-4" />,
      desc: 'Acabamento executivo premium',
    },
    {
      id: 'website',
      label: 'Website SaaS',
      icon: <Globe className="w-4 h-4" />,
      desc: 'Cabeçalho e barra de navegação',
    },
    {
      id: 'merch',
      label: 'Camiseta & Tote Bag',
      icon: <ShoppingBag className="w-4 h-4" />,
      desc: 'Uniforme e brindes corporativos',
    },
    {
      id: 'storefront',
      label: 'Fachada 3D',
      icon: <Building className="w-4 h-4" />,
      desc: 'Placa luminosa na recepção',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-400" />
            Mockups em Ambientes Reais
          </h3>
          <p className="text-xs text-zinc-400">
            Veja como sua marca se comporta no mundo real antes de publicar
          </p>
        </div>

        {/* Mockup switcher */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
          {mockups.map((m) => {
            const isSelected = activeMockup === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMockup(m.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Mockup Stage */}
      <div className="w-full min-h-[460px] rounded-2xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-xl flex items-center justify-center p-6 md:p-12 overflow-hidden relative shadow-2xl">
        {/* Ambient background light */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle at center, ${logo.colors.primary} 0%, transparent 70%)`,
          }}
        />

        {/* 1. SMARTPHONE APP MOCKUP */}
        {activeMockup === 'smartphone' && (
          <div className="relative z-10 w-full max-w-[320px] rounded-[48px] border-[8px] border-zinc-800 bg-black p-4 shadow-2xl shadow-indigo-950/40">
            {/* Phone Speaker & Dynamic Island */}
            <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-zinc-950 mr-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-950" />
            </div>

            {/* Time and Battery */}
            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono px-3 mb-6">
              <span>09:41</span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <div className="w-4 h-2 border border-zinc-500 rounded-xs p-0.5">
                  <div className="w-full h-full bg-white rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-4 gap-4 px-2 mb-8">
              {/* Other dummy icons */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                  Mail
                </div>
                <span className="text-[9px] text-zinc-400">E-mail</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                  Pay
                </div>
                <span className="text-[9px] text-zinc-400">Carteira</span>
              </div>

              {/* TARGET APP ICON */}
              <div className="flex flex-col items-center gap-1 transform scale-110">
                <div
                  className="w-12 h-12 rounded-2xl shadow-lg shadow-indigo-500/25 p-1 flex items-center justify-center border border-white/20 overflow-hidden relative"
                  style={{
                    backgroundColor: logo.colors.backgroundDark,
                  }}
                >
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: logo.symbolSvgOnly || logo.svgMarkup,
                    }}
                  />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-black flex items-center justify-center text-[7px] font-bold text-white">
                    1
                  </div>
                </div>
                <span className="text-[9px] font-semibold text-white tracking-tight truncate max-w-[55px]">
                  {logo.brandName}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">
                  Map
                </div>
                <span className="text-[9px] text-zinc-400">Mapas</span>
              </div>
            </div>

            {/* Phone Dock */}
            <div className="w-full p-2.5 rounded-3xl bg-zinc-900/80 backdrop-blur-md flex justify-around items-center border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-zinc-800" />
              <div className="w-10 h-10 rounded-xl bg-zinc-800" />
              <div className="w-10 h-10 rounded-xl bg-zinc-800" />
              <div className="w-10 h-10 rounded-xl bg-zinc-800" />
            </div>

            {/* Home indicator bar */}
            <div className="w-28 h-1 bg-zinc-600 rounded-full mx-auto mt-4" />
          </div>
        )}

        {/* 2. INSTAGRAM FEED & PROFILE MOCKUP */}
        {activeMockup === 'instagram' && (
          <div className="relative z-10 w-full max-w-[380px] rounded-3xl border border-zinc-800 bg-zinc-900 text-white overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-full p-0.5 border-2 border-pink-500 overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: logo.colors.backgroundDark }}
                >
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: logo.symbolSvgOnly || logo.svgMarkup,
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1">
                    {logo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                    <span className="w-3 h-3 rounded-full bg-sky-500 text-[8px] flex items-center justify-center font-bold text-white">
                      ✓
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400">{logo.tagline || 'Conta Oficial'}</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-sky-400 cursor-pointer">Seguir</span>
            </div>

            {/* Feed Post Image */}
            <div
              className="w-full aspect-square relative flex items-center justify-center p-8 overflow-hidden"
              style={{
                backgroundColor: logo.colors.backgroundDark,
              }}
            >
              <div
                className="w-full h-full max-w-[280px] flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: logo.svgMarkup }}
              />
              <div className="absolute bottom-3 left-3 text-[10px] px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-zinc-300 font-mono">
                Identidade Visual Oficial
              </div>
            </div>

            {/* Post actions & caption */}
            <div className="p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-3">
                  <span>❤️ 4.821</span>
                  <span>💬 240</span>
                  <span>↗️ Compartilhar</span>
                </div>
                <span>🔖</span>
              </div>
              <p className="text-xs text-zinc-300 line-clamp-2">
                <span className="font-bold text-white mr-1.5">
                  {logo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                </span>
                {logo.rationale}
              </p>
            </div>
          </div>
        )}

        {/* 3. BUSINESS CARD MOCKUP */}
        {activeMockup === 'business-card' && (
          <div className="relative z-10 w-full max-w-[440px] aspect-[1.75/1] rounded-2xl p-8 shadow-2xl flex flex-col justify-between border border-zinc-700/60 overflow-hidden transform hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: logo.colors.backgroundDark,
              boxShadow: `0 25px 50px -12px ${logo.colors.primary}25`,
            }}
          >
            {/* Subtle card foil texture */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20 blur-2xl"
              style={{ backgroundColor: logo.colors.primary }}
            />

            <div className="flex justify-between items-start relative z-10">
              <div className="w-24 h-24"
                dangerouslySetInnerHTML={{
                  __html: logo.symbolSvgOnly || logo.svgMarkup,
                }}
              />
              <div className="text-right">
                <div className="text-sm font-bold text-white tracking-widest uppercase">
                  DIRETORIA EXECUTIVA
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  contato@{logo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                </div>
              </div>
            </div>

            <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-4">
              <div>
                <h4 className="text-lg font-bold text-white tracking-wider">
                  {logo.brandName}
                </h4>
                <p className="text-[10px] text-zinc-400 tracking-widest uppercase">
                  {logo.tagline || 'Excelência & Inovação'}
                </p>
              </div>
              <div className="text-[9px] text-zinc-400 font-mono text-right">
                <div>+55 (11) 98765-4321</div>
                <div>São Paulo • Brasil</div>
              </div>
            </div>
          </div>
        )}

        {/* 4. WEBSITE SAAS HEADER */}
        {activeMockup === 'website' && (
          <div className="relative z-10 w-full max-w-[620px] rounded-2xl border border-zinc-800 bg-zinc-950 text-white overflow-hidden shadow-2xl">
            {/* Browser Window Bar */}
            <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-6 py-1 rounded-md bg-zinc-950 text-[11px] text-zinc-400 font-mono border border-zinc-800">
                https://www.{logo.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br
              </div>
              <div className="w-8" />
            </div>

            {/* Navigation Bar */}
            <div className="p-4 flex items-center justify-between border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center"
                  dangerouslySetInnerHTML={{
                    __html: logo.symbolSvgOnly || logo.svgMarkup,
                  }}
                />
                <span className="text-sm font-bold tracking-tight text-white">
                  {logo.brandName}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-xs text-zinc-400">
                <span className="hover:text-white cursor-pointer">Produtos</span>
                <span className="hover:text-white cursor-pointer">Soluções</span>
                <span className="hover:text-white cursor-pointer">Preços</span>
                <span className="hover:text-white cursor-pointer">Sobre Nós</span>
              </div>
              <button
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white shadow-lg transition-transform active:scale-95"
                style={{ backgroundColor: logo.colors.primary }}
              >
                Começar Agora
              </button>
            </div>

            {/* Hero Section */}
            <div className="p-8 text-center flex flex-col items-center gap-3 bg-gradient-to-b from-zinc-950 to-zinc-900">
              <span className="px-3 py-1 rounded-full text-[10px] font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                ✨ Lançamento Oficial da Plataforma
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white max-w-md">
                O futuro com {logo.brandName}
              </h2>
              <p className="text-xs text-zinc-400 max-w-sm">
                {logo.rationale}
              </p>
            </div>
          </div>
        )}

        {/* 5. MERCHANDISE / APPAREL */}
        {activeMockup === 'merch' && (
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-8">
            {/* T-Shirt */}
            <div className="relative w-56 h-64 rounded-3xl bg-zinc-900 border border-zinc-800 p-4 shadow-xl flex flex-col items-center justify-center group overflow-hidden">
              <div className="absolute top-0 w-20 h-6 bg-zinc-950 rounded-b-2xl border-b border-zinc-700" />
              <div className="w-20 h-20 mb-2 transform group-hover:scale-110 transition-transform duration-300"
                dangerouslySetInnerHTML={{
                  __html: logo.symbolSvgOnly || logo.svgMarkup,
                }}
              />
              <span className="text-[11px] font-bold tracking-wider text-white">
                {logo.brandName}
              </span>
              <span className="text-[8px] text-zinc-400 tracking-widest uppercase mt-0.5">
                Premium Cotton Edition
              </span>
            </div>

            {/* Tote Bag */}
            <div className="relative w-48 h-60 rounded-2xl bg-[#E6DFD5] text-zinc-900 border border-amber-900/20 p-4 shadow-xl flex flex-col items-center justify-center">
              {/* Bag Straps */}
              <div className="absolute -top-12 w-24 h-16 border-4 border-amber-950/40 rounded-t-full" />
              <div className="w-16 h-16 mb-2 filter contrast-125"
                dangerouslySetInnerHTML={{
                  __html: logo.symbolSvgOnly || logo.svgMarkup,
                }}
              />
              <span className="text-xs font-bold tracking-wider text-zinc-900">
                {logo.brandName}
              </span>
              <span className="text-[8px] text-zinc-600 tracking-widest uppercase mt-0.5">
                Eco Canvas Bag
              </span>
            </div>
          </div>
        )}

        {/* 6. STOREFRONT SIGNBOARD */}
        {activeMockup === 'storefront' && (
          <div className="relative z-10 w-full max-w-[500px] aspect-[2/1] rounded-2xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black p-8 flex items-center justify-center border border-zinc-700 shadow-2xl overflow-hidden">
            {/* Wooden / Concrete architectural slats behind */}
            <div className="absolute inset-0 flex justify-between opacity-15 pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-4 h-full bg-zinc-600" />
              ))}
            </div>

            {/* Backlit Acrylic Sign Plate */}
            <div
              className="relative z-10 px-8 py-5 rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl flex items-center gap-5"
              style={{
                backgroundColor: `${logo.colors.backgroundDark}CC`,
                boxShadow: `0 0 40px ${logo.colors.primary}50`,
              }}
            >
              <div
                className="w-16 h-16"
                dangerouslySetInnerHTML={{
                  __html: logo.symbolSvgOnly || logo.svgMarkup,
                }}
              />
              <div>
                <h3 className="text-xl font-bold text-white tracking-widest">
                  {logo.brandName}
                </h3>
                <p className="text-[10px] text-zinc-300 font-medium tracking-widest uppercase">
                  {logo.tagline || 'Sede Corporativa'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
