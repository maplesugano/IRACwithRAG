import Papa from 'papaparse';
import { VectorEntity } from '../models/types';

export function reduceNewVector(pca: any, newVector: number[]): number[] {
  const meanVector = pca.means;
  const components = pca.getLoadings();

  const centered = newVector.map((val, i) => val - meanVector[i]);
  const reducedVec = matrixVectorMultiply(components.data, centered);

  return [reducedVec[0], reducedVec[1], reducedVec[2]];
}

function matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
  const matrixArray = Array.from(matrix, row => Array.from(row));
  const result: number[] = new Array(matrixArray.length).fill(0);
  for (let i = 0; i < matrixArray.length; i++) {
    for (let j = 0; j < vector.length; j++) {
      result[i] += matrixArray[i][j] * vector[j];
    }
  }
  return result;
}

export async function loadAndProcessVectors(pca: any, entities: VectorEntity[]): Promise<VectorEntity[]> {
  const updatedEntities = await performPCA(pca, entities);
  return updatedEntities;
}
  
async function performPCA(pca: any, entities: VectorEntity[]): Promise<VectorEntity[]> {
  const reducedData = pca.predict(entities.map((e) => e.raw_vector), { nComponents: 3 });

  entities.forEach((entity, idx) => {
    entity.pca_vector = reducedData.data[idx];
  });

  return entities;
}

export async function fetchCSV(csvUrl: string): Promise<VectorEntity[]> {
  const response = await fetch(csvUrl);
  const csvText = await response.text();
  
  const parsed = Papa.parse(csvText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true
  });

  const entities: VectorEntity[] = (parsed.data as any[]).map((row) => {
    const rawVector: number[] = [];
    const pcaVector: number[] = [];
    Object.keys(row).forEach((key) => {
      if (key.startsWith('e')) {
        rawVector.push(row[key]);
      }
      if (key.startsWith('PCA')) {
        pcaVector.push(row[key]);
      }
    });

    return {
      id: row.id,
      text: row.text,
      title: row.title,
      type: row.type,
      raw_vector: rawVector,
      pca_vector: pcaVector // We will fill this in later
    };
  });

  return entities;
}
