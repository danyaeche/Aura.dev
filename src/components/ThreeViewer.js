import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export const ThreeViewer = ({ modelUrl }) => {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!modelUrl) return;

    let scene, camera, renderer, controls, object;

    const init = () => {
      setIsLoading(true);
      setError(null);

      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
      mountRef.current.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);

      // Model loading
      const extension = modelUrl.split('.').pop().toLowerCase();
      let loader;

      switch (extension) {
        case 'gltf':
        case 'glb':
          loader = new GLTFLoader();
          break;
        case 'obj':
          loader = new OBJLoader();
          break;
        case 'fbx':
          loader = new FBXLoader();
          break;
        case 'stl':
          loader = new STLLoader();
          break;
        case '3ds':
          loader = new TDSLoader();
          break;
        default:
          setError('Unsupported file format');
          setIsLoading(false);
          return;
      }

      loader.load(
        modelUrl,
        (loadedObject) => {
          object = loadedObject.scene || loadedObject;
          scene.add(object);

          // Adjust camera position
          const box = new THREE.Box3().setFromObject(scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = camera.fov * (Math.PI / 180);
          let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
          cameraZ *= 1.5;
          camera.position.set(center.x, center.y, center.z + cameraZ);
          camera.lookAt(center);
          controls.update();

          setIsLoading(false);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
          console.error('An error happened', error);
          setError('Failed to load the 3D model');
          setIsLoading(false);
        }
      );

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    };

    init();

    // Cleanup
    return () => {
      if (renderer) {
        renderer.dispose();
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl]);

  const handleResetView = () => {
    if (controls) {
      controls.reset();
    }
  };

  const handleZoom = (zoomLevel) => {
    if (camera) {
      camera.zoom = zoomLevel[0];
      camera.updateProjectionMatrix();
    }
  };

  if (isLoading) {
    return <div>Loading 3D model...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div ref={mountRef}></div>
      <div className="mt-4 space-y-4">
        <Button onClick={handleResetView}>Reset View</Button>
        <div>
          <Label htmlFor="zoom">Zoom</Label>
          <Slider
            id="zoom"
            min={0.1}
            max={2}
            step={0.1}
            defaultValue={[1]}
            onValueChange={handleZoom}
          />
        </div>
      </div>
    </div>
  );
};