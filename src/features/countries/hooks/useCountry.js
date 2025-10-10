/**
 * useCountry Hook
 * Fetch and manage single country data
 */

import { useQuery } from '@tanstack/react-query';
import { countryRepository } from '@/core/repositories';
import { QUERY_KEYS } from '@/shared/constants';

export const useCountry = (code) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COUNTRY, code],
    queryFn: () => countryRepository.getCountryByCode(code),
    enabled: !!code,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
};
