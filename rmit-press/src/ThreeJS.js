import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function ThreeJS() {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  var canvasCount = 0;

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Set alpha to true
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Set clearAlpha to 0
    
    //its hacky but it does the job, for some reason this was firing twice...
    //if(canvasCount == 1){
      containerRef.current.appendChild(renderer.domElement);
      
    //}
    canvasCount++;
    const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
    const material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xd3d3d3 });
    //const material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xc5c5c5 });
    //const material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xffffff });
    const cylinder = new THREE.Mesh(geometry, material);
    scene.add(cylinder);

    camera.position.z = 5;

    function animate() {
      //console.log(`CAM: ${cameraRef.current.aspect}, ${JSON.stringify(cameraRef.current)}`);
      requestAnimationFrame(animate);
      cylinder.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    animate();

    cameraRef.current = camera;
    rendererRef.current = renderer;

    return () => {
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    function handleResize() {
      //console.log("WINDOW RESIZE??");
      const width = window.innerWidth;
      const height = window.innerHeight;    
      cameraRef.current.aspect = width / height;
      /*
      camera.left = -aspect * newSize / 2;
      camera.right = aspect * newSize  / 2;
      camera.top = newSize / 2;
      camera.bottom = -newSize / 2;
      */
/*
      cameraRef.current.left = -cameraRef.current.aspect * width / 2;
      cameraRef.current.right = cameraRef.current.aspect * width / 2;
*/
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);

      

    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={containerRef} style={{
    zIndex:5, 
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vw',
    height: '100vh',
  }} />;
}


export default ThreeJS;
