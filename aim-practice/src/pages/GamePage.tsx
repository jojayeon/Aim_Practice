import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TargetItem from '../components/TargetItem';
import styles from '../styles/GamePage.module.css';

interface Target {
  id: string;
  x: number;
  y: number;
  createdAt: number;
}

const TOTAL_TARGETS = 100;

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [targets, setTargets] = useState<Target[]>([]);
  const [hitCount, setHitCount] = useState(0);

  const spawnedCount = useRef(0);
  const spawnIntervalMs = 1000;     // UI에서는 제거 (하드코딩)
  const lifetimeMs = 3000;          // UI에서는 제거 (하드코딩)

  // 타겟 생성
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
  }, []);

  // 일정 시간 뒤 타겟 제거
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTargets((prev) => prev.filter(t => now - t.createdAt < lifetimeMs));
    }, 500);

    return () => clearInterval(cleanup);
  }, []);

  // 클릭 처리
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    for (const target of targets) {
      const targetX = (target.x / 100) * screenW;
      const targetY = (target.y / 100) * screenH;
      const distance = Math.hypot(targetX - e.clientX, targetY - e.clientY);

      if (distance <= 30) {
        setHitCount((prev) => prev + 1);
        setTargets((prev) => prev.filter(t => t.id !== target.id));
        break;
      }
    }
  };

  // 종료 조건 감지
  useEffect(() => {
    if (spawnedCount.current === TOTAL_TARGETS && targets.length === 0) {
      navigate('/result', { state: { score: hitCount } });
    }
  }, [targets, hitCount, navigate]);

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.info}>
        맞춘 타겟: {hitCount} / {TOTAL_TARGETS}
      </div>

      <div className={styles.playArea}>
        {targets.map(target => (
          <TargetItem key={target.id} x={target.x} y={target.y} />
        ))}
      </div>
    </div>
  );
};

export default GamePage;
