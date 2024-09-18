# daas-nodejs

[documentazione REST API](REST-API.md) oppure, una volta avviato il server, visitare la pagina `http://localhost:3000/api-docs` per visualizzare la documentazione interattiva.

## Setup

### Installazione su macchina locale linux (x64)

Installare le dipendenze

```npm install```

Applicare le migrazioni al database

```
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```


Avviare il server:

```npm run start:server```


Avviare il nodo sender:

```npm run start:sender```



### Sviluppo con VSCode e DevContainer

Per sviluppare all'interno di un container, in modo da avere un ambiente di sviluppo isolato e riproducibile, è possibile utilizzare il DevContainer di VSCode.

Richiede che l'estensione [`Dev Containers`](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) sia installata sul proprio VS Code.


Digitare `Ctrl + Shift + P` e cercare e poi eseguire il comando `Dev Containers: Rebuild and Reopen in Container`.

Una volta terminata la operazione di build, si aprirà una nuova finesta di VS Code dove sarà possibile avviare server e client nel dev container docker appena creato.

Per ulteriori info consultare la [documentazione ufficiale](https://code.visualstudio.com/docs/devcontainers/containers).

---

![sebyone-logo](https://sebyone.it/res/lg_daasiot-410-72dpi.png)
# Welcome to the DaaS-IoT project

more information about the Project are available on:

* [www.daasiot.com](https://daasiot.sebyone.it) official project's site
* [www.daasiot.net](https://daasiot.net) cloud _services_ for IoT platforms (PaaS)

## Repositories 

* 👉 **daasiot-nodejs**   _nodejs sources and documentation_
* **daasiot-examples**  [_solutions examples and documentation_](https://github.com/sebyone/daasiot-examples)

> **Note**: “daasiot-nodejs” is also avalable at [NPM Repo](https://www.npmjs.com/package/daas-sdk)


## Documentation

[REST API documentation](REST-API.md)

All project documentation is located at [daasiot.com](https://daasiot.com). 

File|Content
---|---
daasiot-overview | [Concepts and Technology Overview](https://daasiot.sebyone.it/?page_id=1604)
daasiot-setup | [First use guide](https://daasiot.sebyone.it/?page_id=1604)
daas-sdk-nodejs-xxx | [Developer Quick Start Guide (NodeJS)](https://drive.google.com/file/d/1V7UGeJkDImIEjFY3pIuC5otPOvUQuQWs/view?usp=drive_link)
daas-sdk-esp-xxx | Developer Quick Start Guide (Esp32)

## Running & Debugging

## Communicating with the Team

If you would like to ask a question please reach out to us via email: [developers@sebyone.it](developers@sebyone.it)


