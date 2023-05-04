const express = require("express");
require("./db/config");
const User = require("./db/User");
const app = express();
const cors = require("cors");

const Product = require("./db/Products");

app.use(express.json());
app.use(cors());
app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let data = await user.save();
  data = data.toObject();
  delete data.password;
  console.log(data);
  resp.send(data);
});

app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    console.log(req.body);
    let user = await User.findOne(req.body).select("-password");
    // let user = req.body;
    if (user) {
      resp.send(user);
    } else {
      resp.send({ result: "no user found" });
    }
  } else {
    resp.send({ result: "send correct email and password" });
  }
});

app.post("/add-product", async (req, resp) => {
  let product = new Product(req.body);
  let data = await product.save();
  console.warn(data);
  resp.send(data);
});

app.get("/products", async (req, resp) => {
  const products = await Product.find();
  if (products.length > 0) {
    resp.send(products);
  } else {
    [resp.send({ result: "no product found" })];
  }
});

app.delete("/product/:id", async (req, resp) => {
  let result = await Product.deleteOne({ _id: req.params.id });
  resp.send(result);
});

app.get("/product/:id", async (req, resp) => {
  let result = await Product.findOne({ _id: req.params.id });

  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "not found " });
  }
});

app.listen(5000);
