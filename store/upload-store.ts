import { create } from "zustand"
import type { UploadedPhoto } from "@/types"

interface UploadStore {
  photos: UploadedPhoto[]
  isUploading: boolean
  uploadProgress: number
  addPhotos: (photos: UploadedPhoto[]) => void
  removePhoto: (id: string) => void
  clearPhotos: () => void
  setUploading: (v: boolean) => void
  setProgress: (v: number) => void
}

export const useUploadStore = create<UploadStore>((set) => ({
  photos: [],
  isUploading: false,
  uploadProgress: 0,
  addPhotos: (photos) => set((s) => ({ photos: [...s.photos, ...photos] })),
  removePhoto: (id) => set((s) => ({ photos: s.photos.filter((p) => p.id !== id) })),
  clearPhotos: () => set({ photos: [], uploadProgress: 0 }),
  setUploading: (v) => set({ isUploading: v }),
  setProgress: (v) => set({ uploadProgress: v }),
}))
