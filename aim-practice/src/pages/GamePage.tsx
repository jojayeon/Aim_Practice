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
  const spawnIntervalMs = 800;       // 타겟 생성 간격 (ms) — 필요시 수정
  const lifetimeMs = 1500;           // 타겟이 유지되는 시간 (ms) — 필요시 수정

  // 타겟 생성
  useEffect(() => {
    const interval = setInterval(() => {
      if (spawnedCount.current >= TOTAL_TARGETS) {
        clearInterval(interval);
        return;
      }
      const newTarget: Target = {
        id: crypto.randomUUID(),

        // 🔧 타겟 위치 범위 (수정 가능)
        // 아래 수식은 화면의 10% ~ 90% 범위 안에서 무작위 위치를 의미합니다.
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
    console.log('현재 타겟 수:', targets.length);
    console.log('클릭 좌표:', e.clientX, e.clientY);
    console.log('타겟 위치:', targets.map(t => ({x: t.x, y: t.y})));
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    for (const target of targets) {
      const targetX = (target.x / 100) * screenW;
      const targetY = (target.y / 100) * screenH;
      const distance = Math.hypot(targetX - e.clientX, targetY - e.clientY);
      console.log('화면 크기:', screenW, screenH);

      // 🎯 클릭 허용 범위 (수정 가능)
      // 현재는 타겟 중심 기준 반경 30px 이내일 때 명중 처리
      if (distance <= 21) {
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

      <div className={styles.playArea}>
        {targets.map(target => (
          <TargetItem
            key={target.id}
            x={target.x}
            y={target.y}
            // 💡 TargetItem 컴포넌트 내부에서 타겟 크기를 조절할 수 있습니다 (예: 0.3 ~ 0.5 크기 등)
          />
        ))}
      </div>
    </div>
  );
};

export default GamePage;
