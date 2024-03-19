// import debounce from 'lodash/debounce';
// import { useEffect, useRef, useState } from 'react';
// import { useTheme } from 'app/utils/themeUtils';
// import styles from './FancyNodesCanvas.css';
// import drawFancyNodes from './drawFancyNodes';

type Props = {
  height?: number;
};

const FancyNodesCanvas = ({}: Props) => {
  // const [width, setWidth] = useState(0);
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const theme = useTheme();
  return null;

  // useEffect(() => {
  //   setWidth(window.innerWidth);
  // }, []);

  // useEffect(() => {
  //   const handleResize = debounce((e: UIEvent) => {
  //     setWidth((e.target as Window).innerWidth);
  //   }, 70);

  //   if (typeof window !== 'undefined') {
  //     window.addEventListener('resize', handleResize);
  //   }

  //   return () => {
  //     if (typeof window !== 'undefined') {
  //       window.removeEventListener('resize', handleResize);
  //     }
  //   };
  // }, [width]);

  // useEffect(() => {
  //   const context = canvasRef.current?.getContext('2d');
  //   if (!context) return;

  //   drawFancyNodes(context, theme, {
  //     width,
  //     height,
  //   });
  // }, [height, theme, width]);

  // return (
  //   <canvas
  //     ref={canvasRef}
  //     className={styles.root}
  //     width={width}
  //     height={height}
  //   />
  // );
};

export default FancyNodesCanvas;
