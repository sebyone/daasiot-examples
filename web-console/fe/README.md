# DaaS-IoT dccs - Frontend server

![sebyone-logo](https://sebyone.it/res/lg_daasiot-410-72dpi.png)

## Introduction

This is the Frontend client for the DaaS-IoT DCCS project, a distributed configurable control system for IoT devices that uses the **DaaS-IoT** technology to provide a mesh network of devices that can be controlled and monitored remotely.

The frontend client is a Next.js application that communicates with the [backend server](/web-console/be/README.md)
## Getting Started

First, install the dependencies:

```bash
npm i
```
Then, you need to setup your .env.dev file with your own links and rename it to .env.local:\
NEXT_PUBLIC_API_BASE_URL - this will be your own [back-end](https://github.com/sebyone/daasiot-examples-dccs/blob/main/web-console/be/README.md) api endpoint:
```bash
NEXT_PUBLIC_API_BASE_URL=your-own-be/api-endpoint
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

