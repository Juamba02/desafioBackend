import { Router } from "express";
import { socketServer, pM } from "../server.js";

const router = Router();

router.get('/', async (req, res) => {
  await pM.getProducts().then((products) => {
      res.render('home', { style: "styles.css", title: "Productos", products })
  });
});

router.get('/realtimeproducts', async (req, res) => {
  await pM.getProducts().then(() => {
      res.render('realTimeProducts', { style: "styles.css", title: "Productos" })

  });
});

export default router;