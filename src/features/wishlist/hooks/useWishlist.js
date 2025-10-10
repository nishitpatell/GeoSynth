/**
 * useWishlist Hook
 * Manage user's wishlist
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistRepository } from '@/core/repositories';
import { useAuth } from '@/features/auth';
import { QUERY_KEYS } from '@/shared/constants';
import { toast } from 'sonner';
import { handleError } from '@/core/errors';

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get wishlist
  const { data: wishlist, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.WISHLIST, user?.id],
    queryFn: () => wishlistRepository.getUserWishlist(user.id),
    enabled: !!user,
  });

  // Add to wishlist mutation
  const addMutation = useMutation({
    mutationFn: ({ countryCode, countryName, notes }) =>
      wishlistRepository.addToWishlist(user.id, countryCode, countryName, notes),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.WISHLIST]);
      toast.success('Added to wishlist');
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // Remove from wishlist mutation
  const removeMutation = useMutation({
    mutationFn: (id) => wishlistRepository.removeFromWishlist(user.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.WISHLIST]);
      toast.success('Removed from wishlist');
    },
    onError: (error) => {
      handleError(error);
    },
  });

  // Update notes mutation
  const updateNotesMutation = useMutation({
    mutationFn: ({ id, notes }) => wishlistRepository.updateNotes(user.id, id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.WISHLIST]);
      toast.success('Notes updated');
    },
    onError: (error) => {
      handleError(error);
    },
  });

  return {
    wishlist: wishlist || [],
    isLoading,
    error,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    updateNotes: updateNotesMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isUpdating: updateNotesMutation.isPending,
  };
};
