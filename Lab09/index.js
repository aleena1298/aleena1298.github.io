const express = require('express');
const path = require('path');
const fs = require('fs');
// const mongoose = require("mongoose")

const app = express();

// Body parser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files 
app.use(express.static(path.join(__dirname, 'public')));


let orders = []; 

const storagePath = path.join(__dirname, 'public', 'orders.json');

try {
  const data = fs.readFileSync(storagePath, 'utf8');
  orders = JSON.parse(data);
  console.log("Orders loaded:", orders.length);
} catch (err) {
  console.log("Error loading file:", err);
}

// --------------------
// ROUTES
// --------------------

// Home route
app.get('/', (req, res) => {
  res.json(orders);
});

// Get all orders
app.get('/orders', (req, res) => {
  res.json(orders);
});

// Search orders by product name
app.get('/orders/productName/:subName', (req, res) => {
  const subName = req.params.subName.toLowerCase();

  const result = orders.filter(c =>
    c.productName.toLowerCase().includes(subName)
  );

  res.json(result);
});

// Get order by ID
app.get('/orders/:symbol', (req, res) => {
  const symbol = req.params.symbol;
  const order = orders.find(c => c.orderId == symbol);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
});

// Add new order (in-memory only on Vercel)
app.post('/orders', (req, res) => {
  orders.push(req.body);

  // fs.writeFile(storagePath, JSON.stringify(orders, null, 2), err => console.log(err));

  res.send('Order added (temporary on Vercel)');
});

// app.listen(8080);

// EXPORT APP FOR VERCEL
module.exports = app;
