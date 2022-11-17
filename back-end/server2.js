const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const app = express();

mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const Product = mongoose.model('Product', {
  id: String,
  name: String,
  price: String
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

async function addToDB(p) {
  await p.save();
}

async function delFromDB(pid) {
  await Product.deleteOne({id: pid});
}

async function getColFromDB() {
  let parray = await Product.find({});
  return parray;
}

// parse application/json
app.use(bodyParser.json());

let cart = [];

app.get('/api/products/', async (req, res) => {
  let pArray = await getColFromDB()
  res.send(pArray);
});

app.get('/api/cart', (req, res) => {
  res.send(cart);
});

app.get('/api/products/:id', async (req, res) => {
  let productid = req.params.id;
  console.log("product id ==" + productid);
  let product = await Product.find({"id": productid});
  console.log("Found this");
  console.log(product);
  res.send(product);
});

app.post('/api/products', async (req, res) => {
  const id = crypto.randomUUID();
  let product = new Product({
    id: id,
    name: req.body.name,
    price: req.body.price
  });
  await addToDB(product);
  res.send(product);
});

app.post('/api/cart/:id', (req, res) => {
  let productid = req.params.id;
  var quantItem = 1;
  if (cart.find(item => item.id == productid) != undefined) {
    let index = cart.indexOf(cart.find(item => item.id == productid));
    cart[index].quantity = parseInt(cart[index].quantity + 1);
    res.send(cart[index]);
  }
  else {
    let item = {
      id: productid,
      quantity: parseInt(quantItem)
    };
    cart.push(item);
    res.send(item);
  }
});

app.put('/api/cart/:id/:quantity', (req, res) => {
  let cartItem = cart.find(item => item.id == req.params.id);
  if (cartItem == undefined) {
    res.status(404).send();
  }
  let index = cart.indexOf(cart.find(item => item.id == req.params.id));
  if (req.params.quantity == 0) {
    cart.splice(index, 1);
    cartItem.quantity = 0;
  }
  else {
    cart[index].quantity = parseInt(req.params.quantity);
    cartItem.quantity = parseInt(req.params.quantity);
  }
  res.send(cartItem);
}); 

app.delete('/api/products/:id', async (req, res) => {
  await delFromDB(req.params.id);
});

app.delete('/api/cart/:id', (req, res) => {
  var oldLen = cart.length;
  cart.splice(cart.indexOf(cart.find(item => item.id == req.params.id)), 1).length;
  if (oldLen != cart.length) {
    res.status(200).send();
  }
  else {
   res.status(404).send(); 
  }
});

app.listen(3009, () => console.log('Server listening on port 3009!'));
