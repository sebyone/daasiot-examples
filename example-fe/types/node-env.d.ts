// types/node-env.d.ts
declare namespace NodeJS {
    export interface ProcessEnv {
      KEYCLOAK_CLIENT_ID: string;
      KEYCLOAK_CLIENT_SECRET: string;
      KEYCLOAK_ISSUER: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      NEXT_PUBLIC_API_BASE_URL: string;
      NEXT_PUBLIC_WS_URL: string;
    }
  }
  