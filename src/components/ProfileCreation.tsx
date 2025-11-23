'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { HeroAttributes, VisualStyle, TweenProfile } from '@/types';
import { useStore } from '@/store/useStore';
import { VISUAL_STYLES } from '@/lib/styles';

interface ProfileCreationProps {
  onComplete: () => void;
}

export function ProfileCreation({ onComplete }: ProfileCreationProps) {
  const { addProfile, setCurrentProfile } = useStore();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [attributes, setAttributes] = useState<HeroAttributes>({
    hairColor: '',
    hairStyle: '',
    eyeColor: '',
    skinTone: '',
    hasGlasses: false,
    age: 10,
  });
  const [preferredStyle, setPreferredStyle] = useState<VisualStyle>('anime');

  const handleComplete = () => {
    const newProfile: TweenProfile = {
      id: `profile-${Date.now()}`,
      name,
      heroAttributes: attributes,
      preferredStyle,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addProfile(newProfile);
    setCurrentProfile(newProfile);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onComplete}
            className="p-2 rounded-lg hover:bg-dark-elevated transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-dark-muted" />
          </button>
          <h1 className="text-3xl font-bold text-dark-text ml-4">
            Erstelle deinen Helden
          </h1>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                step >= s ? 'bg-glow-cyan' : 'bg-dark-border'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-dark-text font-semibold mb-2">
                Wie heißt du?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dein Name"
                className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-xl text-dark-text placeholder-dark-muted focus:border-glow-cyan focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-dark-text font-semibold mb-2">
                Wie alt bist du?
              </label>
              <input
                type="number"
                min={8}
                max={13}
                value={attributes.age}
                onChange={(e) => setAttributes({ ...attributes, age: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-xl text-dark-text focus:border-glow-cyan focus:outline-none transition-colors"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!name || attributes.age < 8 || attributes.age > 13}
              className="w-full py-4 bg-glow-cyan text-dark-bg font-bold rounded-xl hover:bg-glow-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Weiter
            </button>
          </motion.div>
        )}

        {/* Step 2: Appearance */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-dark-text font-semibold mb-2">
                  Haarfarbe
                </label>
                <input
                  type="text"
                  value={attributes.hairColor}
                  onChange={(e) => setAttributes({ ...attributes, hairColor: e.target.value })}
                  placeholder="z.B. braun"
                  className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-xl text-dark-text placeholder-dark-muted focus:border-glow-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-dark-text font-semibold mb-2">
                  Frisur
                </label>
                <input
                  type="text"
                  value={attributes.hairStyle}
                  onChange={(e) => setAttributes({ ...attributes, hairStyle: e.target.value })}
                  placeholder="z.B. kurz"
                  className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-xl text-dark-text placeholder-dark-muted focus:border-glow-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-dark-text font-semibold mb-2">
                  Augenfarbe
                </label>
                <input
                  type="text"
                  value={attributes.eyeColor}
                  onChange={(e) => setAttributes({ ...attributes, eyeColor: e.target.value })}
                  placeholder="z.B. blau"
                  className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-xl text-dark-text placeholder-dark-muted focus:border-glow-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-dark-text font-semibold mb-2">
                  Hautton
                </label>
                <input
                  type="text"
                  value={attributes.skinTone}
                  onChange={(e) => setAttributes({ ...attributes, skinTone: e.target.value })}
                  placeholder="z.B. hell"
                  className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-xl text-dark-text placeholder-dark-muted focus:border-glow-cyan focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attributes.hasGlasses}
                  onChange={(e) => setAttributes({ ...attributes, hasGlasses: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-dark-border bg-dark-surface checked:bg-glow-cyan"
                />
                <span className="text-dark-text font-semibold">Ich trage eine Brille</span>
              </label>
            </div>

            <div>
              <label className="block text-dark-text font-semibold mb-2">
                Lieblings-Accessoire (optional)
              </label>
              <input
                type="text"
                value={attributes.favoriteAccessory || ''}
                onChange={(e) => setAttributes({ ...attributes, favoriteAccessory: e.target.value })}
                placeholder="z.B. Hoodie, Cap, Kette"
                className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-border rounded-xl text-dark-text placeholder-dark-muted focus:border-glow-cyan focus:outline-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-dark-elevated text-dark-text font-bold rounded-xl hover:bg-dark-border transition-colors"
              >
                Zurück
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 bg-glow-cyan text-dark-bg font-bold rounded-xl hover:bg-glow-cyan/90 transition-all"
              >
                Weiter
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Style Selection */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-dark-text mb-2">
                Wähle deinen Style
              </h2>
              <p className="text-dark-muted">
                So werden deine Comics aussehen
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(VISUAL_STYLES) as VisualStyle[]).map((styleKey) => {
                const style = VISUAL_STYLES[styleKey];
                return (
                  <button
                    key={style.id}
                    onClick={() => setPreferredStyle(style.id)}
                    className={`
                      p-6 rounded-xl border-2 transition-all text-left
                      ${
                        preferredStyle === style.id
                          ? 'border-glow-purple bg-dark-elevated shadow-lg shadow-glow-purple/20'
                          : 'border-dark-border bg-dark-surface hover:border-dark-muted'
                      }
                    `}
                  >
                    <div className="text-4xl mb-3">{style.icon}</div>
                    <h3 className="text-lg font-bold text-dark-text mb-2">
                      {style.name}
                    </h3>
                    <p className="text-sm text-dark-muted">
                      {style.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 bg-dark-elevated text-dark-text font-bold rounded-xl hover:bg-dark-border transition-colors"
              >
                Zurück
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-4 bg-gradient-to-r from-glow-cyan to-glow-purple text-white font-bold rounded-xl hover:shadow-lg hover:shadow-glow-cyan/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Los geht's!
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
