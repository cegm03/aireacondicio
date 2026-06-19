import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface IndicatorUIProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  accentColor?: string;
  sx?: object;
}

export const IndicatorUI: React.FC<IndicatorUIProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = 'var(--accent)',
  sx,
}) => {
  return (
    <Card
      className="kpi-card"
      sx={{
        background: 'var(--code-bg)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease !important',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: accentColor,
          boxShadow: 'var(--shadow)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: accentColor,
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ color: 'var(--text)', fontWeight: '500' }}>
            {title}
          </Typography>
          {icon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{icon}</Box>}
        </Box>
        <Typography variant="h4" sx={{ color: 'var(--text-h)', fontWeight: '800', display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'var(--text)', display: 'block', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default IndicatorUI;
