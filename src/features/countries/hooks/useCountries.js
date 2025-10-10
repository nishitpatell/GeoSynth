/**
 * useCountries Hook
 * Fetch and manage multiple countries
 */

import { useQuery } from '@tanstack/react-query';
import { countryRepository } from '@/core/repositories';
import { QUERY_KEYS } from '@/shared/constants';

export const useCountries = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COUNTRIES, filters],
    queryFn: () => countryRepository.getAllCountries(),
    staleTime: 1000 * 60 * 60, // 1 hour
    select: (data) => {
      let filtered = data;

      // Apply filters
      if (filters.region) {
        filtered = filtered.filter(c => c.region === filters.region);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(searchLower) ||
          c.officialName.toLowerCase().includes(searchLower)
        );
      }

      return filtered;
    },
  });
};
