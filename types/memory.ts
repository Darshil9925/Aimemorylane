export type MemoryMode =
  | "photobooth"
  | "polaroid"
  | "disposable"
  | "scrapbook"
  | "memory-pack"

export type ProjectStatus = "draft" | "processing" | "completed" | "failed"

export interface UploadedPhoto {
  id: string
  url: string
  previewUrl: string
  file?: File
  width: number
  height: number
}

export interface Project {
  id: string
  userId: string
  mode: MemoryMode
  status: ProjectStatus
  title?: string
  photos: UploadedPhoto[]
  outputs: GeneratedAsset[]
  createdAt: Date
  updatedAt: Date
}

export interface GeneratedAsset {
  id: string
  type: "png" | "jpg" | "pdf" | "webp"
  url: string
  thumbnailUrl: string
  width: number
  height: number
}

export interface PhotoboothTemplate {
  id: string
  name: string
  description: string
  preview: string
}

export interface PolaroidEffect {
  id: string
  name: string
  cssClass: string
}
