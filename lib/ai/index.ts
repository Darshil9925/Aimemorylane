import type { AIProvider, AIGenerationRequest } from "@/types"

// Provider factory — set AI_PROVIDER env var to swap without code changes
export function getProvider(provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) ?? "claude") {
  return provider
}

export async function generateMemoryAsset(request: AIGenerationRequest) {
  const { provider } = request
  switch (provider) {
    case "openai":
      const { analyzeWithOpenAI } = await import("./providers/openai")
      return analyzeWithOpenAI(request.photos)
    case "claude":
      const { analyzePhotosWithClaude } = await import("./providers/claude")
      return analyzePhotosWithClaude([])
    case "replicate":
      const { generateWithReplicate } = await import("./providers/replicate")
      return generateWithReplicate("", request.options)
    default:
      throw new Error(`Unknown AI provider: ${provider}`)
  }
}
