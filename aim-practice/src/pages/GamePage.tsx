import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TargetItem from '../components/TargetItem';
import styles from '../styles/GamePage.module.css';

interface Target {
  id: string;
  x: number;         // 타겟의 x 위치 (% 단위, 0~100)
  y: number;         // 타겟의 y 위치 (% 단위, 0~100)
  createdAt: number; // 생성된 시간
}

const TOTAL_TARGETS = 100;           // 총 타겟 수 (수정 가능)

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [targets, setTargets] = useState<Target[]>([]);
  const [hitCount, setHitCount] = useState(0);

  const spawnedCount = useRef(0);
  const playAreaRef = useRef<HTMLDivElement>(null); // 플레이 영역 참조
  const spawnIntervalMs = 700;       // 타겟 생성 간격 (ms) — 필요시 수정
  const lifetimeMs = 1400;           // 타겟이 유지되는 시간 (ms) — 필요시 수정

  // 타겟 생성
  useEffect(() => {
    const interval = setInterval(() => {
      if (spawnedCount.current >= TOTAL_TARGETS) {
        clearInterval(interval);
        return;
      }
      const newTarget: Target = {
        id: crypto.randomUUID(),
        x: Math.random() * 88 + 10,  // x 위치 (10% ~ 90%)
        y: Math.random() * 85 + 10,  // y 위치 (10% ~ 90%)
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
    if (!playAreaRef.current) return;

    const playArea = playAreaRef.current;
    const playAreaTop = playArea.offsetTop;
    const playAreaLeft = playArea.offsetLeft;
    const playAreaWidth = playArea.offsetWidth;
    const playAreaHeight = playArea.offsetHeight;

    for (const target of targets) {
      // 타겟의 실제 픽셀 좌표 (플레이 영역 기준)
      const targetX = (target.x / 100) * playAreaWidth + playAreaLeft;
      const targetY = (target.y / 100) * playAreaHeight + playAreaTop;

      const distance = Math.hypot(targetX - e.clientX, targetY - e.clientY);

      if (distance <= 8.2) {
        setHitCount((prev) => prev + 1);
        setTargets((prev) => prev.filter(t => t.id !== target.id));
        break;
      }
    }
  };

  // 게임 종료 조건
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

      <div className={styles.playArea} ref={playAreaRef}>
        {targets.map(target => (
          <TargetItem
            key={target.id}
            x={target.x}
            y={target.y}
          />
        ))}
      </div>
    </div>
  );
};

export default GamePage;
