// Allow importing common image types in TypeScript (we no longer use the Figma virtual scheme)
declare module '*.png' {
  const value: { src: string; width?: number; height?: number; blurDataURL?: string };
  export default value;
}
declare module '*.jpg' {
  const value: { src: string; width?: number; height?: number; blurDataURL?: string };
  export default value;
}
declare module '*.jpeg' {
  const value: { src: string; width?: number; height?: number; blurDataURL?: string };
  export default value;
}
declare module '*.svg' {
  const value: { src: string; width?: number; height?: number; blurDataURL?: string };
  export default value;
}
