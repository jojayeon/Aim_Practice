// 게임 페이지 
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GamePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>게임 진행 화면</h1>
      <p>여기에 게임 씬이 들어갈 예정입니다.</p>

      {/* 점수 표시 자리 */}
      <div>점수: 0 / 100</div>

      {/* 테스트용 결과 페이지 이동 버튼 */}
      <button onClick={() => navigate('/result')}>결과 페이지로 이동</button>
    </div>
  );
};

export default GamePage;
