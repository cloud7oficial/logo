import { LogoConcept } from '../types/logo';

export const SAMPLE_LOGOS: LogoConcept[] = [
  {
    id: 'sample-nexus',
    conceptName: 'Nexus Quantum AI',
    rationale: 'Inspirado em nós neurais e geometria multidimensional. O símbolo central forma uma fusão entre um cristal de dados e uma letra "N" dinâmica, transmitindo velocidade, computação quântica e inteligência artificial de fronteira.',
    brandName: 'NEXUS',
    tagline: 'QUANTUM INTELLIGENCE',
    colors: {
      primary: '#6366F1',
      secondary: '#EC4899',
      accent: '#06B6D4',
      backgroundDark: '#0A0D18',
      backgroundLight: '#F8FAFC',
      textColor: '#FFFFFF',
    },
    fontFamily: 'Space Grotesk',
    recommendedAnimation: 'neon',
    styleKeywords: ['Tecnologia', 'Quântico', 'Futurista', 'Inovação'],
    svgMarkup: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nexus-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="50%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#EC4899" />
    </linearGradient>
    <linearGradient id="nexus-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EC4899" />
      <stop offset="100%" stop-color="#8B5CF6" />
    </linearGradient>
    <filter id="nexus-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <g id="symbol" transform="translate(250, 190)">
    <!-- Dynamic Hexagonal Ring -->
    <polygon points="0,-100 86,-50 86,50 0,100 -86,50 -86,-50" fill="none" stroke="url(#nexus-grad-1)" stroke-width="4" opacity="0.4" />
    
    <!-- Outer Quantum Loops -->
    <path d="M -60 -35 L 0 -70 L 60 -35 L 60 35 L 0 70 L -60 35 Z" fill="none" stroke="url(#nexus-grad-1)" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" />
    
    <!-- Central N-Core Prism -->
    <path d="M -35 45 L -35 -45 L 35 45 L 35 -45" fill="none" stroke="url(#nexus-grad-2)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" filter="url(#nexus-glow)" />
    
    <!-- Floating Data Nodes -->
    <circle cx="0" cy="-70" r="6" fill="#06B6D4" />
    <circle cx="60" cy="35" r="6" fill="#EC4899" />
    <circle cx="-60" cy="35" r="6" fill="#6366F1" />
    <circle cx="0" cy="0" r="7" fill="#FFFFFF" />
  </g>
  <g id="typography">
    <text x="250" y="360" text-anchor="middle" font-family="'Space Grotesk', 'Plus Jakarta Sans', sans-serif" font-weight="700" font-size="44" letter-spacing="8" fill="#FFFFFF">NEXUS</text>
  </g>
  <g id="tagline">
    <text x="250" y="398" text-anchor="middle" font-family="'Space Grotesk', 'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="13" letter-spacing="6" fill="#06B6D4" opacity="0.9">QUANTUM INTELLIGENCE</text>
  </g>
</svg>`,
    symbolSvgOnly: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nexus-sym-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4" />
      <stop offset="50%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#EC4899" />
    </linearGradient>
  </defs>
  <g transform="translate(100, 100) scale(0.7)">
    <polygon points="0,-100 86,-50 86,50 0,100 -86,50 -86,-50" fill="none" stroke="url(#nexus-sym-grad)" stroke-width="4" opacity="0.4" />
    <path d="M -60 -35 L 0 -70 L 60 -35 L 60 35 L 0 70 L -60 35 Z" fill="none" stroke="url(#nexus-sym-grad)" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" />
    <path d="M -35 45 L -35 -45 L 35 45 L 35 -45" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="0" cy="-70" r="7" fill="#06B6D4" />
    <circle cx="60" cy="35" r="7" fill="#EC4899" />
    <circle cx="-60" cy="35" r="7" fill="#6366F1" />
    <circle cx="0" cy="0" r="7" fill="#FFFFFF" />
  </g>
</svg>`,
  },
  {
    id: 'sample-grao-alma',
    conceptName: 'Grão & Alma Café',
    rationale: 'Conceito artesanal com estética minimalista e acolhedora. A silhueta combina o grão de café especial cortado ao centro com uma gota botânica e vapor aromático, simbolizando cuidado na torra, procedência e alma do café de altitude.',
    brandName: 'GRÃO & ALMA',
    tagline: 'TORREFAÇÃO ARTESANAL',
    colors: {
      primary: '#D97706',
      secondary: '#92400E',
      accent: '#FDE68A',
      backgroundDark: '#1C1510',
      backgroundLight: '#FFFBEB',
      textColor: '#FFFFFF',
    },
    fontFamily: 'Outfit',
    recommendedAnimation: 'pulse',
    styleKeywords: ['Café', 'Artesanal', 'Orgânico', 'Aconchegante', 'Minimalista'],
    svgMarkup: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="coffee-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="50%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
    <linearGradient id="steam-grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#D97706" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#FDE68A" stop-opacity="0.2" />
    </linearGradient>
  </defs>
  <g id="symbol" transform="translate(250, 185)">
    <!-- Subtle Golden Halo -->
    <circle cx="0" cy="0" r="92" fill="none" stroke="#D97706" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.4" />
    
    <!-- Coffee Bean Outer Shell Left -->
    <path d="M -12 -70 C -65 -60 -85 -10 -65 45 C -50 80 -15 85 -5 85 C -8 50 -12 10 -12 -70 Z" fill="url(#coffee-grad)" />
    
    <!-- Coffee Bean Outer Shell Right -->
    <path d="M 12 70 C 65 60 85 10 65 -45 C 50 -80 15 -85 5 -85 C 8 -50 12 -10 12 70 Z" fill="url(#coffee-grad)" opacity="0.9" />
    
    <!-- Central S-Curve Aroma Crease -->
    <path d="M -5 -80 C -2 -30 25 -10 0 20 C -25 50 0 75 5 80" fill="none" stroke="#1C1510" stroke-width="7" stroke-linecap="round" />
    
    <!-- Floating Aroma Sparkle -->
    <circle cx="0" cy="-95" r="4" fill="#FDE68A" />
  </g>
  <g id="typography">
    <text x="250" y="355" text-anchor="middle" font-family="'Outfit', 'Montserrat', sans-serif" font-weight="600" font-size="38" letter-spacing="4" fill="#FFFFFF">GRÃO &amp; ALMA</text>
  </g>
  <g id="tagline">
    <text x="250" y="392" text-anchor="middle" font-family="'Outfit', 'Montserrat', sans-serif" font-weight="400" font-size="12" letter-spacing="6" fill="#D97706">TORREFAÇÃO ARTESANAL</text>
  </g>
</svg>`,
    symbolSvgOnly: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="coffee-sym-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="50%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
  </defs>
  <g transform="translate(100, 100) scale(0.65)">
    <circle cx="0" cy="0" r="92" fill="none" stroke="#D97706" stroke-width="2" opacity="0.4" />
    <path d="M -12 -70 C -65 -60 -85 -10 -65 45 C -50 80 -15 85 -5 85 C -8 50 -12 10 -12 -70 Z" fill="url(#coffee-sym-grad)" />
    <path d="M 12 70 C 65 60 85 10 65 -45 C 50 -80 15 -85 5 -85 C 8 -50 12 -10 12 70 Z" fill="url(#coffee-sym-grad)" opacity="0.9" />
    <path d="M -5 -80 C -2 -30 25 -10 0 20 C -25 50 0 75 5 80" fill="none" stroke="#1C1510" stroke-width="7" stroke-linecap="round" />
    <circle cx="0" cy="-95" r="5" fill="#FDE68A" />
  </g>
</svg>`,
  },
  {
    id: 'sample-vanguard',
    conceptName: 'Vanguard Capital',
    rationale: 'Estética clássica de alto padrão para finanças e gestão de fortunas. O monograma entrelaça o "V" e a coluna jônica ascendente, simbolizando solidez institucional, visão de longo prazo e crescimento patrimonial sustentável.',
    brandName: 'VANGUARD',
    tagline: 'PRIVATE WEALTH MANAGEMENT',
    colors: {
      primary: '#10B981',
      secondary: '#047857',
      accent: '#6EE7B7',
      backgroundDark: '#041712',
      backgroundLight: '#ECFDF5',
      textColor: '#FFFFFF',
    },
    fontFamily: 'Cinzel',
    recommendedAnimation: 'cinematic',
    styleKeywords: ['Luxo', 'Finanças', 'Investimentos', 'Sólido', 'Clássico'],
    svgMarkup: `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="vg-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A7F3D0" />
      <stop offset="40%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#064E3B" />
    </linearGradient>
  </defs>
  <g id="symbol" transform="translate(250, 185)">
    <!-- Octagon Border of Trust -->
    <polygon points="0,-95 67,-67 95,0 67,67 0,95 -67,67 -95,0 -67,-67" fill="none" stroke="#10B981" stroke-width="2" opacity="0.5" />
    
    <!-- Inner Diamond -->
    <polygon points="0,-82 82,0 0,82 -82,0" fill="none" stroke="url(#vg-gold)" stroke-width="3" opacity="0.8" />
    
    <!-- Bold Sharp V-Wing -->
    <path d="M -50 -45 L 0 55 L 50 -45 L 28 -45 L 0 15 L -28 -45 Z" fill="url(#vg-gold)" />
    
    <!-- Ascending Pillar Arrow -->
    <path d="M 0 -70 L 15 -40 L -15 -40 Z" fill="#6EE7B7" />
    <line x1="0" y1="-35" x2="0" y2="0" stroke="#6EE7B7" stroke-width="4" stroke-linecap="round" />
  </g>
  <g id="typography">
    <text x="250" y="358" text-anchor="middle" font-family="'Cinzel', 'Times New Roman', serif" font-weight="700" font-size="36" letter-spacing="9" fill="#FFFFFF">VANGUARD</text>
  </g>
  <g id="tagline">
    <text x="250" y="394" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="11" letter-spacing="5" fill="#10B981" opacity="0.9">PRIVATE WEALTH</text>
  </g>
</svg>`,
    symbolSvgOnly: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="vg-sym-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A7F3D0" />
      <stop offset="40%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#064E3B" />
    </linearGradient>
  </defs>
  <g transform="translate(100, 100) scale(0.65)">
    <polygon points="0,-95 67,-67 95,0 67,67 0,95 -67,67 -95,0 -67,-67" fill="none" stroke="#10B981" stroke-width="3" opacity="0.5" />
    <polygon points="0,-82 82,0 0,82 -82,0" fill="none" stroke="url(#vg-sym-gold)" stroke-width="4" />
    <path d="M -50 -45 L 0 55 L 50 -45 L 28 -45 L 0 15 L -28 -45 Z" fill="url(#vg-sym-gold)" />
    <path d="M 0 -70 L 15 -40 L -15 -40 Z" fill="#6EE7B7" />
    <line x1="0" y1="-35" x2="0" y2="0" stroke="#6EE7B7" stroke-width="5" stroke-linecap="round" />
  </g>
</svg>`,
  },
];

export const INSPIRATION_PROMPTS = [
  {
    title: '☕ Cafeteria & Torrefação',
    company: 'Grão & Alma',
    tagline: 'Cafés Especiais & Torrefação Artesanal',
    industry: 'Alimentação & Bebidas',
    style: 'Artisanal & Orgânico',
    description: 'Cafeteria contemporânea focada em grãos especiais de altitude, sustentabilidade e atmosfera acolhedora.',
    colorPreference: 'Tons quentes de âmbar, café e dourado (#D97706, #92400E, #FDE68A)',
  },
  {
    title: '⚡ Startup de IA & Quantum',
    company: 'Nexus Quantum',
    tagline: 'Inteligência Artificial de Próxima Geração',
    industry: 'Tecnologia / Deep Tech',
    style: 'Moderno & Futurista',
    description: 'Startup que desenvolve algoritmos neurais quânticos para aceleração de diagnósticos médicos.',
    colorPreference: 'Ciano neon, azul elétrico e magenta (#06B6D4, #6366F1, #EC4899)',
  },
  {
    title: '🌿 Cosméticos Botânicos',
    company: 'Aura Botânica',
    tagline: 'Pureza da Floresta em Gotas',
    industry: 'Beleza & Cuidados Pessoais',
    style: 'Minimalista & Clean',
    description: 'Marca de dermocosméticos 100% vegana, cruelty-free, com embalagens sustentáveis e design escandinavo.',
    colorPreference: 'Verde sálvia, matcha e toques de terracota (#10B981, #065F46, #FBBF24)',
  },
  {
    title: '💎 Gestão de Fortuna',
    company: 'Vanguard Capital',
    tagline: 'Preservação e Crescimento Patrimonial',
    industry: 'Finanças / Investimentos',
    style: 'Luxo & Editorial',
    description: 'Boutique de assessoria patrimonial e family office para famílias e investidores de alto padrão.',
    colorPreference: 'Verde esmeralda profundo, ouro champanhe e grafite escuro (#047857, #10B981, #FDE68A)',
  },
  {
    title: '🏃 Esportes & Performance',
    company: 'Veloce Dynamics',
    tagline: 'Velocidade sem Limites',
    industry: 'Moda Esportiva & Fitness',
    style: 'Dinâmico & Geométrico',
    description: 'Marca de roupas e tênis de alta performance para atletas de corrida e triatlo com tecidos inteligentes.',
    colorPreference: 'Laranja vibrante, preto carvão e prata refletivo (#F97316, #EA580C, #F3F4F6)',
  },
  {
    title: '🍕 Pizzaria Contemporânea',
    company: 'Forno di Pietra',
    tagline: 'Tradição Napolitana com Alma Urbana',
    industry: 'Gastronomia',
    style: 'Rústico Moderno / Badge',
    description: 'Pizzaria artesanal com fermentação lenta de 48 horas, forno a lenha clássico e ambiente descontraído.',
    colorPreference: 'Vermelho tomate italiano, manjericão e dourado trigo (#DC2626, #15803D, #F59E0B)',
  },
];
