import { Router } from "express";
import fs from "fs";
import { cM } from "../server.js";

const router = Router();

router.post("/", async (req, res) => {
  const message = await cM.addCart();  
  res.send({ status:"success", payload: message });
});

router.get("/", async (req, res) => {
  const carts = await cM.getCarts();
  res.send({ status: "success", payload: carts })
})

router.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  const products = await cM.getCartProducts(id);
  if (!products){
    res.send({ status: "Error, invalid ID" });
  }else{
    res.send({ status: "success", payload: products });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const message = await cM.addProduct(cartId, productId);
  res.send({status: message});
});

router.delete("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const message = await cM.deleteProductFromCart(cartId, productId);
  res.send({status: message});
});

router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const message = await cM.deleteAllProductsFromCart(cartId);
  res.send({status: message});
});

router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body;
  const message = await cM.updateQuantity(cartId, productId, quantity);
  res.send({ payload: message })
})

export default router;
