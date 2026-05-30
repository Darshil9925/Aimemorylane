"use client"
// Canvas renderer — base for all memory modes
// Wraps an HTML canvas with helpers for drawing strips, polaroids, etc.

interface RendererProps {
  width: number
  height: number
  className?: string
}

export function CanvasRenderer({ width, height, className }: RendererProps) {
  return (
    <canvas
      width={width}
      height={height}
      className={className}
      style={{ maxWidth: "100%", borderRadius: 16 }}
    />
  )
}
