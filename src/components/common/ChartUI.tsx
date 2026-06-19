import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

export interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

interface ChartUIProps {
  type: 'bar' | 'donut';
  title?: string;
  data: ChartDataItem[];
  height?: number;
  accentColor?: string;
  valueLabel?: string;
  totalLabel?: string;
  totalValue?: number;
}

export const ChartUI: React.FC<ChartUIProps> = ({
  type,
  title,
  data,
  height = 260,
  accentColor = 'var(--accent)',
  valueLabel = 'Modelos',
  totalLabel = 'TOTAL',
  totalValue,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  if (data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
        <Typography variant="body2" sx={{ color: 'var(--text)' }}>
          No hay datos para mostrar en el gráfico
        </Typography>
      </Box>
    );
  }

  const handleMouseEnter = (index: number, event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredIndex(index);
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltipPos(null);
  };

  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {title && (
        <Typography variant="subtitle1" sx={{ color: 'var(--text-h)', mb: 2, fontWeight: '700' }}>
          {title}
        </Typography>
      )}

      {type === 'bar' ? (
        <Box sx={{ width: '100%', height }}>
          <svg width="100%" height="100%" viewBox="0 0 500 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`barGradient-${accentColor.replace(/[^\w]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const yVal = 200 - ratio * 160;
              const gridLabel = Math.round(ratio * maxVal);
              return (
                <g key={index}>
                  <line x1="50" y1={yVal} x2="480" y2={yVal} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
                  <text x="40" y={yVal + 4} fill="var(--text)" fontSize="10" textAnchor="end">
                    {gridLabel}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line x1="50" y1="200" x2="480" y2="200" stroke="var(--border)" strokeWidth="1" />
            <line x1="50" y1="40" x2="50" y2="200" stroke="var(--border)" strokeWidth="1" />

            {/* Bars */}
            {data.map((d, index) => {
              const totalItems = data.length;
              const barWidthRatio = 380 / totalItems;
              const width = Math.min(barWidthRatio - 12, 32);
              const spacing = (430 - 50) / totalItems;
              const x = 60 + index * spacing;
              const barHeight = (d.value / maxVal) * 160;
              const y = 200 - barHeight;

              const isHovered = hoveredIndex === index;

              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={barHeight}
                    rx="4"
                    fill={isHovered ? accentColor : `url(#barGradient-${accentColor.replace(/[^\w]/g, '')})`}
                    opacity={isHovered ? 1 : 0.85}
                    style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                    onMouseEnter={(e) => handleMouseEnter(index, e)}
                    onMouseLeave={handleMouseLeave}
                  />
                  <text
                    x={x + width / 2}
                    y="215"
                    fill="var(--text-h)"
                    fontSize="9.5"
                    fontWeight="500"
                    textAnchor="middle"
                    transform={`rotate(-15, ${x + width / 2}, 215)`}
                  >
                    {d.name}
                  </text>
                  {d.value > 0 && (
                    <text
                      x={x + width / 2}
                      y={y - 5}
                      fill="var(--text-h)"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {d.value}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 4, height: height - 60 }}>
          {/* SVG Donut */}
          <Box sx={{ width: 140, height: 140 }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border)" strokeWidth="12" />
              {(() => {
                const total = data.reduce((acc, curr) => acc + curr.value, 0);
                const slices = data.reduce<{ dashArray: string; dashOffset: number; color: string }[]>(
                  (acc, d) => {
                    const prevAngle = acc.length > 0
                      ? acc.reduce((sum, s) => sum + parseFloat(s.dashArray.split(' ')[0]), 0)
                      : 0;
                    const startAngle = -90 + (prevAngle / 251.2) * 360;
                    const percentage = total > 0 ? d.value / total : 0;
                    const dashArray = `${percentage * 251.2} 251.2`;
                    const dashOffset = -(startAngle) * (251.2 / 360);
                    return [...acc, { dashArray, dashOffset, color: d.color || accentColor }];
                  },
                  []
                );
                return slices.map((slice, index) => (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth="12"
                    strokeDasharray={slice.dashArray}
                    strokeDashoffset={slice.dashOffset}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-dasharray 0.5s ease',
                      transformOrigin: 'center',
                    }}
                  />
                ));
              })()}
              <circle cx="50" cy="50" r="28" fill="var(--code-bg)" />
              <text x="50" y="47" textAnchor="middle" fill="var(--text)" fontSize="7" fontWeight="500">
                {totalLabel}
              </text>
              <text x="50" y="58" textAnchor="middle" fill="var(--text-h)" fontSize="11" fontWeight="800">
                {totalValue ?? data.reduce((acc, curr) => acc + curr.value, 0)}
              </text>
            </svg>
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {data.map((d, index) => {
              const total = data.reduce((acc, curr) => acc + curr.value, 0);
              const pct = total > 0 ? (d.value / total) * 100 : 0;
              return (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ width: 14, height: 14, borderRadius: '4px', backgroundColor: d.color || accentColor }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'var(--text-h)', lineHeight: 1.1, fontWeight: '600' }}>
                      {d.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text)' }}>
                      {d.value} ({pct.toFixed(0)}%)
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Floating Tooltip for Custom SVG Charts */}
      {hoveredIndex !== null && tooltipPos && (
        <Box
          sx={{
            position: 'fixed',
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translate(-50%, -100%)',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            color: '#fff',
            px: 1.5,
            py: 0.8,
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: '600',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translate(-50%, 100%)',
              borderWidth: '5px',
              borderStyle: 'solid',
              borderColor: 'rgba(15, 23, 42, 0.95) transparent transparent transparent',
            },
          }}
        >
          <div>{data[hoveredIndex].name}</div>
          <div style={{ color: accentColor, marginTop: '2px', fontWeight: '700', fontSize: '0.8rem' }}>
            {valueLabel}: {data[hoveredIndex].value}
          </div>
        </Box>
      )}
    </Box>
  );
};

export default ChartUI;
