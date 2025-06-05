// 버튼 컴포넌트 
import React from 'react';

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, style }) => {
  return (
    <button
      style={{
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

