var express = require('express');
var mongoose = require('mongoose');
var app = express();
var cors = require('cors');
var cookieParser = require('cookie-parser');
require('dotenv').config();

var port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true,  // This allows the server to accept cookies
}));

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    console.log({ msg: 'example for get' });
    res.send('Hello, this is an example GET response.');
});

app.use('/user', require('./routes/useRoutes'));
app.use('/uploads', express.static('uploads'));
app.use('/api/products', require('./routes/productRoutes'));

app.use('/api/orders', require('./routes/orderRoutes'));

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});



var URI = process.env.MONGODB_URL;

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Atlas connection established...');
}).catch(error => {
    console.log('MongoDB connection error:', error);
});