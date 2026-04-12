import { createApiClient } from "~/services/http/client";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  return {
    provide: {
      api: createApiClient(config.public.apiBase),
    },
  };
});
