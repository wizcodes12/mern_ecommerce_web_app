const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Regular product routes
router.post('/add', upload.single('image'), productController.addProduct);
router.get('/', productController.getProducts);
router.delete('/:id', productController.deleteProduct);

// Offer product routes
router.post('/offer-products/add', upload.single('image'), productController.addOfferProduct);
router.get('/offer-products', productController.getOfferProducts);
router.delete('/offer-products/:id', productController.deleteOfferProduct);



router.post('/combos/add', upload.single('image'), productController.addCombo);
router.get('/combos', productController.getCombos);
router.delete('/combos/:id', productController.deleteCombo);

module.exports = router;