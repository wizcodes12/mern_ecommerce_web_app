const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/create', auth, orderController.createOrder);
router.get('/all', auth, orderController.getAllOrders);

router.get('/user', auth, orderController.getUserOrders);
router.put('/:id/cancel', auth, orderController.cancelOrder);

router.get('/:id', auth, orderController.getOrderDetails);
router.get('/:id/invoice', auth, orderController.generateInvoice);

// router.get('/:id', auth, orderController.getOrderById);


// router.get('/:id/invoice', auth, orderController.generateInvoice);


module.exports = router;