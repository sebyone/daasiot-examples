const express = require('express');
const router = express.Router();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

router.get('/', (req, res) => {
    res.render("pages/index", { host, port });
});

module.exports = router;

