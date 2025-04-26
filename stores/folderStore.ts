import { folder } from 'types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFolderStore = create(
    persist(
        (set) => ({
            folder: null as folder | null,
            add: (folder) => set({ folder: folder }),
        }),
        {
            name: 'folder-storage',
            getStorage: () => localStorage,
        }
))