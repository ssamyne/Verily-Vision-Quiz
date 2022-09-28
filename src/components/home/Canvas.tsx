import { useState, useRef, useEffect } from 'react';
interface CanvasProps {
  props: React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  >;
  isAllow: boolean;
  passCoor: (coordinate: number[]) => void;
  lastCoor: number[] | undefined;
}

const Canvas: React.FC<CanvasProps> = ({
  props,
  isAllow,
  passCoor,
  lastCoor,
}) => {
  const { className, width, height } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const canvasOffsetX = useRef<number | null>(null);
  const canvasOffsetY = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const [currentCoordinate, setCurrentCoordinate] = useState<number[]>(
    lastCoor ? lastCoor : []
  );

  useEffect(() => {
    passCoor(currentCoordinate);
  }, [currentCoordinate, passCoor]);

  // initialize canvas rerendering when img loaded
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (!ctx) return;

    ctx.lineCap = 'square';
    ctx.strokeStyle = '#eb4335';
    ctx.lineWidth = 3;

    ctxRef.current = ctx;

    const canvasOffset = canvas.getBoundingClientRect();
    canvasOffsetY.current = canvasOffset.top;
    canvasOffsetX.current = canvasOffset.left;
  }, [width, height]);

  const startDrawingHandler: React.MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    if (!isAllow) {
      setIsDrawing(false);
      return;
    }
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

    const lastCoordinate = [
      startX.current,
      startY.current,
      rectWidth,
      rectHeight,
    ];

    setCurrentCoordinate(lastCoordinate);
  };

  const stopDrawingHandler = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      onMouseMove={drawRectangle}
      onMouseDown={startDrawingHandler}
      onMouseUp={stopDrawingHandler}
      onMouseLeave={stopDrawingHandler}
    ></canvas>
  );
};

export default Canvas;
