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

  const [currentCoordinate, setCurrentCoordinate] = useState<number[]>([]);

  useEffect(() => {
    if (currentCoordinate.length !== 0) {
      passCoor(currentCoordinate);
    } else if (lastCoor) {
      passCoor(lastCoor);
    }
  }, [currentCoordinate, passCoor, lastCoor]);

  // initialize canvas rerendering when img loaded
  useEffect(() => {
    const canvas = canvasRef.current;
    if (currentCoordinate.length !== 0) return;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = 1000;
    canvas.height = 700;

    if (!ctx) return;

    ctx.lineCap = 'square';
    ctx.strokeStyle = '#eb4335';
    ctx.lineWidth = 3;

    ctxRef.current = ctx;

    const canvasOffset = canvas.getBoundingClientRect();
    canvasOffsetY.current = canvasOffset.top;
    canvasOffsetX.current = canvasOffset.left;

    if (lastCoor) {
      ctxRef.current.strokeRect(
        lastCoor[0],
        lastCoor[1],
        lastCoor[2],
        lastCoor[3]
      );
    }
  }, [width, height, lastCoor, currentCoordinate]);

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

    const mouseX = event.clientX - canvasOffsetX.current;
    const mouseY = event.clientY - canvasOffsetY.current;

    const canvas = canvasRef.current;
    if (!canvas) return;

    startX.current = (mouseX * canvas.width) / canvas.clientWidth;
    startY.current = (mouseY * canvas.height) / canvas.clientHeight;
    setIsDrawing(true);
  };

  const drawRectangle: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!isDrawing) return;

    event.preventDefault();
    event.stopPropagation();

    if (!canvasOffsetX.current || !canvasOffsetY.current) return;

    const newMouseX = event.clientX - canvasOffsetX.current;
    const newMouseY = event.clientY - canvasOffsetY.current;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const newCanvasX = (newMouseX * canvas.width) / canvas.clientWidth;
    const newCanvasY = (newMouseY * canvas.height) / canvas.clientHeight;

    if (!startX.current || !startY.current) return;

    const rectWidth = newCanvasX - startX.current;
    const rectHeight = newCanvasY - startY.current;

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
    <div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={className}
        onMouseMove={drawRectangle}
        onMouseDown={startDrawingHandler}
        onMouseUp={stopDrawingHandler}
        onMouseLeave={stopDrawingHandler}
      ></canvas>
    </div>
  );
};

export default Canvas;
