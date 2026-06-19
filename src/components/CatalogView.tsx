import React, { useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Checkbox,
  FormControlLabel,
  Pagination,
  Rating,
  IconButton,
  Chip,
} from '@mui/material';
import { type SelectChangeEvent } from '@mui/material/Select';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import { type AirConditioner } from '../utils/firebaseService';

import SelectorUI from './common/SelectorUI';
import AlertUI from './common/AlertUI';
import GridUI from './common/GridUI';

interface CatalogViewProps {
  data: AirConditioner[];
  selectedToCompare: number[];
  toggleCompare: (id: number) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  data,
  selectedToCompare,
  toggleCompare,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('rating-desc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Sorting logic
  const sortedData = [...data].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-desc':
        return b.star - a.star;
      case 'noise-asc':
        return a.noiseLevel - b.noiseLevel;
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    const element = document.getElementById('catalog-top');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handlePageSizeChange = (e: SelectChangeEvent<number>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const formatRupees = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60';
  };

  return (
    <Box id="catalog-top" sx={{ p: 1 }}>
      {/* Controls Bar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          mb: 3,
          p: 2,
          backgroundColor: 'var(--code-bg)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'var(--text)' }}>
            Encontrados: <strong>{data.length}</strong> aires acondicionados
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {/* Sorting Selector with onChange event */}
          <SelectorUI
            label="Ordenar por"
            value={sortBy}
            onChange={handleSortChange}
            options={[
              { value: 'rating-desc', label: 'Mejor Calificados' },
              { value: 'price-asc', label: 'Precio: Menor a Mayor' },
              { value: 'price-desc', label: 'Precio: Mayor a Menor' },
              { value: 'noise-asc', label: 'Nivel de Ruido: Silenciosos' },
            ]}
            id="sort"
          />

          {/* Page Size Selector with onChange event */}
          <SelectorUI
            label="Ver"
            value={pageSize}
            onChange={handlePageSizeChange}
            options={[
              { value: 12, label: '12' },
              { value: 24, label: '24' },
              { value: 48, label: '48' },
            ]}
            id="size"
            minWidth={90}
          />

          {/* View Toggle */}
          <Box sx={{ display: 'flex', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <IconButton
              size="small"
              onClick={() => setViewMode('grid')}
              sx={{
                borderRadius: 0,
                backgroundColor: viewMode === 'grid' ? 'var(--accent-bg)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--accent)' : 'var(--text)',
                '&:hover': { backgroundColor: 'var(--accent-bg)' }
              }}
              aria-label="Vista cuadrícula"
            >
              <GridViewIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('list')}
              sx={{
                borderRadius: 0,
                backgroundColor: viewMode === 'list' ? 'var(--accent-bg)' : 'transparent',
                color: viewMode === 'list' ? 'var(--accent)' : 'var(--text)',
                '&:hover': { backgroundColor: 'var(--accent-bg)' }
              }}
              aria-label="Vista lista"
            >
              <ViewListIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Product Comparison Sticky Alert using AlertUI */}
      {selectedToCompare.length > 0 && (
        <AlertUI
          severity="warning"
          sx={{ mb: 3 }}
          message={
            <span>
              Tienes <strong>{selectedToCompare.length}</strong> producto(s) seleccionados para comparar (máximo 3).
            </span>
          }
        />
      )}

      {/* Catalog Items */}
      {paginatedData.length === 0 ? (
        <AlertUI
          severity="info"
          message="Ningún aire acondicionado coincide con los filtros aplicados."
        />
      ) : viewMode === 'grid' ? (
        <GridUI.Container spacing={3}>
          {paginatedData.map((item) => {
            const isSelected = selectedToCompare.includes(item.id);
            const isCompareDisabled = !isSelected && selectedToCompare.length >= 3;
            const isHighRated = item.star >= 4.3;

            return (
              <GridUI.Item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <Card
                  className="product-card"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    borderRadius: '16px',
                    backgroundColor: 'var(--code-bg)',
                    border: '1px solid var(--border)',
                    boxShadow: 'none',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: 'var(--accent)',
                      boxShadow: 'var(--shadow)',
                    },
                  }}
                >
                  {/* High Rated Badge */}
                  {isHighRated && (
                    <Chip
                      label="Recomendado"
                      color="secondary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        zIndex: 2,
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        backgroundColor: 'var(--accent)',
                      }}
                    />
                  )}

                  {/* Compare Selection Checkbox with onChange */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      borderRadius: '8px',
                      padding: '2px 8px 2px 2px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isSelected}
                          disabled={isCompareDisabled}
                          onChange={() => toggleCompare(item.id)}
                          size="small"
                          sx={{ color: 'var(--accent)', '&.Mui-checked': { color: 'var(--accent)' } }}
                        />
                      }
                      label={
                        <Typography variant="caption" sx={{ fontWeight: '700', color: '#0f172a' }}>
                          Comparar
                        </Typography>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>

                  {/* Product Image */}
                  <Box sx={{ position: 'relative', pt: '75%', overflow: 'hidden', backgroundColor: '#fff', borderBottom: '1px solid var(--border)' }}>
                    <CardMedia
                      component="img"
                      image={item.imageUrl}
                      alt={item.brand}
                      onError={handleImageError}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        p: 1.5,
                      }}
                    />
                  </Box>

                  {/* Product Info */}
                  <CardContent sx={{ flexGrow: 1, p: 2, pb: 1.5 }}>
                    <Typography variant="caption" sx={{ color: 'var(--text)', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      {item.brand.toUpperCase()} • {item.ton} TON
                    </Typography>
                    
                    <Typography variant="subtitle1" sx={{ color: 'var(--text-h)', minHeight: '48px', lineHeight: 1.25, mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontWeight: '700' }}>
                      {item.brand} Inverter {item.ton} Ton {item.condenserCoil === 'Copper' ? 'Cobre' : 'Aleación'}
                    </Typography>

                    {/* Stars and Reviews */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                      <Rating value={item.star} readOnly precision={0.1} size="small" sx={{ color: '#ffb703' }} />
                      <Typography variant="caption" sx={{ color: 'var(--text)', fontWeight: 600 }}>
                        {item.star > 0 ? item.star.toFixed(1) : 'Nuevo'}
                      </Typography>
                      {item.ratingsCount > 0 && (
                        <Typography variant="caption" sx={{ color: 'var(--text)', ml: 0.5 }}>
                          ({item.ratingsCount})
                        </Typography>
                      )}
                    </Box>

                    {/* Specs Pills */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5 }}>
                      <Chip
                        icon={<VolumeDownIcon style={{ fontSize: '0.9rem', color: 'inherit' }} />}
                        label={`${item.noiseLevel} dB`}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: '22px', backgroundColor: 'var(--border)', color: 'var(--text-h)' }}
                      />
                      <Chip
                        icon={<ElectricBoltIcon style={{ fontSize: '0.9rem', color: 'inherit' }} />}
                        label={item.powerConsumption.replace(' Power Consumption', '')}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: '22px', backgroundColor: 'var(--border)', color: 'var(--text-h)' }}
                      />
                      <Chip
                        label={item.refrigerant}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: '22px', backgroundColor: 'var(--border)', color: 'var(--text-h)' }}
                      />
                    </Box>
                  </CardContent>

                  {/* Product Price & Action */}
                  <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'var(--text)', display: 'block', mb: -0.5 }}>
                        Precio Final
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#10b981', fontWeight: '800' }}>
                        {formatRupees(item.price)}
                      </Typography>
                    </Box>
                  </CardActions>
                </Card>
              </GridUI.Item>
            );
          })}
        </GridUI.Container>
      ) : (
        /* List Mode View using GridUI wrapper if needed */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {paginatedData.map((item) => {
            const isSelected = selectedToCompare.includes(item.id);
            const isCompareDisabled = !isSelected && selectedToCompare.length >= 3;

            return (
              <Card
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '12px',
                  backgroundColor: 'var(--code-bg)',
                  border: '1px solid var(--border)',
                  p: 1.5,
                  boxShadow: 'none',
                  position: 'relative',
                }}
              >
                {/* Checkbox with onChange */}
                <Box sx={{ mr: 1 }}>
                  <Checkbox
                    checked={isSelected}
                    disabled={isCompareDisabled}
                    onChange={() => toggleCompare(item.id)}
                    size="small"
                    sx={{ color: 'var(--accent)', '&.Mui-checked': { color: 'var(--accent)' } }}
                  />
                </Box>

                {/* Thumb Image */}
                <Box sx={{ width: 80, height: 60, minWidth: 80, mr: 2, backgroundColor: '#fff', borderRadius: '8px', p: 0.5, border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.brand}
                    onError={handleImageError}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </Box>

                {/* Technical details in columns */}
                <Box sx={{ flexGrow: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ minWidth: 200, flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'var(--text-h)', fontWeight: '700' }}>
                      {item.brand} Inverter {item.ton} Ton ({item.condenserCoil})
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating value={item.star} readOnly precision={0.1} size="small" sx={{ color: '#ffb703' }} />
                      <Typography variant="caption" sx={{ color: 'var(--text)', fontWeight: 600 }}>
                        {item.star.toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                      <Typography variant="caption" sx={{ color: 'var(--text)', display: 'block' }}>Ruido</Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-h)', fontWeight: '700' }}>{item.noiseLevel} dB</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                      <Typography variant="caption" sx={{ color: 'var(--text)', display: 'block' }}>Consumo</Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-h)', whiteSpace: 'nowrap', fontWeight: '700' }}>
                        {item.powerConsumption.replace(' Power Consumption', '')}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                      <Typography variant="caption" sx={{ color: 'var(--text)', display: 'block' }}>Gas</Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-h)', fontWeight: '700' }}>{item.refrigerant}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                    <Typography variant="caption" sx={{ color: 'var(--text)', display: 'block' }}>Precio</Typography>
                    <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: '800' }}>
                      {formatRupees(item.price)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'var(--text-h)',
                borderColor: 'var(--border)',
                '&.Mui-selected': {
                  backgroundColor: 'var(--accent-bg)',
                  color: 'var(--accent)',
                  fontWeight: '700',
                  border: '1px solid var(--accent-border)',
                },
                '&:hover': {
                  backgroundColor: 'var(--accent-bg)',
                }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};
