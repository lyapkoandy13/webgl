import { Matrix4 } from "@math.gl/core";

/**
 *
 * @param array
 * @param dataCount elements in a single vertex data
 * @param usefulDataCount elements to collect
 */
export const logBufferDataHumanReadable = (
  array: number[],
  dataCount: number,
  usefulDataCount: number
): void => {
  const reduced = array.reduce<number[][]>((acc, val, idx) => {
    if (idx % dataCount > usefulDataCount - 1) return acc;

    const i = Math.floor(idx / dataCount);
    if (idx % dataCount === 0) acc[i] = [val];
    else acc[i].push(val);

    return acc;
  }, []);
  console.table(reduced);
  //   for (const [x, y] of reduced) {
  //     const vec = new Vector2(x * 200, y * 200);
  //     const res = mvp.transform(vec);
  //     console.log({
  //       old: [x, y],
  //       res,
  //     });
  //   }
};

export const logMatrixHumanReadable = (mat: Matrix4) => {
  logBufferDataHumanReadable(mat, 4, 4);
};
