import { Router } from "express";
import fs from "fs";

const router = Router();

const path = "./src/files/products.json";

const searchProductList = async () => {
  if (fs.existsSync(path)) {
    const data = await fs.promises.readFile(path, "utf-8");
    const products = await JSON.parse(data);
    return products;
  } else {
    return [];
  }
};

router.get("/", async (req, res) => {
  const products = await searchProductList();
  if (req.query.limit) {
    res.send(products.splice(0, req.query.limit));
  } else {
    res.send({ status: "success", payload: products });
  }
});

router.get("/:pid", async (req, res) => {
  const products = await searchProductList();
  const product = products.find((product) => product.id == req.params.pid);
  if (product == undefined) {
    res.send({ status: "Error, invalid ID!" });
  } else {
    res.send({ status: "success", payload: product });
  }
});

router.post("/", async (req, res) => {
  const product = req.body;
  if (
    product.title != undefined &&
    product.description != undefined &&
    product.code != undefined &&
    product.price != undefined &&
    product.status != undefined &&
    product.stock != undefined &&
    product.category != undefined
  ) {
    const products = await searchProductList();
    product.id = products.length;
    products.push(product);
    await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));
    res.send({ status: "success" });
  } else {
    res.send({ status: "Error, please complete the information provided" });
  }
});

router.put("/:pid", async (req, res) => {
  const products = await searchProductList();
  if (products[req.params.pid] == undefined) {
    res.send({ status: "Error, invalid ID!" });
  } else {
    const keys = Object.keys(req.body);
    for (let i = 0; i < keys.length; i++) {
      products[req.params.pid][keys[i]] = req.body[keys[i]];
    }
    await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));
    res.send({ status: "success" });
  }
});

router.delete("/:pid", async (req, res) => {
  const products = await searchProductList();
  if (products[req.params.pid] == undefined) {
    res.send({ status: "Error, invalid ID!" });
  } else {
    products.splice(req.params.pid, 1);
    await fs.promises.writeFile(path, JSON.stringify(products, null, "\t"));
    res.send({ status: "success" });
  }
});

export default router;
