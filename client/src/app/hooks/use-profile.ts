import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../services/api'
import { useUserStore } from '../lib/store/user-store'

export function useProfile() {
  const queryClient = useQueryClient()
  const { setUser, updateProfile: updateStoreProfile } = useUserStore()

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await userApi.getProfile()
      setUser(data)
      return data
    }
  })

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      updateStoreProfile(data.nickname, data.avatarUrl)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })

  const { data: likedTracks, isLoading: isTracksLoading } = useQuery({
    queryKey: ['likedTracks'],
    queryFn: async () => {
      const { data } = await userApi.getLikedTracks()
      return data
    }
  })

  const { data: likedAlbums, isLoading: isAlbumsLoading } = useQuery({
    queryKey: ['likedAlbums'],
    queryFn: async () => {
      const { data } = await userApi.getLikedAlbums()
      return data
    }
  })

  return {
    profile,
    likedTracks,
    likedAlbums,
    isProfileLoading,
    isTracksLoading,
    isAlbumsLoading,
    isUpdating,
    updateProfile
  }
}