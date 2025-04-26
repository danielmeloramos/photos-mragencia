import { folder, folderState } from 'types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useFolderStore = create<folderState>()(
    persist(
        (set) => ({
            folder: null as folder | null,
            add: (folder) => set({ folder: folder }),
        }),
        {
            name: 'folder-storage',
            storage: createJSONStorage(() => localStorage)
        }
))