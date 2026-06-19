import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface AlertUIProps {
  message: React.ReactNode;
  severity?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  action?: React.ReactNode;
  sx?: object;
}

export const AlertUI: React.FC<AlertUIProps> = ({
  message,
  severity = 'info',
  title,
  action,
  sx,
}) => {
  const getColors = () => {
    switch (severity) {
      case 'warning':
        return {
          bg: 'var(--accent-bg)',
          border: 'var(--accent-border)',
          text: 'var(--text-h)',
          iconColor: 'var(--accent)',
          Icon: WarningAmberOutlinedIcon,
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.08)',
          border: 'rgba(239, 68, 68, 0.3)',
          text: 'var(--text-h)',
          iconColor: '#ef4444',
          Icon: ErrorIcon,
        };
      case 'success':
        return {
          bg: 'rgba(16, 185, 129, 0.08)',
          border: 'rgba(16, 185, 129, 0.3)',
          text: 'var(--text-h)',
          iconColor: '#10b981',
          Icon: CheckCircleIcon,
        };
      case 'info':
      default:
        return {
          bg: 'rgba(59, 130, 246, 0.08)',
          border: 'rgba(59, 130, 246, 0.3)',
          text: 'var(--text-h)',
          iconColor: '#3b82f6',
          Icon: InfoOutlinedIcon,
        };
    }
  };

  const config = getColors();
  const IconComponent = config.Icon;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderRadius: '12px',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        gap: 2,
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconComponent sx={{ color: config.iconColor, fontSize: '1.4rem' }} />
        <Box>
          {title && (
            <Typography variant="subtitle2" sx={{ fontWeight: '700', color: config.text, mb: 0.2 }}>
              {title}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: 'var(--text-h)', fontWeight: '500' }}>
            {message}
          </Typography>
        </Box>
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
};

export default AlertUI;
