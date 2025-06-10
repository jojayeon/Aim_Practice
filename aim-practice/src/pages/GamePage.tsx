import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/GamePage.module.css'; // CSS 별도 분리

interface Target {
  id: string;
  x: number;
  y: number;
  createdAt: number;
}

const TOTAL_TARGETS = 100;

const GamePage: React.FC = () => {
  const navigate = useNavigate();

  // 수정 가능: 타겟 생성 간격 (ms)
  const [spawnIntervalMs, setSpawnIntervalMs] = useState(1000);

  // 수정 가능: 타겟 유지 시간 (ms)
  const [lifetimeMs, setLifetimeMs] = useState(3000);

  const [targets, setTargets] = useState<Target[]>([]);
  const [hitCount, setHitCount] = useState(0);

  // 생성된 타겟 수 추적 (useRef로 상태 아님)
  const spawnedCount = useRef(0);

  // 타겟 생성 반복
  useEffect(() => {
    const interval = setInterval(() => {
      if (spawnedCount.current >= TOTAL_TARGETS) {
        clearInterval(interval);
        return;
      }
      const newTarget: Target = {
        id: crypto.randomUUID(),
        x: Math.random() * 80 + 10, // 수정 가능: X 위치 범위 10%~90%
        y: Math.random() * 80 + 10, // 수정 가능: Y 위치 범위 10%~90%
        createdAt: Date.now(),
      };
      setTargets((prev) => [...prev, newTarget]);
      spawnedCount.current += 1;
    }, spawnIntervalMs);

    return () => clearInterval(interval);
  }, [spawnIntervalMs]);
  //100개가 다 나오면 자동으로 종료되게 설정 
  useEffect(() => {
  if (spawnedCount.current === TOTAL_TARGETS && targets.length === 0) {
    // 100개 모두 생성 완료 + 화면에 남은 타겟 없음 → 게임 종료
    navigate('/result', { state: { score: hitCount } });
  }
}, [targets, hitCount, navigate]);

  // 일정 시간 지난 타겟 자동 제거
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTargets((prev) => prev.filter(t => now - t.createdAt < lifetimeMs));
    }, 500);

    return () => clearInterval(cleanup);
  }, [lifetimeMs]);

  // 클릭 시 타겟 맞추기 처리
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    for (const target of targets) {
      const targetX = (target.x / 100) * screenW;
      const targetY = (target.y / 100) * screenH;
      const distance = Math.hypot(targetX - e.clientX, targetY - e.clientY);

      if (distance <= 30) {  // 수정 가능: 타겟 맞추는 허용 반경 (픽셀)
        setHitCount((prev) => prev + 1);
        setTargets((prev) => prev.filter(t => t.id !== target.id));
        break;
      }
    }
  };

  // 게임 종료 후 결과 페이지 이동
  useEffect(() => {
    if (hitCount >= TOTAL_TARGETS) {
      navigate('/result', { state: { score: hitCount } });
    }
  }, [hitCount, navigate]);

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.info}>
        <div>맞춘 타겟: {hitCount} / {TOTAL_TARGETS}</div>
        <div>
          {/* 수정 가능: 타겟 생성 간격, 유지 시간 직접 입력 UI 추가 가능 */}
          타겟 생성 간격: {spawnIntervalMs}ms, 타겟 유지 시간: {lifetimeMs}ms
        </div>
      </div>

      <div className={styles.playArea}>
        {targets.map((target) => (
          <div
            key={target.id}
            className={styles.target}
            style={{
              top: `${target.y}%`,
              left: `${target.x}%`,
            }}
          />
        ))}
        <div className={styles.crosshair} />
      </div>
    </div>
  );
};

export default GamePage;
