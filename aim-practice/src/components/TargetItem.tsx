import React from 'react';
import styles from '../styles/TargetItem.module.css';

interface TargetProps {
  x: number;
  y: number;
}

const TargetItem: React.FC<TargetProps> = ({ x, y }) => {
  return (
    <div
      className={styles.target}
      style={{ top: `${y}%`, left: `${x}%` }}
    />
  );
};

export default TargetItem;
