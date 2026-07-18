/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Web3Forms access key for the "Book a Call" form. Optional — falls back to mailto. */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
