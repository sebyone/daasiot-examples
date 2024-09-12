<!-- 
curl -Xs GET     localhost:3000/api/
curl -Xs POST    localhost:3000/api/configure
curl -Xs POST    localhost:3000/api/stop
curl -Xs POST    localhost:3000/api/start
curl -Xs POST    localhost:3000/api/send
curl -Xs GET     localhost:3000/api/status
curl -Xs GET     localhost:3000/api/version
curl -Xs GET     localhost:3000/api/config
curl -Xs POST    localhost:3000/api/config
curl -Xs PUT     localhost:3000/api/config
curl -Xs GET     localhost:3000/api/config/links
curl -Xs GET     localhost:3000/api/config/links/:id
curl -Xs POST    localhost:3000/api/config/links
curl -Xs PUT     localhost:3000/api/config/links/:id
curl -Xs DELETE  localhost:3000/api/config/links/:id
curl -Xs GET     localhost:3000/api/config/dins/
curl -Xs GET     localhost:3000/api/config/dins/
curl -Xs POST    localhost:3000/api/config/dins/
curl -Xs POST    localhost:3000/api/config/dins/
curl -Xs PUT     localhost:3000/api/config/dins/:id
curl -Xs DELETE  localhost:3000/api/config/dins/:id
-->

# REST API

**!!! LA DOCUMENTAZIONE È IN FASE DI SVILUPPO !!!**

Il server include un web server RESTful API per la gestione delle configurazioni e di tante altre funzionalità.

## Sviluppo

Per avviare il server, eseguire il comando: `npm run start:server`, se non va, seguire le istruzioni del Setup all'interno del [`README.md`](README.md#setup).

### Esempi

Visualizzare la configurazione del nodo:
```bash
curl -X GET localhost:3000/api/config
```
<br>

inviare un messaggio ad un altro nodo:
```bash
curl -X POST localhost:3000/api/send \
  -H "Content-Type: application/json" \
  -d '{"din": 102, "typeset": 10, "payload": {"messagge": "Hello, World!"} }'
```


## API

### /api/

- `GET /api/` - Restituisce un messaggio di benvenuto.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X GET localhost:3000/api/
    ```
    #### Risposta
    ```json
    {
      "name": "DaasIoT API",
      "version": 0,
      "status": "OK"
    }
    ```
  </details>
  </br>

- `POST /api/configure` - Carica la configurazione del nodo.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X POST localhost:3000/api/configure
    ```
    #### Risposta
    ```json
    "Applicata configurazione."
    ```
  </details>
  </br>

> [!WARNING]
> Al momento, fermando il nodo, il server va in crash.
- `POST /api/stop` - Ferma il nodo.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X POST localhost:3000/api/stop
    ```
    #### Risposta
    ```json
    {
      "message": "Nodo stoppato."
    }
    ```
  </details>
  </br>

> [!WARNING]
> Al momento, il server avvia sempre il nodo con la configurazione nel db, chiamare avvia è uguale a chiamare `/api/configure`.
- `POST /api/start` - Avvia il nodo.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X POST localhost:3000/api/start
    ```
    #### Risposta
    ```json
    "Nodo locale avviato."
    ```
  </details>
  </br>

- `POST /api/send` - Invia un messaggio ad un altro nodo.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{
      "din": 102,
      "typeset": 10,
      "payload": {"messagge": "Hello, World!"}
    }' localhost:3000/api/send
    ```
    #### Risposta
    ```json
    {
      "message": "OK"
    }
    ```

    #### Extra

    Se si vuole testare il funzionamento di questo comando, avviare sia il server che il sender con il comando `npm run start:sender` e inviare un messaggio con il comando sopra. Il sender dovrebbe ricevere il messaggio e stamparlo a console.
    
    1. Terminale 1 - Avvia il server
    ```bash
    npm run start:server
    ```
    2. Terminale 2 - Avvia il sender
    ```bash
    npm run start:sender
    ```
    3. Terminale 3 - Invia un messaggio
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{
      "din": 102,
      "typeset": 10,
      "payload": {"messagge": "Hello, World!"}
    }' localhost:3000/api/send
    ```
  </details>
  </br>

> [!WARNING]
> Nella versione di DaasIoT attuale, viene restituito uno stato fittizio.
- `GET /api/status` - Restituisce informazioni sullo stato del nodo.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X GET localhost:3000/api/status
    ```
    #### Risposta
    ```json
    {
      "lasttime": 0,
      "hwver": 0,
      "linked": 0,
      "sync": 0,
      "lock": 0,
      "sklen": 1,
      "skey": "\u0000",
      "form": 2202771200,
      "codec": 32766
    }
    ```
  </details>
  </br>

> [!WARNING]
> Nella versione di DaasIoT attuale, 
- `GET /api/version` - Restituisce varie informazioni sullo stack delle tecnologie usate da DaasIoT.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X GET localhost:3000/api/version
    ```
    #### Risposta
    ```json
    {
      "version": "0.0.1",
      "node": "v14.17.0",
      "express": "4.17.1",
      "sequelize": "6.6.5",
      "sqlite3": "5.0.2"
    }
    ```
  </details>
  </br>





### /api/congif

in questo momento, si può gestire solo la configurazione del nodo daas di questo server. Quindi tutte le chiamate API sono relative alla configurazione del nodo.

- `GET /api/config` - Restituisce la configurazione corrente.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X GET localhost:3000/api/config
    ```
    #### Risposta
    ```json
    {
      "id": 1,
      "title": "Default Gateway node",
      "din_id": 1,
      "acpt_all": false,
      "enable": true,
      "createdAt": "2024-05-24T08:35:57.050Z",
      "updatedAt": null,
      "din": {
        "id": 1,
        "sid": "100",
        "din": "101",
        "p_res": "000",
        "skey": "3b92a1a3d85b8"
      }
    }
    ```
  </details>
  </br>

- `POST /api/config` - Aggiorna la configurazione, accetta un oggetto JSON come corpo della richiesta.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{
      "title": "Different Name",
      "din_id": 1,
      "acpt_all": false,
      "enable": true,
      "din": {
        "id": 1,
        "sid": "100",
        "din": "101"
      }
    }' localhost:3000/api/config
    ```
    #### Risposta
    ```json
    {
      "id": 1,
      "title": "Different Name",
      "din_id": 1,
      "acpt_all": false,
      "enable": true,
      "createdAt": "2024-05-24T08:35:57.050Z",
      "updatedAt": "2024-08-26T16:36:03.477Z",
      "din": {
        "id": 1,
        "sid": "100",
        "din": "101",
        "p_res": "000",
        "skey": "3b92a1a3d85b8"
      }
    }
    ```
  </details>
  </br>

- `PUT /api/config` - Aggiorna la configurazione, accetta un oggetto JSON come corpo della richiesta.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X PUT -H "Content-Type: application/json" -d '{
      "id": 1,
      "title": "Default Gateway node",
      "din_id": 1,
      "acpt_all": false,
      "enable": true,
      "din": {
        "id": 1,
        "sid": "100",
        "din": "101"
      }
    }' localhost:3000/api/config
    ```
    #### Risposta
    ```json
    {
      "message": "DinLocal aggiornato con successo."
    }
    ```
  </details>
  </br>
  

### /api/config/links

> [!WARNING]
> Al momento, restituisce solo un link, quello con id 1.
- `GET /api/config/links` - Restituisce la lista dei link configurati.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X GET localhost:3000/api/config/links
    ```
    #### Risposta
    ```json
    [
      {
        "id": 1,
        "link": 2,
        "din_id": 1,
        "url": "127.0.0.1:2101",
        "createdAt": "2024-05-24T08:35:57.050Z",
        "updatedAt": null
      }
    ]
    ```
  </details>
  </br>
- `GET /api/config/links/:id` - Restituisce il link con l'id specificato.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X GET localhost:3000/api/config/links/2
    ```

    #### Risposta
    ```json
    {
      "id": 2,
      "link": 2,
      "din_id": 2,
      "url": "127.0.0.1:2102",
      "createdAt": "2024-05-24T08:35:57.050Z",
      "updatedAt": null
    }
    ```
  </details>
  </br>

> [!WARNING]
> Al momento, non crea un nuovo link, ma permette di aggiornare il link con id 1, il `din_id` rimane sempre 1.
- `POST /api/config/links` - Aggiunge un nuovo link, accetta un oggetto JSON come corpo della richiesta.

  il parametro `link` rappresenta il canale di comunicazione
  - **1**: DaaS
  - **2**: Inet/IP
  - **3**: MQTT
  - **4**: Seriale

  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{
      "link": 2,
      "din_id": 2
    }' localhost:3000/api/config/links
    ```
    #### Risposta
    Torna un array con un solo elemento, l'id del link aggiornato.
    ```json
    [
      1
    ]
    ```
  </details>
  </br>

> [!WARNING]
> Al momento, quando si aggiorna il link, il `din_id` rimane sempre 1.
- `PUT /api/config/links/:id` - Aggiorna il link con l'id specificato, accetta un oggetto JSON come corpo della richiesta.

  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X PUT -H "Content-Type: application/json" -d '{
      "link": 2,
      "url": "127.0.0.1:1984"
    }' localhost:3000/api/config/links/2
    ```
    #### Risposta
    ```json
    {
      "message": "Link aggiornato con successo."
    }
    ```
  </details>
  </br>

> [!WARNING]
> Al momento, non elimina il link, ma lo aggiorna con i valori di default.
- `DELETE /api/config/links/:id` - Elimina il link con l'id specificato.

  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X DELETE localhost:3000/api/config/links/2
    ```
    #### Risposta
    ```json
    {
      "message": "Link eliminato con successo."
    }
    ```
  </details>
  </br>

### /api/config/dins

> [!WARNING]
> Al momento, restituisce i DIN, con id diverso da 1.
- `GET /api/config/dins` - Restituisce la lista dei DIN configurati.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X GET localhost:3000/api/config/dins
    ```
    #### Risposta
    ```json
    [
      {
        "id": 2,
        "sid": "100",
        "din": "102",
        "p_res": "000",
        "skey": "9efafc3b2a94f"
      }
    ]
    ```
  </details>
  </br>

- `GET /api/config/dins/:id` - Restituisce il DIN con l'id specificato.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X GET localhost:3000/api/config/dins/1
    ```
    #### Risposta
    ```json
    {    
      "id": 1,
      "sid": "100",
      "din": "101",
      "p_res": "000",
      "skey": "3b92a1a3d85b8"
    }
    ```
  </details>
  </br>

- `POST /api/config/dins` - Aggiunge un nuovo DIN, accetta un oggetto JSON come corpo della richiesta.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{
      "sid": "100",
      "din": "104",
      "p_res": "000",
      "skey": "1234567890"
    }' localhost:3000/api/config/dins
    ```
    #### Risposta
    ```json
    {
      "id": 3,
      "sid": "100",
      "din": "104",
      "p_res": "000",
      "skey": "1234567890"
    }
    ```
  </details>
  </br>

- `PUT /api/config/dins/:id` - Aggiorna il DIN con l'id specificato, accetta un oggetto JSON come corpo della richiesta.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X PUT -H "Content-Type: application/json" -d '{
      "din": "105"
    }' localhost:3000/api/config/dins/3
    ```
    #### Risposta
    ```json
    {
      "message": "Din aggiornato con successo."
    }
    ```
  </details>
  </br>

- `DELETE /api/config/dins/:id` - Elimina il DIN con l'id specificato.
  <details>
    <summary>Esempio</summary>
    
    #### Richiesta
    ```bash
    curl -X DELETE localhost:3000/api/config/dins/3
    ```
    #### Risposta
    ```json
    {
      "message": "Din eliminato con successo."
    }
    ```
  </details>
  </br>


## Trubleshooting

- Assicurarsi di includere l'intestazione `Content-Type: application/json` nelle richieste POST e PUT.
- la console del server dovrebbe riportare in modo più dettagliato l'errore che si è verificato, controllare la console per ulteriori informazioni.
- Nel caso di danni al database, è possibile eliminare il file `db.sqlite` ed eseguire i comandi `npm run db:migrate` e `npm run db:seed:all` per ripristinare il database.
