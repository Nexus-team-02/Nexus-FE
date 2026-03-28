import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ApiAuthStore {
  token: string | null
  setToken: (token: string | null) => void
}

export const useApiAuthStore = create<ApiAuthStore>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    { name: 'api-auth-token' },
  ),
)
