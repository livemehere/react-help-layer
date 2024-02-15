import React, { FC, HTMLAttributes, useEffect, useRef } from "react";

type TDir = "top" | "left" | "right" | "bottom";
interface Props {
  steps: {
    selector: string;
    scene: number;
    label?: string;
    gap?: number;
    color?: string;
    labelDir?: TDir;
  }[];
  currentStep: number;
  onClick?: (e?: React.PointerEvent) => void;
  onShiftClick?: (e?: React.PointerEvent) => void;
  show: boolean;
  padding?: number;
}

export const HelpLayer: FC<Props & HTMLAttributes<HTMLCanvasElement>> = ({
  onShiftClick,
  show,
  steps,
  currentStep,
  onClick,
  padding = 4,
  style,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxStep = Math.max(...steps.map((s) => s.scene));
  const isOver = currentStep > maxStep;

  useEffect(() => {
    if (!show || isOver) return;
    const el = canvasRef.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let id: number;
    const { fontFamily, fontSize, fontWeight, color } = getComputedStyle(el);
    document.fonts.ready.then(() => {
      ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
    });

    const resize = () => {
      const stageWidth = window.innerWidth;
      const stageHeight = window.innerHeight;
      const dpr = window.devicePixelRatio > 1 ? 2 : 1;
      el.width = stageWidth * dpr;
      el.height = stageHeight * dpr;
      el.style.width = stageWidth + "px";
      el.style.height = stageHeight + "px";
      ctx.scale(dpr, dpr);
    };

    const drawAlphaRect = (x: number, y: number, w: number, h: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(x - padding, y - padding, w + padding * 2, h + padding * 2);
    };

    const writeText = (
      x: number,
      y: number,
      text: string,
      color: string,
      fontWeight: string,
      fontFamily: string,
      fontSize: string,
    ) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x, y);
    };

    const getTextPosition = (
      targetRect: DOMRect,
      gap: number,
      dir: TDir,
      text: string,
      fontSize: number,
    ) => {
      const x = targetRect.left + targetRect.width / 2;
      const y = targetRect.top + targetRect.height / 2;
      const textWidth = ctx.measureText(text).width;
      const textHeight = fontSize;
      switch (dir) {
        case "top":
          return {
            x: x,
            y: y - targetRect.height / 2 - gap - textHeight / 2 - padding,
          };
        case "left":
          return {
            x: x - targetRect.width / 2 - gap - textWidth / 2 - padding,
            y: y,
          };
        case "right":
          return {
            x: x + targetRect.width / 2 + gap + textWidth / 2 + padding,
            y,
          };
        case "bottom":
          return {
            x: x,
            y: y + targetRect.height / 2 + gap + textHeight / 2 + padding,
          };
      }
    };

    const isBlack = (color: string) => {
      return (
        color === "black" || color === "#000000" || color === "rgb(0, 0, 0)"
      );
    };

    const draw = () => {
      id = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, el.width, el.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, el.width, el.height);

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.scene !== currentStep) continue;
        const targets = document.querySelectorAll(step.selector);
        const len = targets.length;
        if (!len) {
          cancelAnimationFrame(id);
          throw new Error(`MaskLayer: selector not found: ${step.selector}`);
        }
        targets.forEach((target, index) => {
          const rect = target.getBoundingClientRect();
          drawAlphaRect(rect.left, rect.top, rect.width, rect.height);
          if (step.label && index === 0) {
            const { x, y } = getTextPosition(
              rect,
              step.gap ?? 20,
              step.labelDir ?? "bottom",
              step.label,
              parseInt(fontSize) || 0,
            );

            writeText(
              x,
              y,
              step.label,
              step.color ?? (isBlack(color) ? "white" : color),
              fontWeight,
              fontFamily,
              fontSize,
            );
          }
        });
      }
    };
    id = requestAnimationFrame(draw);

    /* scroll to first highlight element */
    const scrollTargets = steps.filter((step) => step.scene === currentStep);
    if (scrollTargets.length > 0) {
      const scrollTarget = scrollTargets[0];
      const targetEl = document.querySelector(scrollTarget.selector);
      targetEl?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(id);
    };
  }, [currentStep, steps, isOver, show]);

  if (!show || isOver) return null;
  return (
    <canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        cursor: "pointer",
        zIndex: 9999,
        ...style,
      }}
      ref={canvasRef}
      onPointerDown={(e) => {
        if (e.shiftKey) {
          onShiftClick?.(e);
        } else {
          onClick?.(e);
        }
      }}
      {...props}
    ></canvas>
  );
};
