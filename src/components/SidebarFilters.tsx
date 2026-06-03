import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Slider,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Divider,
  Button,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';

export interface FilterState {
  search: string;
  brands: string[];
  tonnages: string[];
  coils: string[];
  minStar: number;
  priceRange: [number, number];
}

interface SidebarFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableBrands: string[];
  availableTonnages: string[];
  minMaxPrice: [number, number];
  totalCount: number;
  filteredCount: number;
  resetFilters: () => void;
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  filters,
  setFilters,
  availableBrands,
  availableTonnages,
  minMaxPrice,
  totalCount,
  filteredCount,
  resetFilters,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => {
      const isSelected = prev.brands.includes(brand);
      const newBrands = isSelected
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
  };

  const handleTonnageToggle = (ton: string) => {
    setFilters((prev) => {
      const isSelected = prev.tonnages.includes(ton);
      const newTonnages = isSelected
        ? prev.tonnages.filter((t) => t !== ton)
        : [...prev.tonnages, ton];
      return { ...prev, tonnages: newTonnages };
    });
  };

  const handleCoilToggle = (coil: string) => {
    setFilters((prev) => {
      const isSelected = prev.coils.includes(coil);
      const newCoils = isSelected
        ? prev.coils.filter((c) => c !== coil)
        : [...prev.coils, coil];
      return { ...prev, coils: newCoils };
    });
  };

  const handlePriceChange = (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: newValue as [number, number] }));
  };

  const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    setFilters((prev) => ({ ...prev, minStar: newValue || 0 }));
  };

  // Helper to format prices beautifully
  const formatRupees = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box className="filter-sidebar" sx={{ p: 2.5, height: '100%', boxSizing: 'border-box' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: 'var(--text-h)', fontWeight: '700' }}>
          Filtros de Búsqueda
        </Typography>
        <Button
          variant="text"
          color="error"
          size="small"
          onClick={resetFilters}
          startIcon={<FilterAltOffIcon />}
          sx={{ fontSize: '0.8rem', textTransform: 'none' }}
        >
          Limpiar
        </Button>
      </Box>

      <Typography variant="body2" sx={{ color: 'var(--text)', mb: 3 }}>
        Mostrando <strong>{filteredCount}</strong> de <strong>{totalCount}</strong> modelos
      </Typography>

      {/* Search Input */}
      <TextField
        fullWidth
        label="Buscar marca o característica..."
        variant="outlined"
        value={filters.search}
        onChange={handleSearchChange}
        size="small"
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'var(--code-bg)',
            '& fieldset': { borderColor: 'var(--border)' },
            '&:hover fieldset': { borderColor: 'var(--accent)' },
          },
          '& .MuiInputLabel-root': { color: 'var(--text)' },
          '& .MuiInputBase-input': { color: 'var(--text-h)' }
        }}
      />

      <Divider sx={{ mb: 2.5, borderColor: 'var(--border)' }} />

      {/* Price Slider */}
      <Box sx={{ mb: 3, px: 1 }}>
        <Typography variant="body2" sx={{ color: 'var(--text-h)', mb: 1, fontWeight: '600' }}>
          Rango de Precio
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={minMaxPrice[0]}
          max={minMaxPrice[1]}
          valueLabelFormat={(val) => formatRupees(val)}
          sx={{
            color: 'var(--accent)',
            '& .MuiSlider-valueLabel': {
              backgroundColor: 'var(--accent)',
              fontSize: '0.75rem',
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'var(--text)' }}>
            Min: {formatRupees(filters.priceRange[0])}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--text)' }}>
            Max: {formatRupees(filters.priceRange[1])}
          </Typography>
        </Box>
      </Box>

      {/* Accordion Filters for Brand, Capacity and Coils */}
      
      {/* Brands Accordion */}
      <Accordion defaultExpanded sx={{ background: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'var(--text)' }} />} sx={{ p: 0 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-h)', fontWeight: '600' }}>
            Marcas
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0, maxHeight: '200px', overflowY: 'auto', pr: 1 }}>
          <FormGroup>
            {availableBrands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    size="small"
                    sx={{ color: 'var(--text)', '&.Mui-checked': { color: 'var(--accent)' } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'var(--text-h)' }}>
                    {brand}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Tonnage / Capacity Accordion */}
      <Accordion defaultExpanded sx={{ background: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'var(--text)' }} />} sx={{ p: 0 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-h)', fontWeight: '600' }}>
            Capacidad (Toneladas)
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup sx={{ flexDirection: 'row', gap: 1 }}>
            {availableTonnages.map((ton) => (
              <FormControlLabel
                key={ton}
                control={
                  <Checkbox
                    checked={filters.tonnages.includes(ton)}
                    onChange={() => handleTonnageToggle(ton)}
                    size="small"
                    sx={{ color: 'var(--text)', '&.Mui-checked': { color: 'var(--accent)' } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'var(--text-h)' }}>
                    {ton} Ton
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Condenser Coil Accordion */}
      <Accordion defaultExpanded sx={{ background: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'var(--text)' }} />} sx={{ p: 0 }}>
          <Typography variant="body2" sx={{ color: 'var(--text-h)', fontWeight: '600' }}>
            Bobina de Condensador
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup sx={{ flexDirection: 'row', gap: 2 }}>
            {['Copper', 'Alloy'].map((coil) => (
              <FormControlLabel
                key={coil}
                control={
                  <Checkbox
                    checked={filters.coils.includes(coil)}
                    onChange={() => handleCoilToggle(coil)}
                    size="small"
                    sx={{ color: 'var(--text)', '&.Mui-checked': { color: 'var(--accent)' } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'var(--text-h)' }}>
                    {coil === 'Copper' ? 'Cobre' : 'Aleación'}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2.5, borderColor: 'var(--border)' }} />

      {/* Ratings Filter */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: 'var(--text-h)', mb: 1, fontWeight: '600' }}>
          Calificación Mínima
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating
            name="min-rating-filter"
            value={filters.minStar}
            precision={0.5}
            onChange={handleRatingChange}
            sx={{ color: '#ffb703' }}
          />
          {filters.minStar > 0 && (
            <Typography variant="caption" sx={{ color: 'var(--text)' }}>
              ({filters.minStar}+)
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
