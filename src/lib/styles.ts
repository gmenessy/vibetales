import type { VisualStyle, VibeType } from '@/types';

export interface StyleDefinition {
  id: VisualStyle;
  name: string;
  description: string;
  promptKeywords: string[];
  icon: string; // emoji for now
  examples: string[];
}

export const VISUAL_STYLES: Record<VisualStyle, StyleDefinition> = {
  anime: {
    id: 'anime',
    name: 'Anime',
    description: 'Lebendige japanische Animation mit großen Augen und dynamischen Posen',
    promptKeywords: ['anime style', 'manga art', 'cel shaded', 'vibrant colors', 'expressive eyes'],
    icon: '🎌',
    examples: ['My Hero Academia', 'Demon Slayer'],
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristisch, neon-durchflutet, high-tech meets low-life',
    promptKeywords: ['cyberpunk', 'neon lights', 'futuristic', 'dystopian city', 'tech noir'],
    icon: '🌃',
    examples: ['Blade Runner', 'Cyberpunk 2077'],
  },
  'comic-noir': {
    id: 'comic-noir',
    name: 'Comic Noir',
    description: 'Dramatisch mit starken Kontrasten, düster und mysteriös',
    promptKeywords: ['comic noir', 'high contrast', 'dramatic shadows', 'black and white', 'detective style'],
    icon: '🎭',
    examples: ['Sin City', 'Batman'],
  },
  watercolor: {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Weich und künstlerisch mit fließenden Farben',
    promptKeywords: ['watercolor', 'soft edges', 'artistic', 'dreamy', 'painterly'],
    icon: '🎨',
    examples: ['Studio Ghibli backgrounds'],
  },
  'pixel-art': {
    id: 'pixel-art',
    name: 'Pixel Art',
    description: 'Retro 8-bit/16-bit Gaming-Ästhetik',
    promptKeywords: ['pixel art', '16-bit', 'retro gaming', 'isometric', 'pixelated'],
    icon: '🕹️',
    examples: ['Stardew Valley', 'Undertale'],
  },
  manga: {
    id: 'manga',
    name: 'Manga',
    description: 'Schwarz-weiß japanischer Comic-Stil mit Screentones',
    promptKeywords: ['manga style', 'black and white', 'screentones', 'dynamic panels', 'speed lines'],
    icon: '📖',
    examples: ['One Piece', 'Naruto'],
  },
};

export interface VibeDefinition {
  id: VibeType;
  name: string;
  color: string;
  promptModifiers: string[];
  emoji: string;
}

export const VIBE_DEFINITIONS: Record<VibeType, VibeDefinition> = {
  epic: {
    id: 'epic',
    name: 'Epic',
    color: '#ff6b35',
    promptModifiers: ['heroic', 'dramatic', 'powerful', 'triumphant', 'cinematic'],
    emoji: '⚡',
  },
  chill: {
    id: 'chill',
    name: 'Chill',
    color: '#4ecdc4',
    promptModifiers: ['relaxed', 'calm', 'peaceful', 'serene', 'laid-back'],
    emoji: '🌊',
  },
  mysterious: {
    id: 'mysterious',
    name: 'Mysterious',
    color: '#9b59b6',
    promptModifiers: ['mysterious', 'enigmatic', 'shadowy', 'intriguing', 'cryptic'],
    emoji: '🔮',
  },
  adventure: {
    id: 'adventure',
    name: 'Adventure',
    color: '#f39c12',
    promptModifiers: ['adventurous', 'exciting', 'dynamic', 'energetic', 'bold'],
    emoji: '🗺️',
  },
  funny: {
    id: 'funny',
    name: 'Funny',
    color: '#e74c3c',
    promptModifiers: ['humorous', 'playful', 'comedic', 'lighthearted', 'whimsical'],
    emoji: '😂',
  },
};

export function getStylePromptKeywords(style: VisualStyle): string[] {
  return VISUAL_STYLES[style].promptKeywords;
}

export function getVibePromptModifiers(vibe: VibeType): string[] {
  return VIBE_DEFINITIONS[vibe].promptModifiers;
}
