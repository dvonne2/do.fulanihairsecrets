/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_META_ACCESS_TOKEN?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_WEBHOOK_URL?: string;
  readonly VITE_WEBHOOK_SECRET?: string;
  readonly VITE_CAPI_ENDPOINT?: string;
  readonly VITE_FULANI_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
