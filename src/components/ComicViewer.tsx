'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Download,
  Share2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import type { Comic, ComicPanel } from '@/types';
import { useStore } from '@/store/useStore';
import { aiService } from '@/lib/aiService';

interface ComicViewerProps {
  comic: Comic;
  onBack: () => void;
}

export function ComicViewer({ comic, onBack }: ComicViewerProps) {
  const { updateComic } = useStore();
  const [zoom, setZoom] = useState(1);
  const [remixingPanel, setRemixingPanel] = useState<number | null>(null);
  const [remixInstructions, setRemixInstructions] = useState('');
  const [showRemixDialog, setShowRemixDialog] = useState<number | null>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  const handleRemixPanel = async (panelIndex: number) => {
    const panel = comic.panels[panelIndex];
    setRemixingPanel(panelIndex);
    setShowRemixDialog(null);

    try {
      const remixedPanel = await aiService.remixPanel(panel, remixInstructions);

      const updatedPanels = [...comic.panels];
      updatedPanels[panelIndex] = remixedPanel;

      updateComic(comic.id, {
        panels: updatedPanels,
        isRemixed: true,
      });
    } catch (error) {
      console.error('Remix error:', error);
      alert('Remix fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setRemixingPanel(null);
      setRemixInstructions('');
    }
  };

  const handleDownload = () => {
    // In production: Generate PDF or image compilation
    alert('Download-Funktion wird implementiert!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: comic.title,
          text: 'Schau dir meinen VibeTales Comic an!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(window.location.href);
      alert('Link in Zwischenablage kopiert!');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-3 rounded-xl bg-dark-surface border-2 border-dark-border hover:border-dark-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-dark-text" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-dark-text flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-glow-gold" />
                {comic.title || 'Dein Comic'}
              </h1>
              {comic.isRemixed && (
                <p className="text-sm text-glow-purple mt-1">
                  ✨ Remixed Edition
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="p-3 rounded-xl bg-dark-surface border-2 border-dark-border hover:border-dark-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomOut className="w-5 h-5 text-dark-text" />
            </button>
            <span className="text-dark-text font-mono">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 2}
              className="p-3 rounded-xl bg-dark-surface border-2 border-dark-border hover:border-dark-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-5 h-5 text-dark-text" />
            </button>

            <div className="w-px h-8 bg-dark-border mx-2" />

            <button
              onClick={handleDownload}
              className="p-3 rounded-xl bg-dark-surface border-2 border-dark-border hover:border-glow-cyan hover:bg-dark-elevated transition-all"
            >
              <Download className="w-5 h-5 text-dark-text" />
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-glow-cyan to-glow-purple text-white font-semibold hover:shadow-lg hover:shadow-glow-cyan/30 transition-all flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Teilen
            </button>
          </div>
        </div>

        {/* Comic Panels */}
        <div className="space-y-8">
          {comic.panels.map((panel, index) => (
            <motion.div
              key={panel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              {/* Panel Container */}
              <div
                className="bg-dark-surface border-2 border-dark-border rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center top',
                  transition: 'transform 0.3s ease',
                }}
              >
                {/* Panel Image */}
                <div className="relative aspect-video">
                  <img
                    src={panel.imageUrl}
                    alt={`Panel ${panel.sequence}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Panel Number Badge */}
                  <div className="absolute top-4 left-4 bg-dark-bg/90 backdrop-blur-sm px-3 py-1 rounded-full border border-glow-cyan">
                    <span className="text-glow-cyan font-bold">
                      Panel {panel.sequence}
                    </span>
                  </div>

                  {/* Remixing Overlay */}
                  {remixingPanel === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm flex items-center justify-center"
                    >
                      <div className="text-center">
                        <RefreshCw className="w-12 h-12 text-glow-purple animate-spin mx-auto mb-4" />
                        <p className="text-dark-text font-semibold text-lg">
                          Remixing Panel...
                        </p>
                        <p className="text-dark-muted text-sm mt-2">
                          Die KI erstellt eine neue Version
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Hover Overlay with Remix Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-dark-bg/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 right-4">
                      <button
                        onClick={() => setShowRemixDialog(index)}
                        disabled={remixingPanel !== null}
                        className="px-4 py-2 rounded-xl bg-glow-purple hover:bg-glow-purple/90 text-white font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Remix Panel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Caption */}
                {panel.caption && (
                  <div className="p-6 bg-dark-elevated border-t-2 border-dark-border">
                    <p className="text-dark-text text-lg italic">
                      "{panel.caption}"
                    </p>
                  </div>
                )}
              </div>

              {/* Remix Dialog */}
              <AnimatePresence>
                {showRemixDialog === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-4 bg-dark-surface border-2 border-glow-purple rounded-xl p-6 shadow-2xl z-10"
                  >
                    <h3 className="text-lg font-bold text-dark-text mb-3">
                      Wie soll das Panel verändert werden?
                    </h3>
                    <textarea
                      value={remixInstructions}
                      onChange={(e) => setRemixInstructions(e.target.value)}
                      placeholder="Z.B. 'Mach es düsterer', 'Mehr Action', 'Andere Perspektive'..."
                      rows={3}
                      className="w-full bg-dark-bg border-2 border-dark-border rounded-xl p-3 text-dark-text placeholder-dark-muted focus:border-glow-purple focus:outline-none mb-4 resize-none"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowRemixDialog(null)}
                        className="flex-1 py-2 px-4 rounded-xl bg-dark-bg text-dark-text border-2 border-dark-border hover:border-dark-muted transition-colors"
                      >
                        Abbrechen
                      </button>
                      <button
                        onClick={() => handleRemixPanel(index)}
                        className="flex-1 py-2 px-4 rounded-xl bg-glow-purple text-white font-semibold hover:bg-glow-purple/90 transition-colors"
                      >
                        Remix starten
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Metadata Footer */}
        <div className="mt-12 p-6 bg-dark-surface border-2 border-dark-border rounded-2xl">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-dark-muted text-sm mb-1">Vibe</p>
              <p className="text-dark-text font-bold capitalize">
                {comic.storyInput.vibe}
              </p>
            </div>
            <div>
              <p className="text-dark-muted text-sm mb-1">Style</p>
              <p className="text-dark-text font-bold capitalize">
                {comic.storyInput.style}
              </p>
            </div>
            <div>
              <p className="text-dark-muted text-sm mb-1">Erstellt</p>
              <p className="text-dark-text font-bold">
                {new Date(comic.createdAt).toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
