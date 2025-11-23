'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Sparkles,
  Settings,
  Zap,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { VibeType, VisualStyle, StoryInput } from '@/types';
import { useStore } from '@/store/useStore';
import { getRandomSpark } from '@/lib/storySparks';
import { VISUAL_STYLES, VIBE_DEFINITIONS } from '@/lib/styles';
import { aiService } from '@/lib/aiService';

interface StoryInputModuleProps {
  onSubmit: (input: StoryInput) => void;
}

export function StoryInputModule({ onSubmit }: StoryInputModuleProps) {
  const { currentProfile } = useStore();
  const [storyText, setStoryText] = useState('');
  const [vibe, setVibe] = useState<VibeType>('epic');
  const [style, setStyle] = useState<VisualStyle>(
    currentProfile?.preferredStyle || 'anime'
  );
  const [directorNotes, setDirectorNotes] = useState('');
  const [showDirectorNotes, setShowDirectorNotes] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSpark, setCurrentSpark] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStorySpark = () => {
    const spark = getRandomSpark(currentProfile?.heroAttributes.age);
    setCurrentSpark(spark.question);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsTranscribing(true);

        try {
          const transcription = await aiService.transcribeSpeech(audioBlob);
          setStoryText((prev) => (prev ? `${prev} ${transcription}` : transcription));
        } catch (error) {
          console.error('Transcription error:', error);
        } finally {
          setIsTranscribing(false);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Mikrofon-Zugriff fehlgeschlagen. Bitte überprüfe die Berechtigungen.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (!currentProfile || !storyText.trim()) return;

    const input: StoryInput = {
      profileId: currentProfile.id,
      storyText: storyText.trim(),
      vibe,
      style,
      directorNotes: directorNotes.trim() || undefined,
      sparkUsed: currentSpark || undefined,
    };

    onSubmit(input);
  };

  const canSubmit = storyText.trim().length > 10 && currentProfile;

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-dark-text mb-2">
            Erzähl deine Story, <span className="text-glow-cyan">{currentProfile?.name}</span>
          </h1>
          <p className="text-dark-muted">
            Verwandle deinen Tag in ein episches Comic-Abenteuer
          </p>
        </div>

        {/* Story Spark */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <AnimatePresence mode="wait">
            {currentSpark ? (
              <motion.div
                key="spark-active"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-gradient-to-r from-vibe-epic/20 to-vibe-mysterious/20 border-2 border-vibe-epic/50 rounded-xl p-6 mb-4"
              >
                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-vibe-epic flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-dark-text mb-2">
                      Story Spark
                    </h3>
                    <p className="text-dark-text text-lg">{currentSpark}</p>
                  </div>
                  <button
                    onClick={() => setCurrentSpark(null)}
                    className="text-dark-muted hover:text-dark-text transition-colors"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="spark-button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleStorySpark}
                className="w-full bg-dark-surface border-2 border-dark-border rounded-xl p-6 hover:border-vibe-epic hover:bg-dark-elevated transition-all group"
              >
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="w-6 h-6 text-dark-muted group-hover:text-vibe-epic transition-colors" />
                  <span className="text-lg font-semibold text-dark-text">
                    Brauchst du Inspiration? Klick für einen Story Spark!
                  </span>
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Main Input Area */}
        <div className="bg-dark-surface border-2 border-dark-border rounded-2xl p-6 mb-6">
          {/* Voice Recording */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isTranscribing}
              className={`
                p-4 rounded-full transition-all
                ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-glow-cyan hover:bg-glow-cyan/90'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isRecording ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-dark-bg" />
              )}
            </button>
            <div className="flex-1">
              {isTranscribing ? (
                <p className="text-dark-muted animate-pulse">
                  Transkribiere deine Aufnahme...
                </p>
              ) : isRecording ? (
                <p className="text-red-500 font-semibold">
                  🔴 Aufnahme läuft... Klick nochmal zum Stoppen
                </p>
              ) : (
                <p className="text-dark-muted">
                  Halte die Mikrofon-Taste gedrückt oder klicke zum Aufnehmen
                </p>
              )}
            </div>
          </div>

          {/* Text Input */}
          <textarea
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            placeholder="Oder schreib deine Geschichte hier... Was ist heute passiert?"
            rows={8}
            className="w-full bg-dark-bg border-2 border-dark-border rounded-xl p-4 text-dark-text placeholder-dark-muted focus:border-glow-cyan focus:outline-none resize-none transition-colors"
          />

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-dark-muted">
              {storyText.length} Zeichen
            </p>
            {storyText.length > 0 && storyText.length < 10 && (
              <p className="text-sm text-vibe-funny">
                Erzähl uns ein bisschen mehr!
              </p>
            )}
          </div>
        </div>

        {/* Vibe Selector */}
        <div className="bg-dark-surface border-2 border-dark-border rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-glow-gold" />
            <h3 className="text-lg font-bold text-dark-text">
              Wähle deinen Vibe
            </h3>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {(Object.keys(VIBE_DEFINITIONS) as VibeType[]).map((vibeKey) => {
              const vibeDef = VIBE_DEFINITIONS[vibeKey];
              const isSelected = vibe === vibeKey;

              return (
                <button
                  key={vibeKey}
                  onClick={() => setVibe(vibeKey)}
                  className={`
                    p-4 rounded-xl border-2 transition-all
                    ${
                      isSelected
                        ? 'border-current bg-dark-elevated shadow-lg'
                        : 'border-dark-border bg-dark-bg hover:border-dark-muted'
                    }
                  `}
                  style={{
                    borderColor: isSelected ? vibeDef.color : undefined,
                    boxShadow: isSelected ? `0 0 20px ${vibeDef.color}40` : undefined,
                  }}
                >
                  <div className="text-3xl mb-2">{vibeDef.emoji}</div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: isSelected ? vibeDef.color : undefined }}
                  >
                    {vibeDef.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Style Selector */}
        <div className="bg-dark-surface border-2 border-dark-border rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-dark-text mb-4">
            Comic-Style
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {(Object.keys(VISUAL_STYLES) as VisualStyle[]).map((styleKey) => {
              const styleDef = VISUAL_STYLES[styleKey];
              const isSelected = style === styleKey;

              return (
                <button
                  key={styleKey}
                  onClick={() => setStyle(styleKey)}
                  className={`
                    p-4 rounded-xl border-2 transition-all text-left
                    ${
                      isSelected
                        ? 'border-glow-purple bg-dark-elevated shadow-lg shadow-glow-purple/20'
                        : 'border-dark-border bg-dark-bg hover:border-dark-muted'
                    }
                  `}
                >
                  <div className="text-2xl mb-2">{styleDef.icon}</div>
                  <div className="text-sm font-bold text-dark-text">
                    {styleDef.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Director Notes (Advanced) */}
        <div className="bg-dark-surface border-2 border-dark-border rounded-2xl p-6 mb-6">
          <button
            onClick={() => setShowDirectorNotes(!showDirectorNotes)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-glow-purple" />
              <h3 className="text-lg font-bold text-dark-text">
                Regieanweisungen (Experten-Modus)
              </h3>
            </div>
            {showDirectorNotes ? (
              <ChevronUp className="w-5 h-5 text-dark-muted" />
            ) : (
              <ChevronDown className="w-5 h-5 text-dark-muted" />
            )}
          </button>

          <AnimatePresence>
            {showDirectorNotes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-dark-muted mt-4 mb-3">
                  Hier kannst du der KI direkte Anweisungen geben, wie dein Comic aussehen soll.
                  Z.B. "Mach den Hintergrund düsterer" oder "Mehr Action!"
                </p>
                <textarea
                  value={directorNotes}
                  onChange={(e) => setDirectorNotes(e.target.value)}
                  placeholder="Deine Anweisungen an die KI..."
                  rows={3}
                  className="w-full bg-dark-bg border-2 border-dark-border rounded-xl p-4 text-dark-text placeholder-dark-muted focus:border-glow-purple focus:outline-none resize-none transition-colors"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={!canSubmit}
          whileHover={canSubmit ? { scale: 1.02 } : {}}
          whileTap={canSubmit ? { scale: 0.98 } : {}}
          className={`
            w-full py-6 rounded-2xl font-bold text-lg transition-all
            flex items-center justify-center gap-3
            ${
              canSubmit
                ? 'bg-gradient-to-r from-glow-cyan to-glow-purple text-white hover:shadow-2xl hover:shadow-glow-cyan/50'
                : 'bg-dark-border text-dark-muted cursor-not-allowed'
            }
          `}
        >
          <Send className="w-6 h-6" />
          Comic generieren
        </motion.button>
      </motion.div>
    </div>
  );
}
