import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import '@fontsource-variable/inter/index.css'
import './index.css'
import App from './App.tsx'

// On refresh the browser restores the previous scroll position, which on a tall
// landing page lands you halfway down. Opt out so a reload always starts at top.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
