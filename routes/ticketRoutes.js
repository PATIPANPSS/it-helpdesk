const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.verifyToken, ticketController.createTicket);
router.get('/', authMiddleware.verifyToken, ticketController.getAllTicket);
router.get('/:id', authMiddleware.verifyToken, ticketController.getTicketById);

module.exports = router;