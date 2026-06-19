import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
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

export type TabType = 'dashboard' | 'catalog' | 'compare' | 'docs';

interface HeaderUIProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  compareCount: number;
}

export const HeaderUI: React.FC<HeaderUIProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  compareCount,
}) => {
  return (
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

          {/* Navigation Links */}
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
                <Badge badgeContent={compareCount} color="primary" sx={{ '& .MuiBadge-badge': { backgroundColor: 'var(--accent)' } }}>
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
            <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ color: 'var(--text)', ml: 1 }} aria-label="Cambiar tema">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
