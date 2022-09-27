import { useState, useRef, useEffect } from 'react';
import { start } from 'repl';

import styles from './Canvas.module.scss';

type CanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const Canvas: React.FC<CanvasProps> = (props) => {
  const { width, height } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const canvasOffsetX = useRef<number | null>(null);
  const canvasOffsetY = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.strokeStyle = '#eb4335';
    ctx.lineWidth = 5;

    ctxRef.current = ctx;

    const canvasOffset = canvas.getBoundingClientRect();
    canvasOffsetY.current = canvasOffset.top;
    canvasOffsetX.current = canvasOffset.left;
  }, []);

  const startDrawingHandler: React.MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!canvasOffsetX.current || !canvasOffsetY.current) return;

    startX.current = event.clientX - canvasOffsetX.current;
    startY.current = event.clientY - canvasOffsetY.current;

    setIsDrawing(true);
  };

  const drawRectangle: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!isDrawing) return;

    event.preventDefault();
    event.stopPropagation();

    if (!canvasOffsetX.current || !canvasOffsetY.current) return;

    const newMouseX = event.clientX - canvasOffsetX.current;
    const newMouseY = event.clientY - canvasOffsetY.current;

    if (!startX.current || !startY.current) return;

    const rectWidth = newMouseX - startX.current;
    const rectHeight = newMouseY - startY.current;

    if (!ctxRef.current || !canvasRef.current) return;

    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    ctxRef.current.strokeRect(
      startX.current,
      startY.current,
      rectWidth,
      rectHeight
    );
  };

  const stopDrawingHandler = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      onMouseMove={drawRectangle}
      onMouseDown={startDrawingHandler}
      onMouseUp={stopDrawingHandler}
      onMouseLeave={stopDrawingHandler}
    ></canvas>
  );
};

export default Canvas;
