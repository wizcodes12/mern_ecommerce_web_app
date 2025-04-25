
const Order = require('../models/orderModel');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');



const orderController = {
  createOrder: async (req, res) => {
    try {
      const { productId, quantity, totalPrice, billingDetails, upiId,isOfferProduct } = req.body;
      const newOrder = new Order({
        user: req.user.id,
        product: productId,
        quantity,
        totalPrice,
        billingDetails,
        upiId,
        isOfferProduct 
      });
      await newOrder.save();

      // Send email
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: billingDetails.email,
        subject: 'Order Confirmation - TronixMart',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
            <div style="text-align: center; padding-bottom: 20px;">
              <!-- Replace 'your-logo-url' with the actual URL of your logo -->
              <img src="https://cdn.vectorstock.com/i/500p/60/06/letter-t-and-m-tm-logo-design-template-minimal-vector-50956006.jpg" alt="TronixMart Logo" style="max-width: 150px; margin-bottom: 20px;">
              
            </div>
            <div style="background-color: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #ff6b6b; text-align: center;">Thank you for your order!</h2>
              <p style="text-align: center; font-size: 1.2rem; color: #4a4a4a;">Hi ${billingDetails.name},</p>
              <p style="text-align: center; font-size: 1rem; color: #4a4a4a;">We are excited to inform you that your order has been successfully placed. Below are the details of your order:</p>
              <div style="border-top: 1px solid #ddd; margin: 20px 0;"></div>
              
              <h4 style="color: #ff6b6b; text-align: center;">Billing Details</h4>
              <p style="font-size: 1rem; color: #4a4a4a;"><strong>Name:</strong> ${billingDetails.name}</p>
              <p style="font-size: 1rem; color: #4a4a4a;"><strong>Email:</strong> ${billingDetails.email}</p>
              <p style="font-size: 1rem; color: #4a4a4a;"><strong>Phone:</strong> ${billingDetails.phone}</p>
              <p style="font-size: 1rem; color: #4a4a4a;"><strong>Address:</strong> ${billingDetails.address}</p>
              <div style="border-top: 1px solid #ddd; margin: 20px 0;"></div>
              <p style="text-align: center; font-size: 1rem; color: #4a4a4a;">We will send you another email with the tracking details once your product is shipped.</p>
              <p style="text-align: center; color: #ff6b6b; font-size: 1rem;">Thank you for shopping with TronixMart!</p>
            </div>
          </div>
        `
      };

      transporter.sendMail(mailOptions);

      res.status(201).json({ 
        msg: 'Order created successfully', 
        order: newOrder
      });
    } catch (error) {
      console.error('Error in createOrder:', error);
      res.status(500).json({ msg: error.message });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate('user').populate('product');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getUserOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id })
        .populate('product')  // Make sure to populate the product field
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  cancelOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
      }
      
      if (order.status === 'Delivered') {
        return res.status(400).json({ msg: 'Cannot cancel a delivered order' });
      }
      
      order.status = 'Cancelled';
      await order.save();
      
      res.json({ msg: 'Order cancelled successfully', order });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  getOrderDetails: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('product');
      if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  
  generateInvoice: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('product');
      if (!order) {
        return res.status(404).json({ msg: 'Order not found' });
      }
  
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
      doc.pipe(res);
  
      // Add content to the PDF here
      doc.fontSize(25).text('Invoice', 100, 80);
      doc.fontSize(15).text(`Order ID: ${order._id}`, 100, 120);
      doc.text(`Product: ${order.product.name}`, 100, 140);
      doc.text(`Quantity: ${order.quantity}`, 100, 160);
      doc.text(`Total Price: ₹${order.totalPrice}`, 100, 180);
  
      doc.end();
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

};






module.exports = orderController;
