import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Synth',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/400/400',
  },
  {
    id: '2',
    title: 'Cyber Drift',
    artist: 'Neural Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/400/400',
  },
  {
    id: '3',
    title: 'Midnight Grid',
    artist: 'Digital Echo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/400/400',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl rounded-3xl border border-magenta-500/20 p-6 shadow-[0_0_50px_rgba(255,0,255,0.05)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-6 mb-8">
        <motion.div
          key={currentTrack.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-24 h-24 flex-shrink-0"
        >
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded-2xl border border-magenta-500/30 shadow-[0_0_20px_rgba(255,0,255,0.2)]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>

        <div className="flex-grow overflow-hidden">
          <motion.h3
            key={currentTrack.title}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-bold text-white truncate tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p
            key={currentTrack.artist}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 0.6 }}
            className="text-sm text-magenta-400 font-medium"
          >
            {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-magenta-500 shadow-[0_0_10px_rgba(255,0,255,0.8)]"
            style={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
        </div>

        <div className="flex items-center justify-center gap-8">
          <button
            onClick={handlePrev}
            className="p-2 text-white/60 hover:text-magenta-400 transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 flex items-center justify-center bg-magenta-500 text-black rounded-full hover:bg-magenta-400 transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(255,0,255,0.4)]"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 text-white/60 hover:text-magenta-400 transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-white/40">
            <Volume2 className="w-4 h-4" />
            <div className="w-16 h-1 bg-white/10 rounded-full">
              <div className="w-2/3 h-full bg-white/20 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-magenta-500/60 uppercase tracking-widest">
            <Music className="w-3 h-3" />
            <span>Track {currentTrackIndex + 1} / {DUMMY_TRACKS.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
