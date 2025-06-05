import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import styles from  '../styles/Startpage.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [sensitivity, setSensitivity] = useState<number>(5);

  const handleStart = () => {
    console.log('난이도:', difficulty);
    console.log('감도:', sensitivity);
    navigate('/game');
  };

  return (
    <div className={styles.container}>
      <h1>🎯 에임 연습</h1>

      <section className={styles.section}>
        <h2>난이도 선택</h2>
        <div className={styles.difficultyButtons}>
          {(['easy', 'normal', 'hard'] as const).map((level) => (
            <Button
              key={level}
              onClick={() => setDifficulty(level)}
              style={{
                backgroundColor: difficulty === level ? '#28a745' : undefined,
              }}
            >
              {level.toUpperCase()}
            </Button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>감도 설정</h2>
        <input
          type="range"
          min={1}
          max={10}
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
        />
        <div>현재 감도: {sensitivity}</div>
      </section>

      <div className={styles.startButton}>
        <Button onClick={handleStart}>시작하기</Button>
      </div>
    </div>
  );
};

export default HomePage;
