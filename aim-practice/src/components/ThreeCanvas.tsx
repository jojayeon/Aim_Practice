import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current?.appendChild(renderer.domElement);

    const canvas = renderer.domElement;
    canvas.addEventListener('click', () => canvas.requestPointerLock());

    // 카메라 회전 상태 저장
    let yaw = 0;   // 좌우 (Y축) 회전
    let pitch = 0; // 상하 (X축) 회전

    // 제한 각도 (라디안)
    const maxPitch = THREE.MathUtils.degToRad(85);
    const minPitch = THREE.MathUtils.degToRad(-85);
    const maxYaw = THREE.MathUtils.degToRad(135);
    const minYaw = THREE.MathUtils.degToRad(-135);

    const handleMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement === canvas) {
        const movementX = event.movementX || 0;
        const movementY = event.movementY || 0;

        // 감도 고정 (4.0 설정) - 마우스 이동량에 곱함
        const sensitivity = 0.0025 * 4.0; 

        yaw -= movementX * sensitivity; // 마우스 오른쪽 움직임은 카메라 왼쪽 회전 (음수)
        pitch -= movementY * sensitivity; // 마우스 위쪽 움직임은 카메라 아래 회전 (음수)

        // 각도 제한
        yaw = THREE.MathUtils.clamp(yaw, minYaw, maxYaw);
        pitch = THREE.MathUtils.clamp(pitch, minPitch, maxPitch);

        // 카메라 쿼터니언으로 회전 적용
        // Yaw (Y축 회전)
        const quatYaw = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          yaw
        );
        // Pitch (X축 회전)
        const quatPitch = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0),
          pitch
        );

        // Yaw 먼저 적용 후 Pitch 적용
        camera.quaternion.copy(quatYaw).multiply(quatPitch);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    // 검은 판 생성
    const planeGeometry = new THREE.PlaneGeometry(20, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    // 타겟 생성 함수
    const createTarget = () => {
      const geometry = new THREE.SphereGeometry(0.3, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(geometry, material);
      const x = THREE.MathUtils.randFloat(-9.5, 9.5);
      const y = THREE.MathUtils.randFloat(-4.5, 4.5);
      const z = 0.01;
      sphere.position.set(x, y, z);
      scene.add(sphere);
    };

    for (let i = 0; i < 5; i++) {
      createTarget();
    }

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      document.removeEventListener('mousemove', handleMouseMove);
      planeGeometry.dispose();
      planeMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeCanvas;
