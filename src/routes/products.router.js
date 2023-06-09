import { Router } from "express";
import ProductManager from "../daos/mongodb/ProductManager.js";

const router = Router();
const pM = new ProductManager();

router.get("/", async (req, res) => {
  let limit = Number(req.query.limit);
  let page = Number(req.query.page);
  let sort = Number(req.query.sort);
  let filtro = req.query.filtro;
  let filtroVal = req.query.filtroVal;

  const products = await pM.getProducts(limit, page, sort, filtro, filtroVal);
  
    res.send({ status: "success", payload: products });
 
});

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;
  const product = await pM.getProductById(id);
  if (product == undefined) {
    res.send({ status: "Error, invalid ID!" });
  } else {
    res.send({ status: "success", payload: product });
  }
});

router.post("/", async (req, res) => {
  const product = req.body;
  const message = await pM.addProduct(product);
  const products = await pM.getProducts();
  req.socketServer.sockets.emit("products", products);
  res.send({ status: message });
});

router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const updatedProperties = req.body;
  const message = await pM.updateProduct(id, updatedProperties);
  res.send({ status: message });
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  const message = await pM.deleteProduct(id);
  res.send({ status: message });
});

export default router;
