import { Seo } from './components/seo/Seo'
import { CustomCursor } from './components/interactions/CustomCursor'
import { ScrollProgress } from './components/interactions/ScrollProgress'
import { Bubbles } from './components/interactions/Bubbles'
import { SocialRail } from './components/layout/SocialRail'
import { Hero } from './components/sections/Hero'
import { Proof } from './components/sections/Proof'
import { Capabilities } from './components/sections/Capabilities'
import { Pipeline } from './components/sections/Pipeline'
import { Products } from './components/sections/Products'
import { Experiments } from './components/sections/Experiments'
import { HealthCheck } from './components/sections/HealthCheck'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/layout/Footer'
import { BookingProvider } from './components/booking/BookingContext'

export default function App() {
  return (
    <BookingProvider>
      <Seo />
      <CustomCursor />
      <ScrollProgress />
      <SocialRail />
      <div className="relative">
        <Bubbles />
        <Hero />
        <main>
          <Proof />
          <Products />
          <Experiments />
          <Capabilities />
          <Pipeline />
          <HealthCheck />
          <Contact />
        </main>
        <Footer />
      </div>
    </BookingProvider>
  )
}
