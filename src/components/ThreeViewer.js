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
import { Label } from "@/components/ui/label";
import { RotateCw, Move, Grid, Box } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const ThreeViewer = ({ modelUrl }) => {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [controls, setControls] = useState(null);
  const [object, setObject] = useState(null);
  const [wireframe, setWireframe] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    if (!modelUrl) return;

    const init = () => {
      setIsLoading(true);
      setError(null);

      // Scene setup
      const newScene = new THREE.Scene();
      const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const newRenderer = new THREE.WebGLRenderer({ antialias: true });
      newRenderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
      mountRef.current.appendChild(newRenderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      newScene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 1);
      pointLight.position.set(5, 5, 5);
      newScene.add(pointLight);

      // Controls
      const newControls = new OrbitControls(newCamera, newRenderer.domElement);

      setScene(newScene);
      setCamera(newCamera);
      setRenderer(newRenderer);
      setControls(newControls);

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
          const newObject = loadedObject.scene || loadedObject;
          newScene.add(newObject);
          setObject(newObject);

          // Adjust camera position
          const box = new THREE.Box3().setFromObject(newScene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = newCamera.fov * (Math.PI / 180);
          let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
          cameraZ *= 1.5;
          newCamera.position.set(center.x, center.y, center.z + cameraZ);
          newCamera.lookAt(center);
          newControls.update();

          // Get model info
          let polyCount = 0;
          newObject.traverse((child) => {
            if (child.isMesh) {
              polyCount += child.geometry.attributes.position.count / 3;
            }
          });

          setModelInfo({
            polyCount: Math.round(polyCount),
            fileSize: (loadedObject.byteLength / 1024 / 1024).toFixed(2) + ' MB'
          });

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
    };

    init();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controls) controls.update();
      if (renderer && scene && camera) renderer.render(scene, camera);
    };
    animate();

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

  const handleRotate = () => {
    if (object) {
      object.rotation.y += Math.PI / 4; // Rotate 45 degrees
    }
  };

  const handlePan = (direction) => {
    if (camera) {
      const speed = 0.1;
      switch (direction) {
        case 'left':
          camera.position.x -= speed;
          break;
        case 'right':
          camera.position.x += speed;
          break;
        case 'up':
          camera.position.y += speed;
          break;
        case 'down':
          camera.position.y -= speed;
          break;
      }
      camera.updateProjectionMatrix();
    }
  };

  const toggleWireframe = () => {
    setWireframe(!wireframe);
    if (object) {
      object.traverse((child) => {
        if (child.isMesh) {
          child.material.wireframe = !wireframe;
        }
      });
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
        <div className="flex space-x-2">
          <Button onClick={handleResetView}>Reset View</Button>
          <Button onClick={handleRotate}><RotateCw className="mr-2 h-4 w-4" /> Rotate</Button>
          <Button onClick={toggleWireframe}><Grid className="mr-2 h-4 w-4" /> Wireframe</Button>
        </div>
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
        <div>
          <Label>Pan</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button onClick={() => handlePan('left')} className="col-start-1"><Move className="h-4 w-4" /></Button>
            <Button onClick={() => handlePan('up')} className="col-start-2"><Move className="h-4 w-4 rotate-90" /></Button>
            <Button onClick={() => handlePan('right')} className="col-start-3"><Move className="h-4 w-4 rotate-180" /></Button>
            <Button onClick={() => handlePan('down')} className="col-start-2"><Move className="h-4 w-4 -rotate-90" /></Button>
          </div>
        </div>
        {modelInfo && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Model Information</h3>
            <p>Polygon Count: {modelInfo.polyCount}</p>
            <p>File Size: {modelInfo.fileSize}</p>
          </div>
        )}
      </div>
    </div>
  );
};