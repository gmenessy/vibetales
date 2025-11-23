'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { ProfileSelector } from '@/components/ProfileSelector';
import { StoryInputModule } from '@/components/StoryInputModule';
import { TechLoader } from '@/components/TechLoader';
import { ComicViewer } from '@/components/ComicViewer';
import { aiService } from '@/lib/aiService';
import type { StoryInput, Comic } from '@/types';

type AppScreen = 'profile-select' | 'story-input' | 'generating' | 'comic-view';

export default function Home() {
  const {
    currentProfile,
    generationStatus,
    setGenerationStatus,
    isGenerating,
    setIsGenerating,
    currentComic,
    setCurrentComic,
    addComic,
  } = useStore();

  const [screen, setScreen] = useState<AppScreen>('profile-select');

  // Update screen based on state
  useEffect(() => {
    if (!currentProfile) {
      setScreen('profile-select');
    } else if (isGenerating) {
      setScreen('generating');
    } else if (currentComic) {
      setScreen('comic-view');
    } else {
      setScreen('story-input');
    }
  }, [currentProfile, isGenerating, currentComic]);

  const handleStorySubmit = async (input: StoryInput) => {
    if (!currentProfile) return;

    setIsGenerating(true);
    setCurrentComic(null);

    try {
      const panels = await aiService.generateComic(
        input,
        currentProfile.heroAttributes,
        currentProfile.name,
        (status) => {
          setGenerationStatus(status);
        }
      );

      const newComic: Comic = {
        id: `comic-${Date.now()}`,
        profileId: currentProfile.id,
        title: `${currentProfile.name}'s Abenteuer`,
        panels,
        storyInput: input,
        createdAt: new Date(),
        isRemixed: false,
      };

      addComic(newComic);
      setCurrentComic(newComic);
    } catch (error) {
      console.error('Comic generation error:', error);
      setGenerationStatus({
        phase: 'error',
        message: 'Ein Fehler ist aufgetreten',
        progress: 0,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToInput = () => {
    setCurrentComic(null);
    setGenerationStatus(null);
  };

  return (
    <main className="min-h-screen bg-dark-bg">
      <AnimatePresence mode="wait">
        {screen === 'profile-select' && (
          <ProfileSelector key="profile-select" />
        )}

        {screen === 'story-input' && (
          <StoryInputModule
            key="story-input"
            onSubmit={handleStorySubmit}
          />
        )}

        {screen === 'generating' && generationStatus && (
          <TechLoader key="generating" status={generationStatus} />
        )}

        {screen === 'comic-view' && currentComic && (
          <ComicViewer
            key="comic-view"
            comic={currentComic}
            onBack={handleBackToInput}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
