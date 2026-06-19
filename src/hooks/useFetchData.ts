import { useState, useEffect, useCallback } from 'react';
import { fetchAndParseDataset, type AirConditioner } from '../utils/firebaseService';

export function useFetchData() {
  const [data, setData] = useState<AirConditioner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchAndParseDataset();
      setData(items);
    } catch (err) {
      console.error('Error in useFetchData:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refetch: loadData };
}
