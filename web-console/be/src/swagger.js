const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load the OpenAPI specification
const swaggerDocument = YAML.load(path.join(__dirname, 'api-specifications', 'api-spec.yml'));

const app = express();

const options = {
    explorer: true,
    customSiteTitle: "Documentazione API daas-nodejs",
    customfavIcon: "/static/img/favicon.png",
    customCss: ".swagger-ui .topbar { background-color: #f1f1f1; } .swagger-ui .topbar .link { height: 40px;  content: url('/static/img/DaaS-IoT_logo.png'); }",
    swaggerOptions: {
        url: "/api-docs/swagger.json",
    },
};

// Serve the Swagger UI documentation
app.get("/api-docs/swagger.json", (req, res) => res.json(swaggerDocument));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

module.exports = app;
