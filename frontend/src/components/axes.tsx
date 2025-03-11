import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { AxesHelper, Vector3 } from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

const LabeledAxes: React.FC = () => {
  const { scene } = useThree();
  const labelsRef = useRef<{ [key: string]: CSS2DObject }>({});

  useEffect(() => {
    const createLabel = (text: string, position: Vector3, color: string) => {
      const labelEl = document.createElement('div');
      labelEl.textContent = text;
      labelEl.style.color = '#ffffff';
      labelEl.style.backgroundColor = color;
      labelEl.style.padding = '2px 4px';
      labelEl.style.borderRadius = '4px';
      labelEl.style.fontSize = '14px';
      labelEl.style.fontWeight = 'bold';
      labelEl.style.pointerEvents = 'none';

      const label = new CSS2DObject(labelEl);
      label.position.copy(position);
      return label;
    };

    // Create axis labels
    labelsRef.current['Legislative Changes'] = createLabel('Legislative Changes', new Vector3(4, 0, 0), "#cc6600");
    labelsRef.current['Wealth & Capital Structure'] = createLabel('Wealth & Capital Structure', new Vector3(0, 3, 0), "#66cc33");
    labelsRef.current['Resource Distribution & Transfers'] = createLabel('Resource Distribution & Transfers', new Vector3(0, 0, 4), "#009999");

    // Add labels to the scene
    Object.values(labelsRef.current).forEach((label) => scene.add(label));

    return () => {
      Object.values(labelsRef.current).forEach((label) => scene.remove(label));
    };
  }, [scene]);

  return <primitive object={new AxesHelper(4)} />;
};

export default LabeledAxes;
