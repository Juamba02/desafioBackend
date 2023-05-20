import { Router } from "express";
import fs from "fs";

const router = Router();

const path = "./src/files/carts.json";
const productsPath = "./src/files/products.json";

const searchList = async (path) => {
  if (fs.existsSync(path)) {
    const data = await fs.promises.readFile(path, "utf-8");
    const list = await JSON.parse(data);
    return list;
  } else {
    return [];
  }
};

router.post("/", async (req, res) => {
  const carts = await searchList(path);
  const cart = {
    id: carts.length,
    products: [],
  };
  carts.push(cart);
  await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
  res.send({ status: "success" });
});

router.get("/:cid", async (req, res) => {
  const carts = await searchList(path);
  if (carts[req.params.cid] == undefined) {
    res.send({ status: "Error, invalid ID!" });
  } else {
    res.send({ status: "success", payload: carts[req.params.cid].products });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const carts = await searchList(path);
  if (carts[req.params.cid] == undefined) {
    res.send({ status: "Error, invalid cart ID!" });
  } else {
    const products = await searchList(productsPath);
    if (products[req.params.pid] == undefined) {
      res.send({ status: "Error, invalid product ID!" });
    } else {
      const searchProduct = carts[req.params.cid].products.find(
        (item) => item.id === req.params.pid
      );
      if (searchProduct) {
        searchProduct.quantity += 1;
        await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
        res.send({ status: "success" });
      } else {
        carts[req.params.cid].products.push({
          id: req.params.pid,
          quantity: 1,
        });
        await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
        res.send({ status: "success" });
      }
    }
  }
});

export default router;
