This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install the dependencies:

```bash
npm i
```

Then, you need to setup your .env.dev file with your own links and rename it to .env.local:\
NEXT_PUBLIC_API_BASE_URL - this will be your own [back-end](https://github.com/sebyone/daasiot-examples-dccs/blob/main/web-console/be/README.md) api endpoint:
```bash
NEXT_PUBLIC_API_BASE_URL= your-own-be/api-endpoint
```

NEXT_PUBLIC_WS_URL - this is your own websocket you use for device related actions:
```bash
NEXT_PUBLIC_WS_URL= your-own-ws-url
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

