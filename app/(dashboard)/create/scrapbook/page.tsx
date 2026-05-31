"use client"

import { useState } from "react"
import { UploadStep } from "@/components/upload/upload-step"
import { ScrapbookConfig } from "@/components/modes/scrapbook/config"

export default function CreateScrapbookPage() {
  const [step, setStep] = useState<"upload" | "config">("upload")

  return step === "upload" ? (
    <UploadStep
      emoji="📒"
      title="Create a Scrapbook"
      description="Upload 1–50 photos. We'll arrange them into handcrafted scrapbook pages."
      maxPhotos={50}
      minPhotos={1}
      onContinue={() => setStep("config")}
    />
  ) : (
    <ScrapbookConfig onBack={() => setStep("upload")} />
  )
}
