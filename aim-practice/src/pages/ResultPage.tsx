// 결과 페이지
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const ResultPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>결과 화면</h1>
      <p>최종 점수: 0점</p>

      <Button onClick={() => navigate('/')}>다시 시작</Button>
    </div>
  );
};

export default ResultPage;
