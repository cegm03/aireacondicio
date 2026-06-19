import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

export interface TableRowData {
  id: string | number;
  cells: React.ReactNode[];
}

interface TableUIProps {
  headers?: string[];
  rows: TableRowData[];
  size?: 'small' | 'medium';
  sx?: object;
}

export const TableUI: React.FC<TableUIProps> = ({
  headers,
  rows,
  size = 'small',
  sx,
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        backgroundColor: 'transparent',
        borderColor: 'var(--border)',
        overflow: 'hidden',
        width: '100%',
        ...sx,
      }}
    >
      <Table size={size}>
        {headers && headers.length > 0 && (
          <TableHead sx={{ backgroundColor: 'var(--border)' }}>
            <TableRow>
              {headers.map((header, idx) => (
                <TableCell key={idx} sx={{ fontWeight: 'bold', color: 'var(--text-h)' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: 'var(--accent-bg) !important' } }}>
              {row.cells.map((cell, idx) => (
                <TableCell key={idx} sx={{ borderBottomColor: 'var(--border)' }}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TableUI;
