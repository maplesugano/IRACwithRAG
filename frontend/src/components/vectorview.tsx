import { VectorViewProps } from '../models/types';
import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VectorPoints } from './points';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import LabeledAxes from './axes';

// Hook to add the CSS2DRenderer to the scene
const CSS2DRendererComponent = () => {
  const { gl, scene, camera } = useThree();
  const labelRendererRef = useRef<CSS2DRenderer | null>(null);

  useEffect(() => {
    if (!labelRendererRef.current) {
      labelRendererRef.current = new CSS2DRenderer();
      labelRendererRef.current.setSize(window.innerWidth, window.innerHeight);
      labelRendererRef.current.domElement.style.padding = '2px 4px';
      labelRendererRef.current.domElement.style.position = 'absolute';
      labelRendererRef.current.domElement.style.top = '0px';
      labelRendererRef.current.domElement.style.pointerEvents = 'none';
      document.body.appendChild(labelRendererRef.current.domElement);
    }

    const renderLoop = () => {
      labelRendererRef.current?.render(scene, camera);
    };

    gl.setAnimationLoop(renderLoop);

    return () => {
      gl.setAnimationLoop(null);
      if (labelRendererRef.current?.domElement) {
        labelRendererRef.current.domElement.remove();
      }
    };
  }, [gl, scene, camera]);

  return null;
};

const VectorView: React.FC<VectorViewProps> = ({
  vectorDB,
  pointRadius = 0.05,
  backgroundColor,
  noDataFallback = 'No vector data to display.',
  highlightVectors,
  nodecolors,
  nodeTextBackground,
  handleVectorClick,
}) => {
  if (vectorDB.length === 0) {
    return <div>{noDataFallback}</div>;
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor }}>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [1, 1, 5], near: 0.1, far: 1000 }} // Adjusted the camera position to zoom in
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Add CSS2DRenderer */}
        <CSS2DRendererComponent />

        <VectorPoints
          data={vectorDB}
          pointRadius={pointRadius}
          highlightVectors={highlightVectors}
          nodecolors={nodecolors}
          nodeTextBackground={nodeTextBackground}
          handleVectorClick={handleVectorClick}
        />

        <LabeledAxes />  {/* Add labeled axes */}

        <OrbitControls enableZoom={true} enableRotate={true} enablePan={true} />
      </Canvas>
    </div>
  );
};

export default VectorView;
