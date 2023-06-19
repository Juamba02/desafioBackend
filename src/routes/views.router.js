import { Router } from "express";
import { socketServer, pM } from "../server.js";

const router = Router();

router.get('/', async (req, res) => {
  const products = await pM.getProducts().then((products) => {
    const context = {
      productos: products.map(producto => {
        return {
          title: producto.title,
          description: producto.description,
          category: producto.category,
          price: producto.price,
          thumbnail: producto.thumbnail,
          code: producto.code,
          stock: producto.stock
        }
      })
    }
      res.render('home', { style: "styles.css", title: "Productos", products: context.productos })
  });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await pM.getProducts().then((products) => {
    const context = {
      productos: products.map(producto => {
        return {
          title: producto.title,
          description: producto.description,
          category: producto.category,
          price: producto.price,
          thumbnail: producto.thumbnail,
          code: producto.code,
          stock: producto.stock
        }
      })
    }
      res.render('realTimeProducts', { style: "styles.css", title: "Productos", products: context.productos })
  });
});

router.get('/chat', async (req, res) => {
  res.render('chat');
})

export default router;