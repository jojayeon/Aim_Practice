// 게임 페이지 컴포넌트
import React, { useEffect, useRef } from 'react';         // React 훅들 import
import * as THREE from 'three';                           // Three.js 전체 import
import styles from '../styles/GamePage.module.css';       // CSS 모듈 import
import Crosshair from '../components/Crosshair';          // 중앙 조준선 컴포넌트 import

const GamePage: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);          // 렌더링할 DOM 요소를 참조하기 위한 ref

  useEffect(() => {
    const mount = mountRef.current!;                      // DOM 요소 가져오기 (null 아님 단언)
    
    // === Three.js Scene 구성 ===
    const scene = new THREE.Scene();                      // 장면 생성
    const camera = new THREE.PerspectiveCamera(           // 시야각, 비율, near/far 설정
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;                                // 카메라를 z축으로 멀리 위치

    const renderer = new THREE.WebGLRenderer();           // 렌더러 생성
    renderer.setSize(mount.clientWidth, mount.clientHeight);  // 렌더러 크기 설정
    mount.appendChild(renderer.domElement);               // canvas 엘리먼트를 DOM에 추가

    // === 간단한 오브젝트 생성 (정육면체) ===
    const geometry = new THREE.BoxGeometry();             // 정육면체 기하 구조
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 초록색 재질
    const cube = new THREE.Mesh(geometry, material);      // 정육면체 Mesh 생성
    scene.add(cube);                                      // 장면에 추가

    // === 렌더링 루프 (애니메이션) ===
    const animate = () => {
      requestAnimationFrame(animate);                     // 반복 호출 (애니메이션 루프)
      cube.rotation.y += 0.01;                            // 큐브를 Y축으로 회전
      renderer.render(scene, camera);                     // 장면을 카메라로 렌더링
    };

    animate();                                            // 애니메이션 시작

    // === Pointer Lock API 설정 ===
    const canvas = renderer.domElement;
    canvas.addEventListener('click', () => {
      canvas.requestPointerLock();                        // 클릭하면 마우스를 포인터 락
    });

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvas) {       // 포인터 락 상태일 때만
        camera.rotation.y -= e.movementX * 0.002;         // 마우스 X 이동 → Yaw 회전
        camera.rotation.x -= e.movementY * 0.002;         // 마우스 Y 이동 → Pitch 회전
      }
    };

    document.addEventListener('mousemove', onMouseMove);  // 마우스 이동 이벤트 리스너 등록

    // === 클린업 ===
    return () => {
      document.removeEventListener('mousemove', onMouseMove); // 이벤트 제거
      mount.removeChild(renderer.domElement);            // 렌더러 제거
    };
  }, []);

  // === 화면에 렌더링될 요소 ===
  return (
    <div ref={mountRef} className={styles.canvasContainer}>  {/* Three.js가 그릴 DOM */}
      <Crosshair />                                           {/* 중앙 조준선 UI */}
    </div>
  );
};

export default GamePage;