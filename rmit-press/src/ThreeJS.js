import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function ThreeJS() {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Set alpha to true
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Set clearAlpha to 0
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
    const material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });
    const cylinder = new THREE.Mesh(geometry, material);
    scene.add(cylinder);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      cylinder.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{zIndex:-1, width: '100%', height: '100vh' }} />;
}


export default ThreeJS;
