"use client"

import { useState } from "react"
import { UploadStep } from "@/components/upload/upload-step"
import { DisposableConfig } from "@/components/modes/disposable/config"

export default function CreateDisposablePage() {
  const [step, setStep] = useState<"upload" | "config">("upload")

  return step === "upload" ? (
    <UploadStep
      emoji="📸"
      title="Disposable Camera"
      description="Upload photos and make them look shot on a disposable."
      maxPhotos={20}
      minPhotos={1}
      onContinue={() => setStep("config")}
    />
  ) : (
    <DisposableConfig onBack={() => setStep("upload")} />
  )
}
