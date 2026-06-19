import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Container,
} from '@mui/material';

import { SidebarFilters, type FilterState } from './components/SidebarFilters';
import { DashboardView } from './components/DashboardView';
import { CatalogView } from './components/CatalogView';
import { ComparisonView } from './components/ComparisonView';
import { DocumentationView } from './components/DocumentationView';
import { useFetchData } from './hooks/useFetchData';
import { HeaderUI } from './components/common/HeaderUI';
import GridUI from './components/common/GridUI';

const defaultFilters: FilterState = {
  search: '',
  brands: [],
  tonnages: [],
  coils: [],
  minStar: 0,
  priceRange: [0, 100000],
};

function App() {
  const { data: rawData, loading } = useFetchData();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'catalog' | 'compare' | 'docs'>('dashboard');
  const [selectedToCompare, setSelectedToCompare] = useState<number[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const [minMaxPrice, setMinMaxPrice] = useState<[number, number]>([0, 100000]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Load dataset
  // Sync filters price range when rawData updates
  useEffect(() => {
    if (rawData.length > 0) {
      const prices = rawData.map((i) => i.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setMinMaxPrice([minPrice, maxPrice]);
      setFilters((prev) => ({
        ...prev,
        priceRange: [minPrice, maxPrice],
      }));
    }
  }, [rawData]);

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
      {/* Navigation Header Component */}
      <HeaderUI
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        compareCount={selectedToCompare.length}
      />

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
          <GridUI.Container spacing={3} sx={{ flexGrow: 1 }}>
            {/* Conditional Sidebar filters */}
            {showSidebar && (
              <GridUI.Item xs={12} md={3.2} lg={2.8}>
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
              </GridUI.Item>
            )}

            {/* Main Content Area */}
            <GridUI.Item xs={12} md={showSidebar ? 8.8 : 12} lg={showSidebar ? 9.2 : 12}>
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
            </GridUI.Item>
          </GridUI.Container>
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
