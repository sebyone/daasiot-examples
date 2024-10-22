# daas-nodejs

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

**Note**: “daasiot-nodejs” is also avalable at [NPM Repo](https://www.npmjs.com/package/daas-sdk)

## Documentation

### API

Una volta avviato il server, visitare la pagina `http://localhost:3000/api-docs` per visualizzare la documentazione interattiva.

## Running & Debugging

## Communicating with the Team

If you would like to ask a question please reach out to us via email: [developers@sebyone.it](developers@sebyone.it)

