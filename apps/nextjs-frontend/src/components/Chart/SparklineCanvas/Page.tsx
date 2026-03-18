import { useEffect, useRef } from "react";

type SparkProps = {
  data: number[];                 // 例如 token.cmc_m_arr
  width?: number;                 // 画布 CSS 宽度（像素）
  height?: number;                // 画布 CSS 高度（像素）
  color?: string;                 // 线色
  lineWidth?: number;             // 线宽（CSS 像素）
  bg?: string;                    // 背景色，可选
};

export function SparklineCanvas({
  data,
  width = 120,
  height = 24,
  color = "#16a34a",             // 绿
  lineWidth = 1,
  bg = "transparent",
}: SparkProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;

    const dpr = window.devicePixelRatio || 1;
    // 物理像素放大，CSS 尺寸不变，保证高 DPI 清晰
    cvs.width = Math.max(1, Math.round(width * dpr));
    cvs.height = Math.max(1, Math.round(height * dpr));
    cvs.style.width = `${width}px`;
    cvs.style.height = `${height}px`;

    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    // 预处理数据
    const values = (data ?? []).map(Number).filter(Number.isFinite);
    const n = values.length;
    if (n === 0) {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      return;
    }

    // 1px/列的最大点数，超出则按步长抽样，避免过密
    const maxPoints = Math.max(2, width);
    let pts = values;
    if (n > maxPoints) {
      const step = n / maxPoints;
      pts = Array.from({ length: maxPoints }, (_, i) => values[Math.floor(i * step)]);
    }

    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const range = max - min || 1;

    ctx.save();
    ctx.scale(dpr, dpr);
    // 背景
    if (bg !== "transparent") {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    // 画线
    const xStep = (width - 1) / (pts.length - 1 || 1);
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;

    // 半像素对齐，保证 1px 线更锐利
    ctx.translate(0.5, 0.5);

    pts.forEach((v, i) => {
      const x = i * xStep;
      const y = (height - 1) - ((v - min) / range) * (height - 1);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
    ctx.restore();
  }, [data, width, height, color, lineWidth, bg]);

  return <canvas ref={ref} />;
}
