import { Seo } from './components/seo/Seo'
import { CustomCursor } from './components/interactions/CustomCursor'
import { ScrollProgress } from './components/interactions/ScrollProgress'
import { Bubbles } from './components/interactions/Bubbles'
import { SocialRail } from './components/layout/SocialRail'
import { Hero } from './components/sections/Hero'
import { Capabilities } from './components/sections/Capabilities'
import { Pipeline } from './components/sections/Pipeline'
import { Products } from './components/sections/Products'
import { Experiments } from './components/sections/Experiments'
import { Contact } from './components/sections/Contact'
import { Footer } from './components/layout/Footer'
import { BookingProvider } from './components/booking/BookingContext'
import { LocaleProvider } from './i18n/LocaleProvider'
import { ThemeProvider } from './theme/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <BookingProvider>
          <Seo />
          <CustomCursor />
          <ScrollProgress />
          <SocialRail />
          <div className="relative">
            <Bubbles />
            <Hero />
            <main>
              <Products />
              <Experiments />
              <Capabilities />
              <Pipeline />
              <Contact />
            </main>
            <Footer />
          </div>
        </BookingProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
