import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Startpage.module.css';
import Button from '../components/Button';

const StartPage = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleStart = () => {
    navigate('/game', { state: { difficulty } });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎯 에임 연습</h1>

      <div className={styles.difficultySelector}>
        {['easy', 'medium', 'hard'].map((level) => (
          <Button
            key={level}
            onClick={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
            style={{
              backgroundColor: difficulty === level ? '#4caf50' : '#ddd',
              color: difficulty === level ? 'white' : 'black',
              margin: '0 8px',
            }}
          >
            {level.toUpperCase()}
          </Button>
        ))}
      </div>

      <Button onClick={handleStart} style={{ marginTop: '20px' }}>
        시작하기
      </Button>
    </div>
  );
};

export default StartPage;
