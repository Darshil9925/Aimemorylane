import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/landing/hero"
import { ModeShowcase } from "@/components/landing/mode-showcase"
import { HowItWorks } from "@/components/landing/how-it-works"
import { SocialProof } from "@/components/landing/social-proof"
import { Pricing } from "@/components/landing/pricing"
import { CtaBanner } from "@/components/landing/cta-banner"

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ModeShowcase />
        <HowItWorks />
        <SocialProof />
        <Pricing />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
