import { mockShelves } from '~/data/mockCatalog'

export type PublicShelf = {
  name: string
  address?: string
}

export const useShelvesApi = () => {
  const config = useRuntimeConfig()

  const fetchShelves = async (): Promise<PublicShelf[]> => {
    const baseUrl = String(config.public.apiUrl || '').replace(/\/$/, '')
    if (!baseUrl) {
      return []
    }
    try {
      const response = await $fetch<{ shelves: PublicShelf[] }>(`${baseUrl}/api/v1/shelves`)
      const shelves = response.shelves ?? []
      if (shelves.length || !import.meta.dev) {
        return shelves
      }
    } catch {
      if (!import.meta.dev) {
        return []
      }
    }
    return mockShelves
  }

  return { fetchShelves }
}
