import type { StoryInput, HeroAttributes, ComicPanel, GenerationStatus } from '@/types';
import { buildComicPrompts, buildAvatarPreviewPrompt } from './promptBuilder';

export type StatusCallback = (status: GenerationStatus) => void;

// Mock service for development - replace with real API integration
export class AIService {
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
  }

  /**
   * Generate comic panels from story input
   * In production, this would call:
   * - OpenAI DALL-E, Midjourney, Stable Diffusion, or similar for image generation
   * - OpenAI Whisper or Google Speech-to-Text for voice input
   */
  async generateComic(
    storyInput: StoryInput,
    heroAttributes: HeroAttributes,
    heroName: string,
    onStatusUpdate: StatusCallback
  ): Promise<ComicPanel[]> {
    // Build prompts
    onStatusUpdate({
      phase: 'initializing',
      message: 'Initialisiere KI-Pipeline...',
      progress: 5,
    });

    await this.delay(800);

    onStatusUpdate({
      phase: 'processing-text',
      message: 'Analysiere deine Geschichte...',
      progress: 15,
    });

    const prompts = buildComicPrompts(storyInput, heroAttributes, heroName);

    await this.delay(1000);

    onStatusUpdate({
      phase: 'generating-panels',
      message: 'Generiere Comic-Panels...',
      progress: 25,
      totalPanels: prompts.length,
      currentPanel: 0,
    });

    // Generate each panel
    const panels: ComicPanel[] = [];

    for (let i = 0; i < prompts.length; i++) {
      onStatusUpdate({
        phase: 'generating-panels',
        message: `Generiere Panel ${i + 1}/${prompts.length}...`,
        progress: 25 + (60 / prompts.length) * i,
        currentPanel: i + 1,
        totalPanels: prompts.length,
      });

      // In production: Call image generation API here
      const panel = await this.generatePanel(prompts[i].prompt, prompts[i].negativePrompt, i);
      panels.push(panel);

      await this.delay(1500);
    }

    onStatusUpdate({
      phase: 'finalizing',
      message: 'Finalisiere deinen Comic...',
      progress: 95,
    });

    await this.delay(500);

    onStatusUpdate({
      phase: 'complete',
      message: 'Comic erfolgreich erstellt!',
      progress: 100,
    });

    return panels;
  }

  /**
   * Generate a single panel (or regenerate)
   */
  async generatePanel(prompt: string, negativePrompt: string, sequence: number): Promise<ComicPanel> {
    // Mock implementation - replace with real API call
    // Example: const response = await openai.images.generate({ prompt, model: "dall-e-3" });

    return {
      id: `panel-${Date.now()}-${sequence}`,
      imageUrl: this.getMockImageUrl(sequence),
      caption: this.extractCaptionFromPrompt(prompt),
      sequence,
      generationMetadata: {
        prompt,
        model: 'mock-model-v1',
        seed: Math.floor(Math.random() * 1000000),
      },
    };
  }

  /**
   * Regenerate a specific panel (Remix feature)
   */
  async remixPanel(
    originalPanel: ComicPanel,
    variations?: string
  ): Promise<ComicPanel> {
    const modifiedPrompt = variations
      ? `${originalPanel.generationMetadata?.prompt}, ${variations}`
      : originalPanel.generationMetadata?.prompt || '';

    // Slightly modify the seed for variation
    const newSeed = (originalPanel.generationMetadata?.seed || 0) + 1;

    await this.delay(2000);

    return {
      ...originalPanel,
      id: `panel-${Date.now()}-remix`,
      imageUrl: this.getMockImageUrl(originalPanel.sequence, true),
      generationMetadata: {
        ...originalPanel.generationMetadata!,
        prompt: modifiedPrompt,
        seed: newSeed,
      },
    };
  }

  /**
   * Generate avatar preview for style selection
   */
  async generateAvatarPreview(
    heroAttributes: HeroAttributes,
    style: string,
    heroName: string
  ): Promise<string> {
    const prompt = buildAvatarPreviewPrompt(heroAttributes, style as any, heroName);

    await this.delay(1500);

    // Mock implementation
    return this.getMockAvatarUrl(style);
  }

  /**
   * Transcribe speech to text (for voice input)
   * In production: Use OpenAI Whisper, Google Cloud Speech-to-Text, etc.
   */
  async transcribeSpeech(audioBlob: Blob): Promise<string> {
    // Mock implementation
    await this.delay(1000);
    return "Dies ist eine Test-Transkription. In der Produktion würde hier die echte Spracherkennung greifen.";
  }

  // Helper methods for mock data
  private getMockImageUrl(sequence: number, isRemix: boolean = false): string {
    // Use placeholder service
    const seed = isRemix ? `remix-${sequence}` : `panel-${sequence}`;
    return `https://picsum.photos/seed/${seed}/800/600`;
  }

  private getMockAvatarUrl(style: string): string {
    return `https://picsum.photos/seed/${style}-avatar/400/400`;
  }

  private extractCaptionFromPrompt(prompt: string): string {
    // Extract a reasonable caption from the prompt
    // In production, this could be generated by an LLM
    const parts = prompt.split(',');
    return parts[1]?.trim() || parts[0]?.trim() || '';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const aiService = new AIService();

// Configuration helpers
export function setApiKey(key: string) {
  // In production: Store securely, validate, etc.
  localStorage.setItem('vibetales-api-key', key);
}

export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vibetales-api-key');
}
