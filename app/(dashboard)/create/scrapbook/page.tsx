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
      description="Upload 10–50 photos. AI arranges them into handcrafted scrapbook pages."
      maxPhotos={50}
      minPhotos={10}
      onContinue={() => setStep("config")}
    />
  ) : (
    <ScrapbookConfig onBack={() => setStep("upload")} />
  )
}
