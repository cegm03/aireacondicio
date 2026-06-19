import React from 'react';
import { Box, Typography } from '@mui/material';
import { type AirConditioner } from '../utils/firebaseService';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import StarIcon from '@mui/icons-material/Star';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

import GridUI from './common/GridUI';
import IndicatorUI from './common/IndicatorUI';
import ChartUI from './common/ChartUI';

interface DashboardViewProps {
  data: AirConditioner[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ data }) => {
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
  const priceChartData = priceBins.map(bin => ({
    name: bin.label,
    value: bin.count
  }));

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
      <GridUI.Container spacing={3} sx={{ mb: 4 }}>
        <GridUI.Item xs={12} sm={6} md={4} lg={2}>
          <IndicatorUI
            title="Modelos"
            value={totalModels}
            subtitle="Equipos en base de datos"
            icon={<AcUnitIcon sx={{ color: 'var(--accent)' }} />}
            accentColor="var(--accent)"
          />
        </GridUI.Item>

        <GridUI.Item xs={12} sm={6} md={4} lg={2.4}>
          <IndicatorUI
            title="Precio Promedio"
            value={formatRupees(avgPrice)}
            subtitle="Costo medio registrado"
            icon={<LocalAtmIcon sx={{ color: '#10b981' }} />}
            accentColor="#10b981"
          />
        </GridUI.Item>

        <GridUI.Item xs={12} sm={6} md={4} lg={2.4}>
          <IndicatorUI
            title="Valoración Media"
            value={
              <>
                {avgRating.toFixed(1)}{' '}
                <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>★</span>
              </>
            }
            subtitle="Opinión de usuarios"
            icon={<StarIcon sx={{ color: '#f59e0b' }} />}
            accentColor="#f59e0b"
          />
        </GridUI.Item>

        <GridUI.Item xs={12} sm={6} md={4} lg={2.4}>
          <IndicatorUI
            title="Nivel de Ruido"
            value={
              <>
                {avgNoise.toFixed(0)}{' '}
                <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>dB</span>
              </>
            }
            subtitle="Nivel promedio silencioso"
            icon={<VolumeUpIcon sx={{ color: '#ef4444' }} />}
            accentColor="#ef4444"
          />
        </GridUI.Item>

        <GridUI.Item xs={12} sm={6} md={4} lg={2.8}>
          <IndicatorUI
            title="Detalles de Calidad"
            value={
              <>
                <span>{copperShare.toFixed(0)}%</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text)' }}> Cobre</span>
              </>
            }
            subtitle={
              <>
                Líder en ventas: <strong>{topBrand}</strong>
              </>
            }
            icon={<SettingsSuggestIcon sx={{ color: '#06b6d4' }} />}
            accentColor="#06b6d4"
          />
        </GridUI.Item>
      </GridUI.Container>

      {/* Charts Grid */}
      <GridUI.Container spacing={3}>
        <GridUI.Item xs={12} md={7}>
          <Box className="MuiCard-root" sx={{ p: 3, borderRadius: '16px' }}>
            <ChartUI
              type="bar"
              title="Modelos por Marca (Top 8)"
              data={brandChartData}
              accentColor="var(--accent)"
            />
          </Box>
        </GridUI.Item>

        <GridUI.Item xs={12} md={5}>
          <Box className="MuiCard-root" sx={{ p: 3, borderRadius: '16px' }}>
            <ChartUI
              type="bar"
              title="Distribución por Rangos de Precios"
              data={priceChartData}
              accentColor="#10b981"
            />
          </Box>
        </GridUI.Item>
      </GridUI.Container>

      {/* Pie / Donut Charts Grid */}
      <GridUI.Container spacing={3} sx={{ mt: 1 }}>
        <GridUI.Item xs={12} md={6}>
          <Box className="MuiCard-root" sx={{ p: 3, borderRadius: '16px' }}>
            <ChartUI
              type="donut"
              title="Bobina del Condensador"
              data={coilData}
              totalLabel="TOTAL"
              totalValue={totalModels}
            />
          </Box>
        </GridUI.Item>

        <GridUI.Item xs={12} md={6}>
          <Box className="MuiCard-root" sx={{ p: 3, borderRadius: '16px' }}>
            <ChartUI
              type="donut"
              title="Tipos de Gas Refrigerante"
              data={refrigerantData}
              totalLabel="MUESTRA"
              totalValue={refrigerantData.reduce((acc, curr) => acc + curr.value, 0)}
            />
          </Box>
        </GridUI.Item>
      </GridUI.Container>
    </Box>
  );
};
