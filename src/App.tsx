import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magenta-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-12">
        <header className="text-center space-y-2">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-500">
              Neon Rhythm
            </span>
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 0.5 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-mono uppercase tracking-[0.3em]"
          >
            Play the beat • Master the grid
          </motion.p>
        </header>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 w-full max-w-6xl">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-auto"
          >
            <SnakeGame />
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full lg:w-auto lg:sticky lg:top-8"
          >
            <MusicPlayer />
            
            <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">Instructions</h4>
              <ul className="text-sm space-y-2 text-white/60">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Use arrow keys to control the snake
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-magenta-400" />
                  Eat the pink orbs to grow and score
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  Listen to the synth beats while playing
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <footer className="mt-auto pt-12 text-xs font-mono text-white/20 uppercase tracking-widest">
          &copy; 2026 Neon Rhythm Studio • Built with AI
        </footer>
      </main>
    </div>
  );
}
