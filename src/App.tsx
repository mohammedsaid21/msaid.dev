import { Seo } from './components/seo/Seo'
import { CustomCursor } from './components/interactions/CustomCursor'
import { ScrollProgress } from './components/interactions/ScrollProgress'
import { SocialRail } from './components/layout/SocialRail'
import { Hero } from './components/sections/Hero'
import { Trust } from './components/sections/Trust'
import { Capabilities } from './components/sections/Capabilities'
import { Pipeline } from './components/sections/Pipeline'
import { Products } from './components/sections/Products'
import { HealthCheck } from './components/sections/HealthCheck'
import { FinalCTA } from './components/sections/FinalCTA'
import { Footer } from './components/layout/Footer'
import { BookingProvider } from './components/booking/BookingContext'

export default function App() {
  return (
    <BookingProvider>
      <Seo />
      <CustomCursor />
      <ScrollProgress />
      <SocialRail />
      <Hero />
      <main>
        <Trust />
        <Products />
        <Capabilities />
        <Pipeline />
        <HealthCheck />
        <FinalCTA />
      </main>
      <Footer />
    </BookingProvider>
  )
}
