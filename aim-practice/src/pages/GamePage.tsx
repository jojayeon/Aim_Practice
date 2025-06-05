// 게임 페이지 
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from '../styles/GamePage.module.css';
import Crosshair from '../components/Crosshair';

const GamePage: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current!;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Pointer Lock
    const canvas = renderer.domElement;
    canvas.addEventListener('click', () => {
      canvas.requestPointerLock();
    });

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvas) {
        camera.rotation.y -= e.movementX * 0.002;
        camera.rotation.x -= e.movementY * 0.002;
      }
    };

    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className={styles.canvasContainer}>
      <Crosshair />
    </div>
  );
};

export default GamePage;
