/**
 * useWishlistStatus Hook
 * Check if a country is in wishlist
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistRepository } from '@/core/repositories';
import { useAuth } from '@/contexts/AuthContext';
import { QUERY_KEYS } from '@/shared/constants';
import { toast } from 'sonner';
import { handleError } from '@/core/errors';

export const useWishlistStatus = (countryCode) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if in wishlist
  const { data: isInWishlist, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.WISHLIST, 'status', user?.id, countryCode],
    queryFn: () => wishlistRepository.isInWishlist(user.id, countryCode),
    enabled: !!user && !!countryCode,
  });

  // Get wishlist item
  const { data: wishlistItem } = useQuery({
    queryKey: [QUERY_KEYS.WISHLIST, 'item', user?.id, countryCode],
    queryFn: () => wishlistRepository.getByCountryCode(user.id, countryCode),
    enabled: !!user && !!countryCode,
  });

  // Toggle mutation
  const toggleMutation = useMutation({
    mutationFn: async ({ countryName }) => {
      if (wishlistItem) {
        await wishlistRepository.removeFromWishlist(user.id, wishlistItem.id);
        return { added: false };
      } else {
        await wishlistRepository.addToWishlist(user.id, countryCode, countryName);
        return { added: true };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([QUERY_KEYS.WISHLIST]);
      toast.success(data.added ? 'Added to wishlist' : 'Removed from wishlist');
    },
    onError: (error) => {
      handleError(error);
    },
  });

  return {
    isInWishlist: !!isInWishlist,
    isLoading,
    wishlistItem,
    toggle: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
};
