import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { type AirConditioner } from '../utils/firebaseService';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import StarIcon from '@mui/icons-material/Star';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

interface DashboardViewProps {
  data: AirConditioner[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState<{ id: string; val: number; label: string; x: number; y: number } | null>(null);

  if (data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'var(--text)' }}>
          No hay datos disponibles para mostrar en el Dashboard.
        </Typography>
      </Box>
    );
  }

  // --- 1. KPI Calculations ---
  const totalModels = data.length;
  const avgPrice = data.reduce((sum, item) => sum + item.price, 0) / totalModels;
  
  const modelsWithStars = data.filter(item => item.star > 0);
  const avgRating = modelsWithStars.length > 0 
    ? modelsWithStars.reduce((sum, item) => sum + item.star, 0) / modelsWithStars.length 
    : 0;

  const avgNoise = data.reduce((sum, item) => sum + item.noiseLevel, 0) / totalModels;
  
  const copperCount = data.filter(item => item.condenserCoil === 'Copper').length;
  const copperShare = (copperCount / totalModels) * 100;

  // Find most common brand
  const brandCounts: { [key: string]: number } = {};
  data.forEach(item => {
    brandCounts[item.brand] = (brandCounts[item.brand] || 0) + 1;
  });
  let topBrand = 'N/A';
  let maxBrandCount = 0;
  Object.entries(brandCounts).forEach(([brand, count]) => {
    if (count > maxBrandCount) {
      maxBrandCount = count;
      topBrand = brand;
    }
  });

  const formatRupees = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // --- 2. Chart Data Preparation ---
  
  // Brand Chart (Top 8 Brands)
  const brandChartData = Object.entries(brandCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Price Histogram Data
  // Ranges: <25k, 25k-30k, 30k-35k, 35k-40k, 40k-45k, 45k-50k, 50k+
  const priceBins = [
    { label: '<25k', min: 0, max: 24999, count: 0 },
    { label: '25k-30k', min: 25000, max: 29999, count: 0 },
    { label: '30k-35k', min: 30000, max: 34999, count: 0 },
    { label: '35k-40k', min: 35000, max: 39999, count: 0 },
    { label: '40k-45k', min: 40000, max: 44999, count: 0 },
    { label: '45k-50k', min: 45000, max: 49999, count: 0 },
    { label: '50k+', min: 50000, max: 1000000, count: 0 },
  ];
  data.forEach(item => {
    for (const bin of priceBins) {
      if (item.price >= bin.min && item.price <= bin.max) {
        bin.count++;
        break;
      }
    }
  });

  // Condenser Coil Pie Data
  const coilCounts = { Copper: 0, Alloy: 0 };
  data.forEach(item => {
    if (item.condenserCoil === 'Copper') coilCounts.Copper++;
    else coilCounts.Alloy++;
  });
  const coilData = [
    { name: 'Cobre', value: coilCounts.Copper, color: 'var(--accent)' },
    { name: 'Aleación', value: coilCounts.Alloy, color: '#38bdf8' },
  ];

  // Refrigerant Pie Data
  const refrigerantCounts: { [key: string]: number } = {};
  data.forEach(item => {
    refrigerantCounts[item.refrigerant] = (refrigerantCounts[item.refrigerant] || 0) + 1;
  });
  const refrigerantData = Object.entries(refrigerantCounts)
    .map(([name, value], idx) => {
      const colors = ['#818cf8', '#34d399', '#fb7185', '#fbbf24'];
      return {
        name,
        value,
        color: colors[idx % colors.length]
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return (
    <Box sx={{ flexGrow: 1, p: 1 }}>
      {/* KPI Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Metric 1 */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Card className="kpi-card" sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'var(--text)', fontWeight: '500' }}>Modelos</Typography>
                <AcUnitIcon sx={{ color: 'var(--accent)' }} />
              </Box>
              <Typography variant="h4" sx={{ color: 'var(--text-h)', fontWeight: '800' }}>{totalModels}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--text)' }}>Equipos en base de datos</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Metric 2 */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Card className="kpi-card" sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'var(--text)', fontWeight: '500' }}>Precio Promedio</Typography>
                <LocalAtmIcon sx={{ color: '#10b981' }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'var(--text-h)', whiteSpace: 'nowrap', fontWeight: '800' }}>
                {formatRupees(avgPrice)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text)' }}>Costo medio registrado</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Metric 3 */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Card className="kpi-card" sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'var(--text)', fontWeight: '500' }}>Valoración Media</Typography>
                <StarIcon sx={{ color: '#f59e0b' }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'var(--text-h)', fontWeight: '800' }}>
                {avgRating.toFixed(1)} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>★</span>
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text)' }}>Opinión de usuarios</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Metric 4 */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Card className="kpi-card" sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'var(--text)', fontWeight: '500' }}>Nivel de Ruido</Typography>
                <VolumeUpIcon sx={{ color: '#ef4444' }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'var(--text-h)', fontWeight: '800' }}>
                {avgNoise.toFixed(0)} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>dB</span>
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text)' }}>Nivel promedio silencioso</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Metric 5 */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.8 }}>
          <Card className="kpi-card" sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'var(--text)', fontWeight: '500' }}>Detalles de Calidad</Typography>
                <SettingsSuggestIcon sx={{ color: '#06b6d4' }} />
              </Box>
              <Typography variant="h6" sx={{ color: 'var(--text-h)', display: 'flex', gap: 1, alignItems: 'baseline', fontWeight: '800' }}>
                <span>{copperShare.toFixed(0)}%</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text)' }}>Cobre</span>
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text)', whiteSpace: 'nowrap' }}>
                Líder en ventas: <strong>{topBrand}</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Chart 1: Brand Distribution (SVG Bar Chart) */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--text-h)', mb: 2, fontWeight: '700' }}>
                Modelos por Marca (Top 8)
              </Typography>
              <Box sx={{ position: 'relative', width: '100%', height: 260 }}>
                <svg width="100%" height="100%" viewBox="0 0 500 240" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                    const yVal = 200 - ratio * 160;
                    const maxVal = Math.max(...brandChartData.map(d => d.value));
                    const gridLabel = Math.round(ratio * maxVal);
                    return (
                      <g key={index}>
                        <line x1="50" y1={yVal} x2="480" y2={yVal} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        <text x="40" y={yVal + 4} fill="var(--text)" fontSize="10" textAnchor="end">{gridLabel}</text>
                      </g>
                    );
                  })}
                  {/* Axis */}
                  <line x1="50" y1="200" x2="480" y2="200" stroke="var(--border)" strokeWidth="1" />
                  <line x1="50" y1="40" x2="50" y2="200" stroke="var(--border)" strokeWidth="1" />

                  {/* Bars */}
                  {brandChartData.map((d, index) => {
                    const maxVal = Math.max(...brandChartData.map(item => item.value));
                    const x = 60 + index * 52;
                    const barHeight = maxVal > 0 ? (d.value / maxVal) * 160 : 0;
                    const y = 200 - barHeight;
                    const width = 32;

                    const isHovered = hoveredBar?.id === `brand-${index}`;

                    return (
                      <g key={index}>
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={barHeight}
                          rx="4"
                          fill={isHovered ? 'var(--accent)' : 'url(#barGradient)'}
                          opacity={isHovered ? 1 : 0.85}
                          style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredBar({
                              id: `brand-${index}`,
                              val: d.value,
                              label: d.name,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 10,
                            });
                          }}
                          onMouseLeave={() => setHoveredBar(null)}
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
                        {/* Value inside/above bar */}
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
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </svg>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart 2: Price Histogram (SVG Bar Chart) */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--text-h)', mb: 2, fontWeight: '700' }}>
                Distribución por Rangos de Precios
              </Typography>
              <Box sx={{ width: '100%', height: 260 }}>
                <svg width="100%" height="100%" viewBox="0 0 400 240" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                    const yVal = 200 - ratio * 160;
                    const maxVal = Math.max(...priceBins.map(d => d.count));
                    const gridLabel = Math.round(ratio * maxVal);
                    return (
                      <g key={index}>
                        <line x1="45" y1={yVal} x2="380" y2={yVal} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        <text x="35" y={yVal + 3} fill="var(--text)" fontSize="10" textAnchor="end">{gridLabel}</text>
                      </g>
                    );
                  })}
                  {/* Axis */}
                  <line x1="45" y1="200" x2="380" y2="200" stroke="var(--border)" strokeWidth="1" />
                  <line x1="45" y1="40" x2="45" y2="200" stroke="var(--border)" strokeWidth="1" />

                  {/* Bars */}
                  {priceBins.map((bin, index) => {
                    const maxVal = Math.max(...priceBins.map(item => item.count));
                    const x = 55 + index * 45;
                    const barHeight = maxVal > 0 ? (bin.count / maxVal) * 160 : 0;
                    const y = 200 - barHeight;
                    const width = 28;

                    const isHovered = hoveredBar?.id === `price-${index}`;

                    return (
                      <g key={index}>
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={barHeight}
                          rx="4"
                          fill={isHovered ? '#10b981' : 'url(#greenGradient)'}
                          opacity={isHovered ? 1 : 0.85}
                          style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredBar({
                              id: `price-${index}`,
                              val: bin.count,
                              label: `Rango: ${bin.label}`,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 10,
                            });
                          }}
                          onMouseLeave={() => setHoveredBar(null)}
                        />
                        <text
                          x={x + width / 2}
                          y="215"
                          fill="var(--text)"
                          fontSize="8.5"
                          fontWeight="500"
                          textAnchor="middle"
                          transform={`rotate(-25, ${x + width / 2}, 215)`}
                        >
                          {bin.label}
                        </text>
                        {bin.count > 0 && (
                          <text
                            x={x + width / 2}
                            y={y - 5}
                            fill="var(--text-h)"
                            fontSize="9"
                            fontWeight="700"
                            textAnchor="middle"
                          >
                            {bin.count}
                          </text>
                        )}
                      </g>
                    );
                  })}
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pie Charts Grid */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Chart 3: Condenser Coil Share (SVG Donut Chart) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--text-h)', width: '100%', mb: 2, fontWeight: '700' }}>
                Bobina del Condensador
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 4, height: 180 }}>
                {/* SVG Donut */}
                <Box sx={{ width: 140, height: 140 }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border)" strokeWidth="12" />
                    {(() => {
                      const total = coilData.reduce((acc, curr) => acc + curr.value, 0);
                      // Pre-calculate offsets to avoid mutating variables inside map
                      const slices = coilData.reduce<{ dashArray: string; dashOffset: number; color: string }[]>(
                        (acc, d) => {
                          const prevAngle = acc.length > 0
                            ? acc.reduce((sum, s) => sum + parseFloat(s.dashArray.split(' ')[0]), 0)
                            : 0;
                          const startAngle = -90 + (prevAngle / 251.2) * 360;
                          const percentage = total > 0 ? d.value / total : 0;
                          const dashArray = `${percentage * 251.2} 251.2`;
                          const dashOffset = -(startAngle) * (251.2 / 360);
                          return [...acc, { dashArray, dashOffset, color: d.color }];
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
                    {/* Inner hole labels */}
                    <circle cx="50" cy="50" r="28" fill="var(--code-bg)" />
                    <text x="50" y="47" textAnchor="middle" fill="var(--text)" fontSize="7" fontWeight="500">TOTAL</text>
                    <text x="50" y="58" textAnchor="middle" fill="var(--text-h)" fontSize="11" fontWeight="800">{totalModels}</text>
                  </svg>
                </Box>
                {/* Legend */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {coilData.map((d, index) => {
                    const total = coilData.reduce((acc, curr) => acc + curr.value, 0);
                    const pct = total > 0 ? (d.value / total) * 100 : 0;
                    return (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: '4px', backgroundColor: d.color }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: 'var(--text-h)', lineHeight: 1.1, fontWeight: '600' }}>
                            {d.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'var(--text)' }}>
                            {d.value} modelos ({pct.toFixed(1)}%)
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart 4: Refrigerant Type Distribution (SVG Donut Chart) */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ color: 'var(--text-h)', width: '100%', mb: 2, fontWeight: '700' }}>
                Tipos de Gas Refrigerante
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 4, height: 180 }}>
                {/* SVG Donut */}
                <Box sx={{ width: 140, height: 140 }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border)" strokeWidth="12" />
                    {(() => {
                      const total = refrigerantData.reduce((acc, curr) => acc + curr.value, 0);
                      // Pre-calculate offsets to avoid mutating variables inside map
                      const slices = refrigerantData.reduce<{ dashArray: string; dashOffset: number; color: string }[]>(
                        (acc, d) => {
                          const prevAngle = acc.length > 0
                            ? acc.reduce((sum, s) => sum + parseFloat(s.dashArray.split(' ')[0]), 0)
                            : 0;
                          const startAngle = -90 + (prevAngle / 251.2) * 360;
                          const percentage = total > 0 ? d.value / total : 0;
                          const dashArray = `${percentage * 251.2} 251.2`;
                          const dashOffset = -(startAngle) * (251.2 / 360);
                          return [...acc, { dashArray, dashOffset, color: d.color }];
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
                    <text x="50" y="47" textAnchor="middle" fill="var(--text)" fontSize="7" fontWeight="500">MUESTRA</text>
                    <text x="50" y="58" textAnchor="middle" fill="var(--text-h)" fontSize="11" fontWeight="800">
                      {refrigerantData.reduce((acc, curr) => acc + curr.value, 0)}
                    </text>
                  </svg>
                </Box>
                {/* Legend */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {refrigerantData.map((d, index) => {
                    const total = refrigerantData.reduce((acc, curr) => acc + curr.value, 0);
                    const pct = total > 0 ? (d.value / total) * 100 : 0;
                    return (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: '4px', backgroundColor: d.color }} />
                        <Box>
                          <Typography variant="body2" sx={{ color: 'var(--text-h)', lineHeight: 1.1, fontWeight: '600' }}>
                            {d.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'var(--text)' }}>
                            {d.value} acs ({pct.toFixed(0)}%)
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Tooltip for Custom SVG Charts */}
      {hoveredBar && (
        <Box
          sx={{
            position: 'fixed',
            left: hoveredBar.x,
            top: hoveredBar.y,
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
            }
          }}
        >
          <div>{hoveredBar.label}</div>
          <div style={{ color: 'var(--accent)', marginTop: '2px', fontWeight: '700', fontSize: '0.8rem' }}>
            Modelos: {hoveredBar.val}
          </div>
        </Box>
      )}
    </Box>
  );
};
