import React, { useEffect, useRef } from 'react';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { VectorProps } from '../models/types';

export const VectorPoints: React.FC<VectorProps> = ({
  data,
  pointRadius,
  highlightVectors,
  highlightColor,
  nodecolors,
  nodeTextBackground,
  handleVectorClick,
}) => {
  const scaleFactor = 0.1;
  const labelRefs = useRef<{ [key: string]: CSS2DObject }>({});

  useEffect(() => {
    Object.values(labelRefs.current).forEach((label) => {
      if (label && label.element) {
        label.element.style.display = 'block';
      }
    });

    return () => {
      Object.values(labelRefs.current).forEach((label) => {
        if (label && label.element) {
          label.element.style.display = 'none';
        }
      });
    };
  }, [data]);
  

  return (
    <>
      {data.map((vector) => {
        const [x, y, z] = vector.pca_vector;
        const isHighlighted = highlightVectors
          ? Array.from(highlightVectors).some((hv) => hv.id === vector.id)
          : false;
        const color = isHighlighted ? highlightColor : nodecolors[vector.type];

        // Create a label element
        const labelEl = document.createElement('div');
        labelEl.textContent = vector.title; //.replace('"', '').replace('**', '');
        labelEl.style.color = nodecolors[vector.type];
        labelEl.style.backgroundColor = nodeTextBackground;
        labelEl.style.padding = '2px 5px';
        labelEl.style.borderRadius = '4px';
        labelEl.style.fontSize = '12px';
        labelEl.style.pointerEvents = 'none';

        const label = new CSS2DObject(labelEl);
        label.position.set(0, -pointRadius, 0);
        labelRefs.current[vector.id] = label;

        return (
          <group key={vector.id} position={[x * scaleFactor, y * scaleFactor, z * scaleFactor]}>
            {/* Sphere representing the vector */}
            <mesh
              onClick={() => {
                if (handleVectorClick) {
                  handleVectorClick(vector);
                }
              }}
            >
              <sphereGeometry args={[pointRadius, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>

            {/* Label as a CSS2DObject */}
            <primitive object={label} />
          </group>
        );
      })}
    </>
  );
};

export default VectorPoints;
