const express = require('express');
const router = express.Router();
const webController = require('./web.controller');

router.post('/early-access', webController.joinWaitlist);

module.exports = router;
