const Product = require('../models/productModel');
const OfferProduct = require('../models/offerProductModel');
const fs = require('fs');
const path = require('path');

const Combo = require('../models/comboModel');

exports.addProduct = async (req, res) => {
  try {
    const { name, category, price, discountedPrice } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const newProduct = new Product({
      name,
      category,
      price,
      discountedPrice,
      image,
    });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const imagePath = path.join(__dirname, '..', 'uploads', product.image);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image file:', err);
      }
    });
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Offer Product Controllers
exports.addOfferProduct = async (req, res) => {
  try {
    const { name, specialDiscountedPrice } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const newOfferProduct = new OfferProduct({
      name,
      specialDiscountedPrice,
      image,
    });
    await newOfferProduct.save();
    res.status(201).json({ message: 'Offer product added successfully', product: newOfferProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding offer product', error: error.message });
  }
};

exports.getOfferProducts = async (req, res) => {
  try {
    const offerProducts = await OfferProduct.find();
    res.status(200).json(offerProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offer products', error: error.message });
  }
};

exports.deleteOfferProduct = async (req, res) => {
  try {
    const offerProduct = await OfferProduct.findById(req.params.id);
    if (!offerProduct) {
      return res.status(404).json({ message: 'Offer product not found' });
    }
    const imagePath = path.join(__dirname, '..', 'uploads', offerProduct.image);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image file:', err);
      }
    });
    await OfferProduct.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Offer product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting offer product', error: error.message });
  }
};


exports.addCombo = async (req, res) => {
  try {
    const { name, products, price } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const newCombo = new Combo({
      name,
      products: JSON.parse(products),
      price,
      image,
    });
    await newCombo.save();
    res.status(201).json({ message: 'Combo added successfully', combo: newCombo });
  } catch (error) {
    res.status(500).json({ message: 'Error adding combo', error: error.message });
  }
};

exports.getCombos = async (req, res) => {
  try {
    const combos = await Combo.find();
    res.status(200).json(combos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching combos', error: error.message });
  }
};

exports.deleteCombo = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id);
    if (!combo) {
      return res.status(404).json({ message: 'Combo not found' });
    }
    const imagePath = path.join(__dirname, '..', 'uploads', combo.image);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image file:', err);
      }
    });
    await Combo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Combo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting combo', error: error.message });
  }
};