export type MeshData = { verts: Float32Array; normals: Float32Array };

/**
 *  STL structure
 *  80 bytes - header (can contain color info?)
 *  4 bytes - little endian number of triangles
 *  50 bytes - triangles[]
 *    4 bytes float x 3 = 12 bytes - normal
 *    4 bytes float x 3 = 12 bytes - x
 *    4 bytes float x 3 = 12 bytes - y
 *    4 bytes float x 3 = 12 bytes - z
 *    2 bytes uint16 - attribute byte count (can be color information?)
 */
export const loadSTL = async (
  stlFilePath: string,
  duplicateNormalsPerVertex: boolean = true
): Promise<MeshData> => {
  // TODO: error handle
  const arrBuffer = await (await fetch(stlFilePath)).arrayBuffer();

  const trianglesCount = new DataView(arrBuffer.slice(80, 84)).getUint32(
    0,
    true
  );
  console.log(`Triangles count: ${trianglesCount}`);

  // Each triangle is represented by 50 bytes
  // const firstTriangle = arrBuffer.slice(84, 84 + 50);
  // console.log("normal: ", new Float32Array(firstTriangle, 0, 3));
  // console.log("vertices: ", new Float32Array(firstTriangle, 12, 9));
  // console.log(`verices str: ${new Float32Array(firstTriangle, 12, 9)}`);
  // console.log("Attribute byte count: ", new Uint16Array(firstTriangle, 48, 1));

  const TRIANGLES_START_BYTE_OFFSET = 84;
  const BYTES_PER_TRIANGLE = 50;
  // TODO?: SharedArrayBuffer
  // const triangles: Triangle[] = [];
  const normalsOffset = duplicateNormalsPerVertex ? 9 : 3;

  const vertsFloatArray = new Float32Array(trianglesCount * 3 * 3);
  const normalsFloatArray = new Float32Array(
    trianglesCount * 3 * normalsOffset
  );

  for (let i = 0; i < trianglesCount; i++) {
    const byteOffset = TRIANGLES_START_BYTE_OFFSET + BYTES_PER_TRIANGLE * i;
    const triangleBuffer = arrBuffer.slice(
      byteOffset,
      byteOffset + BYTES_PER_TRIANGLE
    );

    normalsFloatArray.set(
      new Float32Array(triangleBuffer, 0, 3),
      i * normalsOffset
    );
    if (duplicateNormalsPerVertex) {
      normalsFloatArray.set(
        new Float32Array(triangleBuffer, 0, 3),
        i * normalsOffset + 3
      );
      normalsFloatArray.set(
        new Float32Array(triangleBuffer, 0, 3),
        i * normalsOffset + 6
      );
    }

    vertsFloatArray.set(
      new Float32Array(triangleBuffer, 3 * Float32Array.BYTES_PER_ELEMENT, 9),
      i * 9
    );
  }

  return { normals: normalsFloatArray, verts: vertsFloatArray };
};
