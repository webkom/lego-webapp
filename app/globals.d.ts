declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare const __DEV__: boolean;
declare const __CLIENT__: boolean;
