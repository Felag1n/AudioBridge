//client\src\app\hooks\use-search.ts

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export const useSearch = (query, filters) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const searchQuery = async () => {
    if (!debouncedQuery) return { tracks: [], users: [] };

    // Это будет заменено реальными вызовами API
    const response = await fetch(`/api/search?q=${debouncedQuery}&genre=${filters.genre || ''}&language=${filters.language || ''}`);
    return response.json();
  };

  return useQuery({
    queryKey: ['search', debouncedQuery, filters],
    queryFn: searchQuery,
    enabled: !!debouncedQuery,
    staleTime: 1000 * 60 * 5, // Кэш на 5 минут
  });
};

export default useSearch;