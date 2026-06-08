import { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Grid,
  CircularProgress,
  Badge,
  Container,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DescriptionIcon from '@mui/icons-material/Description';
import AcUnitIcon from '@mui/icons-material/AcUnit';

import { fetchAndParseDataset, type AirConditioner } from './utils/firebaseService';
import { SidebarFilters, type FilterState } from './components/SidebarFilters';
import { DashboardView } from './components/DashboardView';
import { CatalogView } from './components/CatalogView';
import { ComparisonView } from './components/ComparisonView';
import { DocumentationView } from './components/DocumentationView';

const defaultFilters: FilterState = {
  search: '',
  brands: [],
  tonnages: [],
  coils: [],
  minStar: 0,
  priceRange: [0, 100000],
};

function App() {
  const [rawData, setRawData] = useState<AirConditioner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog' | 'compare' | 'docs'>('dashboard');
  const [selectedToCompare, setSelectedToCompare] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const [minMaxPrice, setMinMaxPrice] = useState<[number, number]>([0, 100000]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Load dataset
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const items = await fetchAndParseDataset();
      setRawData(items);

      if (items.length > 0) {
        const prices = items.map((i) => i.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setMinMaxPrice([minPrice, maxPrice]);
        setFilters((prev) => ({
          ...prev,
          priceRange: [minPrice, maxPrice],
        }));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Sync dark mode class with document body
  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      body.style.backgroundColor = '#16171d';
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
      body.style.backgroundColor = '#f8fafc';
    }
  }, [darkMode]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      ...defaultFilters,
      priceRange: [minMaxPrice[0], minMaxPrice[1]],
    });
  };

  // Get available filter values from raw data
  const availableBrands = Array.from(new Set(rawData.map((item) => item.brand))).sort();
  const availableTonnages = Array.from(new Set(rawData.map((item) => item.ton))).sort((a, b) => parseFloat(a) - parseFloat(b));

  // Toggle products in comparison list
  const toggleCompare = (id: number) => {
    setSelectedToCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        if (prev.length >= 3) return prev; // Limit to 3 items
        return [...prev, id];
      }
    });
  };

  const removeCompare = (id: number) => {
    setSelectedToCompare((prev) => prev.filter((itemId) => itemId !== id));
  };

  // Filter application logic
  const filteredData = rawData.filter((item) => {
    // 1. Search filter (brand or specs)
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const matchBrand = item.brand.toLowerCase().includes(query);
      const matchCoil = item.condenserCoil.toLowerCase().includes(query);
      const matchGas = item.refrigerant.toLowerCase().includes(query);
      if (!matchBrand && !matchCoil && !matchGas) {
        return false;
      }
    }

    // 2. Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(item.brand)) {
      return false;
    }

    // 3. Tonnage filter
    if (filters.tonnages.length > 0 && !filters.tonnages.includes(item.ton)) {
      return false;
    }

    // 4. Coil filter
    if (filters.coils.length > 0 && !filters.coils.includes(item.condenserCoil)) {
      return false;
    }

    // 5. Rating filter
    if (filters.minStar > 0 && item.star < filters.minStar) {
      return false;
    }

    // 6. Price range filter
    if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) {
      return false;
    }

    return true;
  });

  // Get selected objects for comparison
  const comparisonItems = rawData.filter((item) => selectedToCompare.includes(item.id));

  // Determine if filters sidebar should be shown
  const showSidebar = activeTab === 'dashboard' || activeTab === 'catalog';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Navigation Header */}
      <AppBar position="sticky" sx={{ background: 'var(--code-bg)', borderBottom: '1px solid var(--border)', boxShadow: 'none' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Title / Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AcUnitIcon sx={{ color: 'var(--accent)', fontSize: '1.8rem' }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  color: 'var(--text-h)',
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(90deg, var(--accent) 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '800',
                }}
              >
                ClimaSatis
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text)', ml: 1, display: { xs: 'none', sm: 'block' }, borderLeft: '1px solid var(--border)', pl: 1 }}>
                AC Analytics & Catalog
              </Typography>
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1 } }}>
              <Button
                color="inherit"
                onClick={() => setActiveTab('dashboard')}
                startIcon={<DashboardIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 'dashboard' ? '700' : '500',
                  color: activeTab === 'dashboard' ? 'var(--accent)' : 'var(--text)',
                  backgroundColor: activeTab === 'dashboard' ? 'var(--accent-bg)' : 'transparent',
                  '&:hover': { backgroundColor: 'var(--accent-bg)' },
                  borderRadius: '10px',
                  px: 2,
                }}
              >
                Analíticas
              </Button>
              
              <Button
                color="inherit"
                onClick={() => setActiveTab('catalog')}
                startIcon={<StorefrontIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 'catalog' ? '700' : '500',
                  color: activeTab === 'catalog' ? 'var(--accent)' : 'var(--text)',
                  backgroundColor: activeTab === 'catalog' ? 'var(--accent-bg)' : 'transparent',
                  '&:hover': { backgroundColor: 'var(--accent-bg)' },
                  borderRadius: '10px',
                  px: 2,
                }}
              >
                Catálogo
              </Button>
              
              <Button
                color="inherit"
                onClick={() => setActiveTab('compare')}
                startIcon={
                  <Badge badgeContent={selectedToCompare.length} color="primary" sx={{ '& .MuiBadge-badge': { backgroundColor: 'var(--accent)' } }}>
                    <CompareArrowsIcon />
                  </Badge>
                }
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 'compare' ? '700' : '500',
                  color: activeTab === 'compare' ? 'var(--accent)' : 'var(--text)',
                  backgroundColor: activeTab === 'compare' ? 'var(--accent-bg)' : 'transparent',
                  '&:hover': { backgroundColor: 'var(--accent-bg)' },
                  borderRadius: '10px',
                  px: 2,
                }}
              >
                Comparador
              </Button>
              
              <Button
                color="inherit"
                onClick={() => setActiveTab('docs')}
                startIcon={<DescriptionIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: activeTab === 'docs' ? '700' : '500',
                  color: activeTab === 'docs' ? 'var(--accent)' : 'var(--text)',
                  backgroundColor: activeTab === 'docs' ? 'var(--accent-bg)' : 'transparent',
                  '&:hover': { backgroundColor: 'var(--accent-bg)' },
                  borderRadius: '10px',
                  px: 2,
                }}
              >
                Proyecto
              </Button>

              {/* Theme Toggle Button */}
              <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ color: 'var(--text)', ml: 1 }}>
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Layout Container */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', py: 10 }}>
            <CircularProgress sx={{ color: 'var(--accent)' }} />
            <Typography variant="body1" sx={{ ml: 2, color: 'var(--text)' }}>
              Conectando con Firebase...
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ flexGrow: 1 }}>
            {/* Conditional Sidebar filters */}
            {showSidebar && (
              <Grid size={{ xs: 12, md: 3.2, lg: 2.8 }}>
                <Box
                  sx={{
                    backgroundColor: 'var(--code-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    position: 'sticky',
                    top: '88px', // offset from sticky navbar
                  }}
                >
                  <SidebarFilters
                    filters={filters}
                    setFilters={setFilters}
                    availableBrands={availableBrands}
                    availableTonnages={availableTonnages}
                    minMaxPrice={minMaxPrice}
                    totalCount={rawData.length}
                    filteredCount={filteredData.length}
                    resetFilters={resetFilters}
                  />
                </Box>
              </Grid>
            )}

            {/* Main Content Area */}
            <Grid size={{ xs: 12, md: showSidebar ? 8.8 : 12, lg: showSidebar ? 9.2 : 12 }}>
              <Box sx={{ width: '100%' }}>
                {activeTab === 'dashboard' && (
                  <DashboardView data={filteredData} />
                )}
                {activeTab === 'catalog' && (
                  <CatalogView
                    data={filteredData}
                    selectedToCompare={selectedToCompare}
                    toggleCompare={toggleCompare}
                  />
                )}
                {activeTab === 'compare' && (
                  <ComparisonView
                    selectedItems={comparisonItems}
                    removeCompare={removeCompare}
                    goToCatalog={() => setActiveTab('catalog')}
                  />
                )}
                {activeTab === 'docs' && (
                  <DocumentationView />
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Footer */}
      <Box sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'var(--code-bg)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'var(--text)' }}>
          ClimaSatis © 2026 • Proyecto Académico de Exploración de Datos
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
