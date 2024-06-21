import React, { useRef, useState, useEffect, MouseEvent } from "react";
import { Button, Flex, Modal, Typography } from "antd";

interface Point {
  x: number;
  y: number;
}

interface BoundingBoxData {
  startPoint: Point;
  endPoint: Point;
  imageSize: { width: number; height: number };
}

interface ImgMapFixtureProps {
  imageUrl: string;
  onBoundingBoxComplete: (data: BoundingBoxData) => void;
  initialBoundingBox?: BoundingBoxData;
  modalClosed: any;
  isOpen: boolean;
}

const ImgMapFixture: React.FC<ImgMapFixtureProps> = ({
  imageUrl,
  onBoundingBoxComplete,
  initialBoundingBox,
  modalClosed,
  isOpen,
}) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<Point>({ x: 0, y: 0 });
  const [endPoint, setEndPoint] = useState<Point>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const modalWidth = 640; // Set your desired modal width
  const modalHeight = 480; // Set your desired modal height

  const drawInitialBoundingBox = (ctx: CanvasRenderingContext2D) => {
    if (!initialBoundingBox) {
      return;
    }
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      initialBoundingBox.startPoint.x,
      initialBoundingBox.startPoint.y,
      initialBoundingBox.endPoint.x - initialBoundingBox.startPoint.x,
      initialBoundingBox.endPoint.y - initialBoundingBox.startPoint.y
    );
  };

  useEffect(() => {
    if (canvasRef.current && imageRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      const img = imageRef.current;
      if (ctx && img) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        const aspectRatio = img.width / img.height;
        let drawWidth = modalWidth;
        let drawHeight = modalHeight;

        if (aspectRatio > 1) {
          drawHeight = modalWidth / aspectRatio;
        } else {
          drawWidth = modalHeight * aspectRatio;
        }

        canvasRef.current.width = drawWidth;
        canvasRef.current.height = drawHeight;

        ctx.drawImage(img, 0, 0, drawWidth, drawHeight);

        if (
          isDrawing ||
          startPoint.x !== 0 ||
          startPoint.y !== 0 ||
          endPoint.x !== 0 ||
          endPoint.y !== 0
        ) {
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.strokeRect(
            startPoint.x,
            startPoint.y,
            endPoint.x - startPoint.x,
            endPoint.y - startPoint.y
          );
        }
      }
    }
  }, [isDrawing, startPoint, endPoint, modalWidth, modalHeight]);

  useEffect(() => {
    if (!isOpen || !initialBoundingBox || !canvasRef) {
      return;
    }
    const canvas = canvasRef.current;

    const ctx = canvas!.getContext("2d");
    if (ctx) {
      drawInitialBoundingBox(ctx);
    }
  }, [isOpen, canvasRef]);

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = canvasRef.current!.getBoundingClientRect();
    setStartPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setEndPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    setEndPoint({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const onClickSave = () => {
    if (imageRef.current && canvasRef.current) {
      handleClearBoundingBox();
      onBoundingBoxComplete({
        startPoint,
        endPoint,
        imageSize: {
          width: canvasRef.current.width,
          height: canvasRef.current.height,
        },
      });
    }
  };

  const handleClearBoundingBox = () => {
    setStartPoint({ x: 0, y: 0 });
    setEndPoint({ x: 0, y: 0 });
  };

  return (
    <div>
      <Modal
        open={isOpen}
        footer={null}
        title={
          <Typography.Title level={4} style={{ margin: 0 }}>
            Locate Fixture
          </Typography.Title>
        }
        width={modalWidth + 50}
        onCancel={() => {
          handleClearBoundingBox();
          modalClosed();
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            marginTop: 16,
          }}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="To be annotated"
            style={{ display: "none" }}
            onLoad={() => {
              const canvas = canvasRef.current;
              const img = imageRef.current;
              if (canvas && img) {
                const aspectRatio = img.width / img.height;
                let drawWidth = modalWidth;
                let drawHeight = modalHeight;

                if (aspectRatio > 1) {
                  drawHeight = modalWidth / aspectRatio;
                } else {
                  drawWidth = modalHeight * aspectRatio;
                }

                canvas.width = drawWidth;
                canvas.height = drawHeight;

                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
                }
              }
            }}
          />
          <canvas
            ref={canvasRef}
            style={{ border: "1px solid #000" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>
        <Flex style={{ marginTop: 16 }}>
          <Button
            type="link"
            onClick={handleClearBoundingBox}
            style={{ marginTop: "10px", padding: 0 }}
          >
            Clear Bounding Box
          </Button>
          <Flex style={{ marginLeft: "auto" }} gap={16}>
            <Button
              type="default"
              onClick={() => {
                handleClearBoundingBox();
                modalClosed();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={startPoint.x == 0}
              type="primary"
              onClick={onClickSave}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </div>
  );
};

export default ImgMapFixture;
