export const chunk = <T extends string | unknown[], R = T>(
  arr: T,
  size: number,
  mapFn?: (arrChunk: T, index: number, arr: T) => R,
): R[] =>
  Array.from<void, R>({ length: Math.ceil(arr.length / size) }, (_, i) => {
    const arrChunk = arr.slice(i * size, i * size + size) as T;
    return mapFn ? mapFn(arrChunk, i, arr) : (arrChunk as unknown as R);
  });

export const numberToHex = (number: number) =>
  `0x${number.toString(16).toUpperCase().padStart(2, '0')}`;

export const binaryToHex = (binary: string) => numberToHex(parseInt(binary, 2));

export const splitBitsIntoQuadrants = (
  bits: number[][],
  quadrantsSize: number,
): number[][][] => {
  const quadrantsPerRow = bits[0].length / quadrantsSize;
  const quadrantsPerColumn = bits.length / quadrantsSize;
  const totalQuadrants = quadrantsPerRow * quadrantsPerColumn;
  const quadrants: number[][][] = [];
  for (let i = 0; i < totalQuadrants; i++) {
    const startX = (i % quadrantsPerRow) * quadrantsSize;
    const startY = Math.floor(i / quadrantsPerRow) * quadrantsSize;
    const quadrant: number[] = [];
    for (let j = 0; j < quadrantsSize ** 2; j++) {
      const quadrantX = j % quadrantsSize;
      const quadrantY = Math.floor(j / quadrantsSize);
      quadrant.push(bits[startY + quadrantY][startX + quadrantX]);
    }
    quadrants.push(chunk(quadrant, quadrantsSize));
  }
  return quadrants;
};

export const image1BppToHex = (
  bits: number[] | number[][],
  width?: number,
  height?: number,
) => {
  const [computedWidth, computedHeight] = Array.isArray(bits[0])
    ? [bits[0].length, bits.length]
    : [width, height];

  if (
    !computedWidth ||
    !computedHeight ||
    computedWidth % 8 !== 0 ||
    computedHeight % 8 !== 0
  ) {
    throw new Error('Invalid image size');
  }

  const matrix = (
    Array.isArray(bits[0]) ? bits : chunk(bits, computedWidth)
  ) as number[][];

  const quadrants = splitBitsIntoQuadrants(matrix, 8);

  return quadrants.flatMap((quadrant) =>
    quadrant.map((octet) => binaryToHex(octet.join(''))),
  );
};

export const image2BppToHex = (
  bits: number[] | number[][],
  width?: number,
  height?: number,
) => {
  const [computedWidth, computedHeight] = Array.isArray(bits[0])
    ? [bits[0].length, bits.length]
    : [width, height];

  if (
    !computedWidth ||
    !computedHeight ||
    computedWidth % 8 !== 0 ||
    computedHeight % 8 !== 0
  ) {
    throw new Error('Invalid image size');
  }

  const matrix = (
    Array.isArray(bits[0]) ? bits : chunk(bits, computedWidth)
  ) as number[][];

  const quadrants = splitBitsIntoQuadrants(matrix, 8);

  return quadrants.flatMap((quadrant) =>
    quadrant.flatMap((hextet) =>
      Array.from(hextet.map((b) => b.toString(2).padStart(2, '0')).join(''))
        .reduce<[string, string]>(
          ([byte1, byte2], bit, index) =>
            index % 2 ? [byte1 + bit, byte2] : [byte1, byte2 + bit],
          ['', ''],
        )
        .map((byte) => binaryToHex(byte)),
    ),
  );
};
