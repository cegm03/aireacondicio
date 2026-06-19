import React from 'react';
import { Grid as MuiGrid } from '@mui/material';

interface GridContainerProps {
  children: React.ReactNode;
  spacing?: number;
  sx?: object;
  id?: string;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  spacing = 3,
  sx,
  id,
}) => {
  return (
    <MuiGrid container spacing={spacing} sx={sx} id={id}>
      {children}
    </MuiGrid>
  );
};

interface GridItemProps {
  children: React.ReactNode;
  xs?: any;
  sm?: any;
  md?: any;
  lg?: any;
  size?: any;
  sx?: object;
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  xs,
  sm,
  md,
  lg,
  size,
  sx,
}) => {
  const sizeValue = size || { xs, sm, md, lg };

  return (
    <MuiGrid size={sizeValue} sx={sx}>
      {children}
    </MuiGrid>
  );
};

const GridUI = {
  Container: GridContainer,
  Item: GridItem,
};

export default GridUI;
