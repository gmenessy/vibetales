'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Plus, Sparkles } from 'lucide-react';
import type { TweenProfile } from '@/types';
import { useStore } from '@/store/useStore';
import { ProfileCreation } from './ProfileCreation';

export function ProfileSelector() {
  const { profiles, currentProfile, setCurrentProfile } = useStore();
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectProfile = (profile: TweenProfile) => {
    setCurrentProfile(profile);
  };

  if (isCreating) {
    return <ProfileCreation onComplete={() => setIsCreating(false)} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 text-glow-cyan" />
          </motion.div>
          <h1 className="text-5xl font-bold text-dark-text mb-4">
            Willkommen bei <span className="text-glow-cyan">VibeTales</span>
          </h1>
          <p className="text-xl text-dark-muted">
            Wähle dein Helden-Profil oder erstelle ein neues
          </p>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {profiles.map((profile, index) => (
            <motion.button
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelectProfile(profile)}
              className={`
                p-6 rounded-2xl border-2 transition-all
                ${
                  currentProfile?.id === profile.id
                    ? 'border-glow-cyan bg-dark-elevated shadow-lg shadow-glow-cyan/20'
                    : 'border-dark-border bg-dark-surface hover:border-dark-muted'
                }
              `}
            >
              {profile.avatarPreviewUrl ? (
                <img
                  src={profile.avatarPreviewUrl}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
              ) : (
                <UserCircle className="w-24 h-24 mx-auto mb-4 text-dark-muted" />
              )}
              <h3 className="text-xl font-bold text-dark-text mb-2">
                {profile.name}
              </h3>
              <p className="text-sm text-dark-muted">
                {profile.heroAttributes.age} Jahre
              </p>
            </motion.button>
          ))}

          {/* Create New Profile Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: profiles.length * 0.1 }}
            onClick={() => setIsCreating(true)}
            className="
              p-6 rounded-2xl border-2 border-dashed border-dark-border
              bg-dark-surface hover:border-glow-purple hover:bg-dark-elevated
              transition-all group
            "
          >
            <Plus className="w-24 h-24 mx-auto mb-4 text-dark-muted group-hover:text-glow-purple transition-colors" />
            <h3 className="text-xl font-bold text-dark-text">
              Neuer Held
            </h3>
            <p className="text-sm text-dark-muted mt-2">
              Erstelle dein Profil
            </p>
          </motion.button>
        </div>

        {/* Continue Button */}
        {currentProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-dark-muted mb-4">
              Bereit, {currentProfile.name}?
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
