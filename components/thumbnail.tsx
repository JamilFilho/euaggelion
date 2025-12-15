"use client";

import { useEffect, useRef, useState } from "react";

interface ThumbnailGradientProps {
  colors?: string[];
  backgroundColor?: string;
  blurAmount?: number;
  noiseAmount?: number;
  contrastAmount?: number;
  saturationAmount?: number;
  className?: string;
  randomize?: boolean;
}

export function ThumbnailGradient({
  colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"],
  backgroundColor = "#f8fafc",
  blurAmount = 125,
  noiseAmount = 0.3,
  contrastAmount = 130,
  saturationAmount = 110,
  className = "",
  randomize = false,
}: ThumbnailGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Observa o tamanho do container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      setDimensions({
        width: rect.width || 800,
        height: rect.height || 600,
      });
    };

    // Atualiza dimensões inicialmente
    updateDimensions();

    // Observa mudanças de tamanho
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = dimensions;

    // Função para normalizar cores hex
    const normalizeHexColor = (hex: string): string => {
      let cleanHex = hex.replace("#", "");

      if (/^[0-9A-Fa-f]{3}$/.test(cleanHex)) {
        cleanHex = cleanHex
          .split("")
          .map((char) => char + char)
          .join("");
      }

      if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
        return "#000000";
      }

      return "#" + cleanHex;
    };

    // Função para converter hex para rgba
    const hexToRgba = (hex: string, alpha: number = 1) => {
      const normalizedHex = normalizeHexColor(hex);
      const r = parseInt(normalizedHex.slice(1, 3), 16);
      const g = parseInt(normalizedHex.slice(3, 5), 16);
      const b = parseInt(normalizedHex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Função para gerar ruído
    const generateNoise = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      alpha: number = 0.03
    ) => {
      const imageData = ctx.getImageData(0, 0, width, height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        let noise = Math.random() * 255 * alpha;
        imageData.data[i] += noise;
        imageData.data[i + 1] += noise;
        imageData.data[i + 2] += noise;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    // Limpar canvas
    const normalizedBgColor = normalizeHexColor(backgroundColor);
    ctx.fillStyle = normalizedBgColor;
    ctx.fillRect(0, 0, width, height);

    // Gerar gradientes
    colors.forEach((color) => {
      const normalizedColor = normalizeHexColor(color);

      let x, y;
      if (randomize) {
        x = Math.random() * width;
        y = Math.random() * height;
      } else {
        x = width / 2;
        y = height / 2;
      }

      const scaleFactor = randomize ? 1.2 : 1.2;
      const endRadius = randomize
        ? (Math.random() * scaleFactor + scaleFactor) *
          Math.min(width, height)
        : Math.max(width, height) * scaleFactor;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, endRadius);
      gradient.addColorStop(0, normalizedColor);
      gradient.addColorStop(0.8, hexToRgba(normalizedColor, 0.2));
      gradient.addColorStop(1, hexToRgba(normalizedColor, 0));
      ctx.fillStyle = gradient;

      // Criar blob irregular
      const path = new Path2D();
      const numPoints = 5 + Math.floor(Math.random() * 5);
      let points = [];

      for (let i = 0; i < numPoints; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radiusVariance = 0.3 + Math.random() * 0.7;
        const pointRadius = endRadius * radiusVariance;
        points.push({
          x: x + pointRadius * Math.cos(angle),
          y: y + pointRadius * Math.sin(angle),
        });
      }

      path.moveTo(points[0].x, points[0].y);

      for (let i = 0; i < points.length; i++) {
        const nextIndex = (i + 1) % points.length;
        const nextPoint = points[nextIndex];
        const cp1 = {
          x: (points[i].x + nextPoint.x) / 2,
          y: (points[i].y + nextPoint.y) / 2,
        };
        const cp2 = {
          x: cp1.x + (Math.random() - 0.5) * endRadius,
          y: cp1.y + (Math.random() - 0.5) * endRadius,
        };
        path.quadraticCurveTo(cp2.x, cp2.y, nextPoint.x, nextPoint.y);
      }

      path.closePath();
      ctx.fill(path);
      ctx.filter = `blur(${blurAmount}px)`;
    });

    // Aplicar filtros
    ctx.filter = `blur(${blurAmount}px)`;
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = `contrast(${contrastAmount}%) saturate(${saturationAmount}%)`;
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = `blur(${blurAmount / 2}px)`;
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = "none";

    // Adicionar ruído
    generateNoise(ctx, width, height, noiseAmount);
  }, [
    dimensions,
    colors,
    backgroundColor,
    blurAmount,
    noiseAmount,
    contrastAmount,
    saturationAmount,
    randomize,
  ]);

  return (
    <div 
      ref={containerRef}
      className={className} 
      style={{ 
        position: "relative",
        borderRadius: ".5rem",
        overflow: "hidden"
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          width: "100%",
          height: "100%",
          display: "block"
        }}
      />
    </div>
  );
}