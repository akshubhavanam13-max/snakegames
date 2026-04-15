import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(p => p.x === newFood.x && p.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };
        setDirection(nextDirection);

        switch (nextDirection) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [isPaused, isGameOver, food, nextDirection, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snake.forEach((p, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#00ffff' : 'rgba(0, 255, 255, 0.6)';
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#00ffff';
      
      // Rounded snake segments
      const x = p.x * cellSize + 2;
      const y = p.y * cellSize + 2;
      const size = cellSize - 4;
      
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 4);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/20 shadow-[0_0_50px_rgba(0,255,255,0.1)]">
      <div className="flex justify-between w-full items-center px-2">
        <div className="flex items-center gap-4">
          <Trophy className="w-8 h-8 text-cyan-400" />
          <span className="font-mono text-5xl font-black text-cyan-400 tracking-tighter glitch-text">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-full hover:bg-cyan-500/10 transition-colors text-cyan-400"
          >
            {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          </button>
          <button
            onClick={resetGame}
            className="p-2 rounded-full hover:bg-cyan-500/10 transition-colors text-cyan-400"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-xl border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.15)] group-hover:border-cyan-500/50 transition-colors"
        />
        
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl"
            >
              <div className="text-center">
                <h2 className="text-4xl font-black text-cyan-400 mb-4 tracking-tighter uppercase">
                  {isGameOver ? 'Game Over' : 'Paused'}
                </h2>
                <button
                  onClick={isGameOver ? resetGame : () => setIsPaused(false)}
                  className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                >
                  {isGameOver ? 'Try Again' : 'Resume'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4 text-xs font-mono text-cyan-500/50 uppercase tracking-widest">
        <span>Arrows to move</span>
        <span>•</span>
        <span>Space to pause</span>
      </div>
    </div>
  );
};
