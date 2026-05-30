"use client"

import { useState } from "react"
import { UploadStep } from "@/components/upload/upload-step"
import { PhotoboothConfig } from "@/components/modes/photobooth/config"

export default function CreatePhotoboothPage() {
  const [step, setStep] = useState<"upload" | "config">("upload")

  return step === "upload" ? (
    <UploadStep
      emoji="🎞️"
      title="Create a Photobooth Strip"
      description="Upload 1–10 photos. We'll arrange them into a classic photobooth strip."
      maxPhotos={10}
      minPhotos={1}
      onContinue={() => setStep("config")}
    />
  ) : (
    <PhotoboothConfig onBack={() => setStep("upload")} />
  )
}
