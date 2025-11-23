'use client';

import { motion } from 'framer-motion';
import { Cpu, Zap, Image, CheckCircle, AlertCircle } from 'lucide-react';
import type { GenerationStatus } from '@/types';

interface TechLoaderProps {
  status: GenerationStatus;
}

export function TechLoader({ status }: TechLoaderProps) {
  const getPhaseIcon = () => {
    switch (status.phase) {
      case 'initializing':
        return <Cpu className="w-8 h-8" />;
      case 'processing-text':
        return <Zap className="w-8 h-8" />;
      case 'generating-panels':
        return <Image className="w-8 h-8" />;
      case 'finalizing':
        return <CheckCircle className="w-8 h-8" />;
      case 'complete':
        return <CheckCircle className="w-8 h-8" />;
      case 'error':
        return <AlertCircle className="w-8 h-8" />;
      default:
        return <Cpu className="w-8 h-8" />;
    }
  };

  const getPhaseColor = () => {
    switch (status.phase) {
      case 'initializing':
        return 'text-glow-cyan';
      case 'processing-text':
        return 'text-glow-purple';
      case 'generating-panels':
        return 'text-glow-gold';
      case 'finalizing':
        return 'text-green-500';
      case 'complete':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-glow-cyan';
    }
  };

  const techMessages = [
    '// Initializing neural networks...',
    '// Loading style models...',
    '// Parsing story semantics...',
    '// Optimizing prompt embeddings...',
    '// Generating latent representations...',
    '// Rendering pixel matrices...',
    '// Applying style transfer...',
    '// Finalizing output pipeline...',
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Main Status Card */}
        <div className="bg-dark-surface border-2 border-dark-border rounded-2xl p-8 mb-6">
          {/* Icon */}
          <motion.div
            animate={{
              rotate: status.phase !== 'complete' && status.phase !== 'error' ? 360 : 0,
            }}
            transition={{
              duration: 2,
              repeat: status.phase !== 'complete' && status.phase !== 'error' ? Infinity : 0,
              ease: 'linear',
            }}
            className={`${getPhaseColor()} mb-6 flex justify-center`}
          >
            {getPhaseIcon()}
          </motion.div>

          {/* Phase Message */}
          <h2 className="text-2xl font-bold text-dark-text text-center mb-2">
            {status.message}
          </h2>

          {/* Panel Progress */}
          {status.phase === 'generating-panels' && status.currentPanel && status.totalPanels && (
            <p className="text-center text-dark-muted mb-6">
              Panel {status.currentPanel} von {status.totalPanels}
            </p>
          )}

          {/* Progress Bar */}
          <div className="relative h-3 bg-dark-bg rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${status.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`
                h-full rounded-full
                ${
                  status.phase === 'error'
                    ? 'bg-red-500'
                    : status.phase === 'complete'
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-glow-cyan via-glow-purple to-glow-gold'
                }
              `}
            >
              {status.phase !== 'complete' && status.phase !== 'error' && (
                <motion.div
                  animate={{ x: ['0%', '100%'] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              )}
            </motion.div>
          </div>

          {/* Progress Percentage */}
          <p className="text-center text-dark-muted font-mono text-sm">
            {Math.round(status.progress)}% Complete
          </p>
        </div>

        {/* Tech Console */}
        <div className="bg-dark-bg border-2 border-dark-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-dark-muted text-sm font-mono">
              system/generation.log
            </span>
          </div>

          <div className="space-y-2 font-mono text-sm">
            {techMessages.slice(0, Math.floor((status.progress / 100) * techMessages.length) + 1).map(
              (msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-green-400"
                >
                  <span className="text-dark-muted mr-2">
                    [{new Date().toLocaleTimeString('de-DE')}]
                  </span>
                  {msg}
                </motion.div>
              )
            )}

            {status.phase !== 'complete' && status.phase !== 'error' && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-glow-cyan"
              >
                <span className="text-dark-muted mr-2">
                  [{new Date().toLocaleTimeString('de-DE')}]
                </span>
                // Processing...
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  _
                </motion.span>
              </motion.div>
            )}

            {status.phase === 'complete' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 font-bold"
              >
                <span className="text-dark-muted mr-2">
                  [{new Date().toLocaleTimeString('de-DE')}]
                </span>
                // ✓ Generation complete! Comic ready.
              </motion.div>
            )}

            {status.phase === 'error' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 font-bold"
              >
                <span className="text-dark-muted mr-2">
                  [{new Date().toLocaleTimeString('de-DE')}]
                </span>
                // ✗ Error occurred. Please retry.
              </motion.div>
            )}
          </div>
        </div>

        {/* Fun Facts */}
        {status.phase !== 'complete' && status.phase !== 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-dark-muted text-sm italic">
              💡 Wusstest du? Dein Comic wird von hochmodernen KI-Modellen erstellt,
              die Millionen von Bildern analysiert haben.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
