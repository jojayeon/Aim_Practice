import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Startpage.module.css';
import Button from '../components/Button';

const StartPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/game');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎯 에임 연습</h1>
      <Button onClick={handleStart}>시작하기</Button>
    </div>
  );
};

export default StartPage;
