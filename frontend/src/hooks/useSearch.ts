import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';

export function useSearch<T>(items: T[], searchFields: (keyof T)[], delay = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    if (!items) return;

    if (!debouncedSearchTerm) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        }
        return false;
      })
    );

    setFilteredItems(filtered);
  }, [debouncedSearchTerm, items, searchFields]);

  return { searchTerm, setSearchTerm, filteredItems };
} 