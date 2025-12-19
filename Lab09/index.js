const express = require('express')
const path = require('path')
const fs = require('fs')
const mongoose = require("mongoose");

const app = express()

// hadles the pst req containing url encoded data in the body of the requeat
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.json()) inbuilt
app.use("/views", express.static(path.join(process.cwd(), "/views")));

let orders;
const storagePath = path.join(process.cwd(), "orders.json");

// to serve static files 
app.use(express.static(path.join(__dirname, 'Nodejs')));

// GET method
// Routes
// get all orders
app.get('/', (req, res) => {
    res.json(orders);
})

// we can also get all orders by this
app.get('/orders', (req, res) => {
    res.json(orders);
})



// search orders by product name 
app.get('/orders/productName/:subName', (req, res) => {

    const subName = req.params.subName.toLowerCase();

    const result = orders.filter(c =>
        c.productName.toLowerCase().includes(subName)
    );

    res.json(result);
})


// get one order by symbol
app.get('/orders/:chacha', (req, res) => {

    const symbol = req.params.chacha;
    const order = orders.find(c => c.orderId == symbol);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
})

// POST Method
// request-parser will help us in parsing the data submitted through form
// whatever it will receive it will add to the order's object
app.post('/orders', (req, res) => {
    // const rawBody = req.body;

    // add new order to array
    orders.push(req.body);

    // write updated list to file
    fs.writeFile(storagePath, JSON.stringify(orders, null, 2), (err)=> console.log(err));

    res.write('Order added');
    res.end();
})


// Load json file
fs.readFile(storagePath, (err, data) => {
    if (!err) {
        orders = JSON.parse(data);
        console.log("Orders loaded:", orders.length);
        app.listen(8080, () => console.log("Server running on 8080"));
    } 
    else {
        console.log("Error loading file:", err);
    }
})

