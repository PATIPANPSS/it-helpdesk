const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.verifyToken, ticketController.createTicket);

module.exports = router;