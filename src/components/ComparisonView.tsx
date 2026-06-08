import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Rating,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import StarIcon from '@mui/icons-material/Star';
import { type AirConditioner } from '../utils/firebaseService';

interface ComparisonViewProps {
  selectedItems: AirConditioner[];
  removeCompare: (id: number) => void;
  goToCatalog: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  selectedItems,
  removeCompare,
  goToCatalog,
}) => {
  if (selectedItems.length === 0) {
    return (
      <Box sx={{ py: 8, px: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: 'var(--text-h)', mb: 2, fontWeight: '700' }}>
          Comparador Técnico
        </Typography>
        <Typography variant="body1" sx={{ color: 'var(--text)', mb: 4, maxWidth: 500, mx: 'auto' }}>
          No has seleccionado ningún aire acondicionado para comparar. Ve al Catálogo de productos y activa el checkbox "Comparar" en los modelos de tu interés.
        </Typography>
        <Button
          variant="contained"
          onClick={goToCatalog}
          startIcon={<ArrowBackIcon />}
          sx={{
            background: 'var(--accent)',
            borderRadius: '12px',
            textTransform: 'none',
            '&:hover': { background: 'var(--accent)', opacity: 0.9 }
          }}
        >
          Ir al Catálogo de Productos
        </Button>
      </Box>
    );
  }

  // Find the winning values (for highlights)
  const minPrice = Math.min(...selectedItems.map(item => item.price));
  const maxStar = Math.max(...selectedItems.map(item => item.star));
  const minNoise = Math.min(...selectedItems.map(item => item.noiseLevel));

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
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: 'var(--text-h)', fontWeight: '800' }}>
          Comparador Lado a Lado
        </Typography>
        <Button
          variant="outlined"
          onClick={goToCatalog}
          startIcon={<ArrowBackIcon />}
          sx={{
            borderColor: 'var(--border)',
            color: 'var(--text-h)',
            borderRadius: '10px',
            textTransform: 'none',
            '&:hover': { borderColor: 'var(--accent)' }
          }}
        >
          Agregar más productos
        </Button>
      </Box>

      <Grid container spacing={3}>
        {selectedItems.map((item) => {
          const isCheapest = item.price === minPrice && selectedItems.length > 1;
          const isBestRated = item.star === maxStar && selectedItems.length > 1 && item.star > 0;
          const isQuietest = item.noiseLevel === minNoise && selectedItems.length > 1;

          return (
            <Grid size={{ xs: 12, sm: selectedItems.length === 1 ? 12 : selectedItems.length === 2 ? 6 : 4 }} key={item.id}>
              <Card
                sx={{
                  backgroundColor: 'var(--code-bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  boxShadow: 'none',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {/* Delete Button */}
                <IconButton
                  onClick={() => removeCompare(item.id)}
                  sx={{
                    position: 'absolute',
                    top: -12,
                    right: -12,
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    '&:hover': { backgroundColor: '#dc2626' }
                  }}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                {/* Product Image */}
                <Box sx={{ height: 180, backgroundColor: '#fff', borderTopLeftRadius: '16px', borderTopRightRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, borderBottom: '1px solid var(--border)' }}>
                  <img
                    src={item.imageUrl}
                    alt={item.brand}
                    onError={handleImageError}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </Box>

                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="caption" sx={{ color: 'var(--text)', fontWeight: 600, display: 'block', mb: 0.5 }}>
                    {item.brand.toUpperCase()} • {item.ton} TON
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'var(--text-h)', minHeight: '60px', lineHeight: 1.2, mb: 2, fontWeight: '800' }}>
                    {item.brand} Inverter {item.ton} Ton
                  </Typography>

                  {/* Comparisons Matrix */}
                  <Table size="small" sx={{ '& td, & th': { borderBottom: '1px solid var(--border)', px: 0.5, py: 1.5 } }}>
                    <TableBody>
                      {/* Price Row */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: 'var(--text)' }}>Precio</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Typography variant="subtitle1" sx={{ color: isCheapest ? '#10b981' : 'var(--text-h)', fontWeight: '800' }}>
                              {formatRupees(item.price)}
                            </Typography>
                            {isCheapest && (
                              <LocalAtmIcon fontSize="small" sx={{ color: '#10b981' }} />
                            )}
                          </Box>
                          {isCheapest && (
                            <Typography variant="caption" sx={{ color: '#10b981', display: 'block', fontWeight: 600 }}>
                              ¡El precio más bajo!
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Ratings Row */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: 'var(--text)' }}>Calificación</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Rating value={item.star} readOnly precision={0.1} size="small" sx={{ color: '#ffb703' }} />
                              <Typography variant="body2" sx={{ color: isBestRated ? '#f59e0b' : 'var(--text-h)', fontWeight: '700' }}>
                                {item.star > 0 ? item.star.toFixed(1) : 'Nuevo'}
                              </Typography>
                              {isBestRated && (
                                <StarIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                              )}
                            </Box>
                            {item.ratingsCount > 0 && (
                              <Typography variant="caption" sx={{ color: 'var(--text)' }}>
                                {item.ratingsCount} opiniones
                              </Typography>
                            )}
                            {isBestRated && (
                              <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 600 }}>
                                ¡Mejor valorado!
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>

                      {/* Noise Level Row */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: 'var(--text)' }}>Nivel de Ruido</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ color: isQuietest ? '#06b6d4' : 'var(--text-h)', fontWeight: '700' }}>
                              {item.noiseLevel} dB
                            </Typography>
                            {isQuietest && (
                              <VolumeDownIcon fontSize="small" sx={{ color: '#06b6d4' }} />
                            )}
                          </Box>
                          {isQuietest && (
                            <Typography variant="caption" sx={{ color: '#06b6d4', display: 'block', fontWeight: 600 }}>
                              ¡El más silencioso!
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Condenser Coil Row */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: 'var(--text)' }}>Condensador</TableCell>
                        <TableCell align="right" sx={{ color: 'var(--text-h)', fontWeight: 500 }}>
                          {item.condenserCoil === 'Copper' ? 'Cobre (Copper)' : 'Aleación (Alloy)'}
                        </TableCell>
                      </TableRow>

                      {/* Refrigerant Row */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: 'var(--text)' }}>Gas Refrigerante</TableCell>
                        <TableCell align="right" sx={{ color: 'var(--text-h)', fontWeight: 500 }}>
                          {item.refrigerant}
                        </TableCell>
                      </TableRow>

                      {/* Power Consumption Row */}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: 'var(--text)' }}>Consumo Energía</TableCell>
                        <TableCell align="right" sx={{ color: 'var(--text-h)', fontWeight: 500 }}>
                          {item.powerConsumption}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
