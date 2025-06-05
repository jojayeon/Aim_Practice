// 시작메인 페이지
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>에임 연습 - 난이도 및 감도 설정</h1>
      
      {/* 간단하게 난이도 버튼 3개 */}
      <div style={{ marginBottom: '20px' }}>
        <Button style={{ marginRight: '10px' }}>Easy</Button>
        <Button style={{ marginRight: '10px' }}>Normal</Button>
        <Button>Hard</Button>
      </div>

      {/* 감도 슬라이더 자리 (나중에 구현) */}
      <div style={{ marginBottom: '20px' }}>
        감도: <input type="range" min="1" max="10" defaultValue="5" />
      </div>

      <Button onClick={() => navigate('/game')}>시작하기</Button>
    </div>
  );
};

export default HomePage;
