const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.verifyToken, ticketController.createTicket);
router.get('/', authMiddleware.verifyToken, ticketController.getAllTicket);
router.get('/:id', authMiddleware.verifyToken, ticketController.getTicketById);
router.put('/:id/status', authMiddleware.verifyToken, ticketController.updateTicketStatus);
router.put('/:id/assign', authMiddleware.verifyToken, ticketController.assignTicket);
router.post('/:id/comments', authMiddleware.verifyToken, ticketController.addComment);

module.exports = router;