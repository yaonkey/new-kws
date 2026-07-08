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
      return response.shelves ?? []
    } catch {
      return []
    }
  }

  return { fetchShelves }
}
