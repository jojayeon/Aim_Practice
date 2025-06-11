import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TargetItem from '../components/TargetItem';
import styles from '../styles/GamePage.module.css';

interface Target {
  id: string;
  x: number;
  y: number;
  createdAt: number;
}

const TOTAL_TARGETS = 100;

const difficultyParams = {
  easy: { spawnIntervalMs: 1500, lifetimeMs: 3000, targetSize: 24 },
  medium: { spawnIntervalMs: 1000, lifetimeMs: 2000, targetSize: 16 },
  hard: { spawnIntervalMs: 700, lifetimeMs: 1400, targetSize: 12 },
};

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const difficulty = (location.state?.difficulty as 'easy' | 'medium' | 'hard') || 'medium';

  const [targets, setTargets] = useState<Target[]>([]);
  const [hitCount, setHitCount] = useState(0);
  const spawnedCount = useRef(0);
  const playAreaRef = useRef<HTMLDivElement>(null);

  const { spawnIntervalMs, lifetimeMs, targetSize } = difficultyParams[difficulty];

  useEffect(() => {
    const interval = setInterval(() => {
      if (spawnedCount.current >= TOTAL_TARGETS) {
        clearInterval(interval);
        return;
      }
      const newTarget: Target = {
        id: crypto.randomUUID(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        createdAt: Date.now(),
      };
      setTargets((prev) => [...prev, newTarget]);
      spawnedCount.current += 1;
    }, spawnIntervalMs);

    return () => clearInterval(interval);
  }, [spawnIntervalMs]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTargets((prev) => prev.filter((t) => now - t.createdAt < lifetimeMs));
    }, 500);

    return () => clearInterval(cleanup);
  }, [lifetimeMs]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playAreaRef.current) return;
    const playArea = playAreaRef.current;
    const playAreaTop = playArea.offsetTop;
    const playAreaLeft = playArea.offsetLeft;
    const playAreaWidth = playArea.offsetWidth;
    const playAreaHeight = playArea.offsetHeight;

    for (const target of targets) {
      const targetX = (target.x / 100) * playAreaWidth + playAreaLeft;
      const targetY = (target.y / 100) * playAreaHeight + playAreaTop;

      const distance = Math.hypot(targetX - e.clientX, targetY - e.clientY);
 
      if (distance <= (targetSize/2)+0.2) {
        setHitCount((prev) => prev + 1);
        setTargets((prev) => prev.filter((t) => t.id !== target.id));
        break;
      }
    }
  };

  useEffect(() => {
    if (spawnedCount.current === TOTAL_TARGETS && targets.length === 0) {
      navigate('/result', { state: { score: hitCount } });
    }
  }, [targets, hitCount, navigate]);

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.info}>
        난이도: {difficulty.toUpperCase()} / 맞춘 타겟: {hitCount} / {TOTAL_TARGETS}
      </div>

      <div className={styles.playArea} ref={playAreaRef}>
        {targets.map((target) => (
          <TargetItem key={target.id} x={target.x} y={target.y} size={targetSize} />
        ))}
      </div>
    </div>
  );
};

export default GamePage;
