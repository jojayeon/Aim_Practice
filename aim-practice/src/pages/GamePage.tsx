// src/pages/GamePage.tsx
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
const SENSITIVITY = 3.0; // 감도 2배

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [targets, setTargets] = useState<Target[]>([]);
  const [hitCount, setHitCount] = useState(0);

  const spawnedCount = useRef(0);
  const playAreaRef = useRef<HTMLDivElement>(null);
  const aimRef = useRef<HTMLDivElement>(null);
  const aimPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const spawnIntervalMs = 700;
  const lifetimeMs = 1400;

  // Pointer Lock
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!aimRef.current) return;

      aimPos.current.x += e.movementX * SENSITIVITY;
      aimPos.current.y += e.movementY * SENSITIVITY;

      // 화면 경계 제한
      aimPos.current.x = Math.max(0, Math.min(window.innerWidth, aimPos.current.x));
      aimPos.current.y = Math.max(0, Math.min(window.innerHeight, aimPos.current.y));

      aimRef.current.style.left = `${aimPos.current.x}px`;
      aimRef.current.style.top = `${aimPos.current.y}px`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const requestPointerLock = () => {
    playAreaRef.current?.requestPointerLock();
  };

  // 클릭 처리
  const handleClick = () => {
    const aimX = aimPos.current.x;
    const aimY = aimPos.current.y;

    const playArea = playAreaRef.current;
    if (!playArea) return;

    const rect = playArea.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    for (const target of targets) {
      const targetX = (target.x / 100) * width + rect.left;
      const targetY = (target.y / 100) * height + rect.top;

      const distance = Math.hypot(targetX - aimX, targetY - aimY);
      if (distance <= 8.2) {
        setHitCount((prev) => prev + 1);
        setTargets((prev) => prev.filter(t => t.id !== target.id));
        break;
      }
    }
  };

  // 타겟 생성
  useEffect(() => {
    const interval = setInterval(() => {
      if (spawnedCount.current >= TOTAL_TARGETS) {
        clearInterval(interval);
        return;
      }
      const newTarget: Target = {
        id: crypto.randomUUID(),
        x: Math.random() * 88 + 10,
        y: Math.random() * 85 + 10,
        createdAt: Date.now(),
      };
      setTargets((prev) => [...prev, newTarget]);
      spawnedCount.current += 1;
    }, spawnIntervalMs);
    return () => clearInterval(interval);
  }, []);

  // 타겟 제거
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTargets(prev => prev.filter(t => now - t.createdAt < lifetimeMs));
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  // 게임 종료
  useEffect(() => {
    if (spawnedCount.current === TOTAL_TARGETS && targets.length === 0) {
      document.exitPointerLock(); // 포인터 잠금 해제
      navigate('/result', { state: { score: hitCount } });
    }
  }, [targets, hitCount, navigate]);

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.info}>
        맞춘 타겟: {hitCount} / {TOTAL_TARGETS}
      </div>

      <div
        className={styles.playArea}
        ref={playAreaRef}
        onClick={requestPointerLock}
      >
        {targets.map(target => (
          <TargetItem key={target.id} x={target.x} y={target.y} size={16} />
        ))}
        <div ref={aimRef} className={styles.aim} />
      </div>
    </div>
  );
};

export default GamePage;
