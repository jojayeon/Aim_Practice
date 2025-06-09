// 게임 페이지 컴포넌트
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/GamePage.module.css';
import Button from '../components/Button';
import ThreeCanvas from '../components/ThreeCanvas';

const TOTAL_TARGETS = 100;

const GamePage = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [targetsLeft, setTargetsLeft] = useState(TOTAL_TARGETS);
  const [gameOver, setGameOver] = useState(false);

  // 타겟 맞췄을 때 호출 (임시)
  const handleHit = () => {
    setScore((prev) => prev + 1);
    setTargetsLeft((prev) => prev - 1);
  };

  useEffect(() => {
    if (targetsLeft <= 0) {
      setGameOver(true);
    }
  }, [targetsLeft]);

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      {/* 점수 UI */}
      <div className={styles.scoreUI}>
        점수: {score} / {TOTAL_TARGETS}
      </div>

      {/* Three.js 화면 */}
      <ThreeCanvas />
      <div className={styles.crosshair} />
      {/* 게임 종료 오버레이 */}
      {gameOver && (
        <div className={styles.overlay}>
          <h2 className={styles.result}>게임 종료!</h2>
          <p className={styles.result}>
            당신의 점수: {score} / {TOTAL_TARGETS}
          </p>
          <Button onClick={handleRestart}>다시 시작하기</Button>
        </div>
      )}
    </div>
  );
};

export default GamePage;

