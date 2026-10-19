export interface LogoColors {
  primary: string;
  secondary: string;
  accent: string;
  backgroundDark: string;
  backgroundLight: string;
  textColor: string;
}

export type AnimationType = 'construct' | 'pulse' | 'spin' | 'neon' | 'bounce' | 'cinematic';

export interface LogoConcept {
  id: string;
  conceptName: string;
  rationale: string;
  brandName: string;
  tagline?: string;
  colors: LogoColors;
  fontFamily: string;
  recommendedAnimation: AnimationType;
  svgMarkup: string;
  symbolSvgOnly?: string;
  styleKeywords: string[];
}

export interface SocialExportPreset {
  id: string;
  name: string;
  platform: 'Instagram' | 'LinkedIn' | 'YouTube' | 'Twitter/X' | 'TikTok' | 'WhatsApp' | 'Facebook' | 'Favicon' | 'Master';
  category: 'profile' | 'feed' | 'story' | 'banner' | 'icon' | 'master';
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  recommendation?: string;
}

export type BackdropType = 'dark' | 'light' | 'gradient' | 'glass' | 'mesh' | 'transparent';
