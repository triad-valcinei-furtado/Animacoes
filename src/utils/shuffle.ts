export function shuffleArrayBasedOnOrder<T>(
  originalArray: T[],
  originalOrder: number[],
  newOrder: number[]
): T[] {
  if (
    originalArray.length !== originalOrder.length ||
    originalOrder.length !== newOrder.length
  ) {
    throw new Error("Os arrays de entrada devem ter o mesmo comprimento.");
  }

  const resultArray: T[] = [];

  for (const newIndex of newOrder) {
    const originalIndex = originalOrder.indexOf(newIndex);

    if (originalIndex === -1) {
      throw new Error(
        `O índice ${newIndex} não está presente no array de ordem original.`
      );
    }

    resultArray.push(originalArray[originalIndex]);
  }

  return resultArray;
}

export function swapFirstAndLast<T>(arr: T[]): T[] {
  if (arr.length < 2) {
    return arr; // Não é possível fazer a troca em arrays com menos de 2 elementos
  }

  const firstValue = arr[0];
  arr[0] = arr[arr.length - 1];
  arr[arr.length - 1] = firstValue;

  return arr;
}
