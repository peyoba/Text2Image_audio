export function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  const chunkSize = 8192;
  const parts = [];
  for (let i = 0; i < len; i += chunkSize) {
    const slice = bytes.subarray(i, Math.min(i + chunkSize, len));
    parts.push(String.fromCharCode.apply(null, slice));
  }
  return btoa(parts.join(""));
}
