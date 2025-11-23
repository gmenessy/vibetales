// Core data models for VibeTales

export type VisualStyle =
  | 'anime'
  | 'cyberpunk'
  | 'comic-noir'
  | 'watercolor'
  | 'pixel-art'
  | 'manga';

export type VibeType =
  | 'epic'
  | 'chill'
  | 'mysterious'
  | 'adventure'
  | 'funny';

export interface HeroAttributes {
  hairColor: string;
  hairStyle: string;
  eyeColor: string;
  skinTone: string;
  hasGlasses: boolean;
  favoriteAccessory?: string;
  age: number;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

export interface TweenProfile {
  id: string;
  name: string;
  heroAttributes: HeroAttributes;
  preferredStyle: VisualStyle;
  createdAt: Date;
  updatedAt: Date;
  avatarPreviewUrl?: string;
}

export interface StorySpark {
  id: string;
  question: string;
  category: 'daily' | 'emotion' | 'creative' | 'reflection';
  ageRange: [number, number]; // [min, max]
}

export interface StoryInput {
  profileId: string;
  storyText: string;
  vibe: VibeType;
  style: VisualStyle;
  directorNotes?: string; // Optional power-user meta-instructions
  sparkUsed?: string; // ID of the Story Spark that inspired this
}

export interface ComicPanel {
  id: string;
  imageUrl: string;
  caption: string;
  sequence: number;
  generationMetadata?: {
    prompt: string;
    seed?: number;
    model: string;
  };
}

export interface Comic {
  id: string;
  profileId: string;
  title: string;
  panels: ComicPanel[];
  storyInput: StoryInput;
  createdAt: Date;
  isRemixed: boolean; // Track if any panels were regenerated
}

export interface GenerationStatus {
  phase: 'initializing' | 'processing-text' | 'generating-panels' | 'finalizing' | 'complete' | 'error';
  message: string;
  progress: number; // 0-100
  currentPanel?: number;
  totalPanels?: number;
}

export interface AppState {
  currentProfile: TweenProfile | null;
  profiles: TweenProfile[];
  currentComic: Comic | null;
  generationStatus: GenerationStatus | null;
  isGenerating: boolean;
}
