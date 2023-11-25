/**
 * Concatenate multiple Uint8Arrays into a single Uint8Array.
 *
 * @param arrays - The arrays to concatenate
 * @returns The concatenated array
 */
export function concatUint8Array(...arrays: Uint8Array[]) {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
