# DaaS-IoT dccs - Backend server

![sebyone-logo](https://sebyone.it/res/lg_daasiot-410-72dpi.png)

## Introduction

This is the backend server for the DaaS-IoT DCCS project, a distributed configurable control system for IoT devices that uses the **DaaS-IoT** technology to provide a mesh network of devices that can be controlled and monitored remotely.

The backend server is a Node.js application that uses the Express.js framework to provide a REST API to the [frontend client](/web-console/fe/README.md), using a DaaS-IoT node to communicate with the devices.

## Setup

### Dependencies

install npm dependencies

```sh
npm install
```

*(Optional)* [install LibreOffice](reporting_setup.md) (required by carbone to generate reports)

### Database

Applicare le migrazioni al database

```sh
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Start the server

Start server for production:

```sh
npm run start:server
```

Start server for development:

```sh
npm run start:dev:server
```

### (Optional) Start the sender

the sender is a very simple script that sends a message to the DaaS-IoT network every 5 seconds.

```sh
npm run start:sender
```

### Sviluppo con VSCode e DevContainer

Per sviluppare all'interno di un container, in modo da avere un ambiente di sviluppo isolato e riproducibile, è possibile utilizzare il DevContainer di VSCode.

Richiede che l'estensione [`Dev Containers`](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) sia installata sul proprio VS Code.

Digitare `Ctrl + Shift + P` e cercare e poi eseguire il comando `Dev Containers: Rebuild and Reopen in Container`.

Una volta terminata la operazione di build, si aprirà una nuova finesta di VS Code dove sarà possibile avviare server e client nel dev container docker appena creato.

Per ulteriori info consultare la [documentazione ufficiale](https://code.visualstudio.com/docs/devcontainers/containers) di VS Code.

---

## Welcome to the DaaS-IoT project

more information about the Project are available on:

* [www.daasiot.com](https://daasiot.sebyone.it) official project's site
* [www.daasiot.net](https://daasiot.net) cloud *services* for IoT platforms (PaaS)

## Repositories

**Note**: “daasiot-nodejs” is also avalable at [NPM Repo](https://www.npmjs.com/package/daas-sdk)

## Documentation

### API

Una volta avviato il server, visitare la pagina `http://localhost:3000/api-docs` per visualizzare la documentazione interattiva, generata automaticamente con Swagger.

## Communicating with the Team

If you would like to ask a question please reach out to us via email: [developers@sebyone.it](developers@sebyone.it)
