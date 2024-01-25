export const generateRandom32ByteHexString = () => {
  if (typeof window === "undefined") throw new Error("window not available");
  if (!window.crypto) throw new Error("window.crypto not available");
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
};
