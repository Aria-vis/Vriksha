/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_MAP_TILE_URL?: string;
  readonly VITE_ENABLE_INAT_VISION?: string;
  readonly VITE_ENABLE_VOICE_SEARCH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
