/**
 * useCountrySearch Hook
 * Search countries with debouncing
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { countryRepository } from '@/core/repositories';
import { QUERY_KEYS } from '@/shared/constants';
import { debounce } from '@/shared/utils';

export const useCountrySearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce search query
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedQuery(query);
    }, 300);

    handler();
  }, [query]);

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.COUNTRIES, 'search', debouncedQuery],
    queryFn: () => countryRepository.searchCountries(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    query,
    setQuery,
    results: data || [],
    isLoading,
    error,
  };
};
