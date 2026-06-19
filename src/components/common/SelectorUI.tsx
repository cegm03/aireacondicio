import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { type SelectChangeEvent } from '@mui/material/Select';

interface Option<T> {
  value: T;
  label: string;
}

interface SelectorUIProps<T extends string | number> {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (event: SelectChangeEvent<T>) => void;
  size?: 'small' | 'medium';
  minWidth?: number | string;
  id?: string;
  sx?: object;
}

export function SelectorUI<T extends string | number>({
  label,
  value,
  options,
  onChange,
  size = 'small',
  minWidth = 160,
  id,
  sx,
}: SelectorUIProps<T>) {
  const labelId = `${id || 'selector'}-label`;
  const selectId = `${id || 'selector'}-select`;

  return (
    <FormControl size={size} sx={{ minWidth, ...sx }}>
      <InputLabel id={labelId} sx={{ color: 'var(--text)' }}>
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={selectId}
        value={value}
        label={label}
        onChange={onChange}
        sx={{
          borderRadius: '8px',
          color: 'var(--text-h)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--accent)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--accent)' },
          '& .MuiSvgIcon-root': { color: 'var(--text)' },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectorUI;
