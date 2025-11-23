import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TweenProfile, Comic, GenerationStatus } from '@/types';

interface StoreState {
  // Profile management
  profiles: TweenProfile[];
  currentProfile: TweenProfile | null;
  addProfile: (profile: TweenProfile) => void;
  updateProfile: (id: string, updates: Partial<TweenProfile>) => void;
  setCurrentProfile: (profile: TweenProfile | null) => void;

  // Comic management
  comics: Comic[];
  currentComic: Comic | null;
  addComic: (comic: Comic) => void;
  updateComic: (id: string, updates: Partial<Comic>) => void;
  setCurrentComic: (comic: Comic | null) => void;

  // Generation status
  generationStatus: GenerationStatus | null;
  setGenerationStatus: (status: GenerationStatus | null) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  profiles: [],
  currentProfile: null,
  comics: [],
  currentComic: null,
  generationStatus: null,
  isGenerating: false,
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      ...initialState,

      addProfile: (profile) =>
        set((state) => ({
          profiles: [...state.profiles, profile],
        })),

      updateProfile: (id, updates) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
          currentProfile:
            state.currentProfile?.id === id
              ? { ...state.currentProfile, ...updates, updatedAt: new Date() }
              : state.currentProfile,
        })),

      setCurrentProfile: (profile) =>
        set({ currentProfile: profile }),

      addComic: (comic) =>
        set((state) => ({
          comics: [comic, ...state.comics],
        })),

      updateComic: (id, updates) =>
        set((state) => ({
          comics: state.comics.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
          currentComic:
            state.currentComic?.id === id
              ? { ...state.currentComic, ...updates }
              : state.currentComic,
        })),

      setCurrentComic: (comic) =>
        set({ currentComic: comic }),

      setGenerationStatus: (status) =>
        set({ generationStatus: status }),

      setIsGenerating: (isGenerating) =>
        set({ isGenerating }),

      reset: () => set(initialState),
    }),
    {
      name: 'vibetales-storage',
      partialize: (state) => ({
        profiles: state.profiles,
        currentProfile: state.currentProfile,
        comics: state.comics,
      }),
    }
  )
);
