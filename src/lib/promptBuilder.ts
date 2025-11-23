import type { HeroAttributes, StoryInput, VisualStyle, VibeType } from '@/types';
import { getStylePromptKeywords, getVibePromptModifiers } from './styles';

export interface ComicPrompt {
  panelNumber: number;
  prompt: string;
  negativePrompt: string;
}

export function buildHeroDescription(attributes: HeroAttributes): string {
  const parts: string[] = [];

  // Age and gender
  if (attributes.age) {
    parts.push(`${attributes.age} year old`);
  }
  if (attributes.gender && attributes.gender !== 'prefer-not-to-say') {
    parts.push(attributes.gender === 'other' ? 'person' : attributes.gender);
  }

  // Physical attributes
  if (attributes.hairColor && attributes.hairStyle) {
    parts.push(`with ${attributes.hairStyle} ${attributes.hairColor} hair`);
  } else if (attributes.hairColor) {
    parts.push(`with ${attributes.hairColor} hair`);
  }

  if (attributes.eyeColor) {
    parts.push(`${attributes.eyeColor} eyes`);
  }

  if (attributes.skinTone) {
    parts.push(`${attributes.skinTone} skin tone`);
  }

  if (attributes.hasGlasses) {
    parts.push('wearing glasses');
  }

  if (attributes.favoriteAccessory) {
    parts.push(`with ${attributes.favoriteAccessory}`);
  }

  return parts.join(', ');
}

export function splitStoryIntoScenes(storyText: string, targetPanels: number = 4): string[] {
  // Simple scene splitting - in production, use NLP or LLM for better splitting
  const sentences = storyText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (sentences.length <= targetPanels) {
    return sentences;
  }

  // Group sentences to match target panel count
  const panelsPerScene = Math.ceil(sentences.length / targetPanels);
  const scenes: string[] = [];

  for (let i = 0; i < sentences.length; i += panelsPerScene) {
    const sceneGroup = sentences.slice(i, i + panelsPerScene);
    scenes.push(sceneGroup.join('. ') + '.');
  }

  return scenes.slice(0, targetPanels);
}

export function buildComicPrompts(
  storyInput: StoryInput,
  heroAttributes: HeroAttributes,
  heroName: string
): ComicPrompt[] {
  const scenes = splitStoryIntoScenes(storyInput.storyText);
  const heroDescription = buildHeroDescription(heroAttributes);
  const styleKeywords = getStylePromptKeywords(storyInput.style);
  const vibeModifiers = getVibePromptModifiers(storyInput.vibe);

  const baseStylePrompt = styleKeywords.join(', ');
  const baseVibePrompt = vibeModifiers.join(', ');

  const prompts: ComicPrompt[] = scenes.map((scene, index) => {
    // Build the mega-prompt
    const promptParts = [
      // Style foundation
      baseStylePrompt,

      // Scene description
      scene,

      // Hero description (consistent across all panels)
      `featuring ${heroName}, a ${heroDescription}`,

      // Vibe modifiers
      baseVibePrompt,

      // Director notes if provided (power user feature)
      storyInput.directorNotes || '',

      // Quality modifiers
      'detailed illustration, comic book panel, professional artwork, high quality',

      // Panel-specific context
      `panel ${index + 1} of ${scenes.length}`,
    ]
      .filter(Boolean)
      .join(', ');

    // Negative prompt for safety and quality
    const negativePrompt = [
      'nsfw',
      'nude',
      'explicit',
      'gore',
      'violence',
      'inappropriate',
      'low quality',
      'blurry',
      'distorted',
      'ugly',
      'bad anatomy',
      'text',
      'watermark',
    ].join(', ');

    return {
      panelNumber: index + 1,
      prompt: promptParts,
      negativePrompt,
    };
  });

  return prompts;
}

export function buildAvatarPreviewPrompt(
  heroAttributes: HeroAttributes,
  style: VisualStyle,
  heroName: string
): string {
  const heroDescription = buildHeroDescription(heroAttributes);
  const styleKeywords = getStylePromptKeywords(style);

  return [
    styleKeywords.join(', '),
    `portrait of ${heroName}`,
    heroDescription,
    'character portrait, centered, front facing',
    'detailed illustration, professional artwork, high quality',
  ].join(', ');
}
