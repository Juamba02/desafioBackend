import { Router } from "express";
import { socketServer, pM, cM } from "../server.js";
import passport from "passport";

const router = Router();

router.get("/", async (req, res) => {
  const products = await pM.getProducts();
  const context = {
    productos: products.docs.map((producto) => {
      return {
        title: producto.title,
        description: producto.description,
        category: producto.category,
        price: producto.price,
        thumbnail: producto.thumbnail,
        code: producto.code,
        stock: producto.stock,
      };
    }),
  };
  const user = req.session.user
  let message = '';
  if(user.email == "adminCoder@coder.com") {
    message = "Usted tiene el rol de administrador"
  }else{
    message = "Usted tiene el rol de usuario";
  }
  res.render("products", {
    style: "styles.css",
    title: "Productos",
    products: context.productos,
    user: user,
    message: message
  });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await pM.getProducts();
  const context = {
    productos: products.docs.map((producto) => {
      return {
        title: producto.title,
        description: producto.description,
        category: producto.category,
        price: producto.price,
        thumbnail: producto.thumbnail,
        code: producto.code,
        stock: producto.stock,
      };
    }),
  };
  res.render("realTimeProducts", {
    style: "styles.css",
    title: "Productos",
    products: context.productos,
  });
});

router.get("/chat", async (req, res) => {
  res.render("chat");
});

router.get("/products", async (req, res) => {
  const limit = req.query.limit;
  const page = req.query.page;
  const sort = req.query.sort;
  const filtro = req.query.filtro;
  const filtroVal = req.query.filtroVal;
  const products = await pM.getProducts(limit, page, sort, filtro, filtroVal);

  const context = {
    productos: products.docs.map((producto) => {
      return {
        id: producto._id.toString(),
        title: producto.title,
        description: producto.description,
        category: producto.category,
        price: producto.price,
        thumbnail: producto.thumbnail,
        code: producto.code,
        stock: producto.stock,
      };
    }),
  };

  res.render("products", {
    style: "styles.css",
    title: "Productos",
    products: context.productos,
    page: page,
  });
});

router.get("/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  const product = await pM.getProductById(productId);

  res.render("product", {
    style: "styles.css",
    title: product.title,
    description: product.description,
    category: product.category,
    price: product.price,
    thumbnail: product.thumbnail,
    code: product.code,
    stock: product.stock,
    id: productId
  });
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cM.getCartById(cartId);
  const context = {
    productos: cart.products.map((producto) => {
      return {
        id: producto._id.toString(),
        title: producto.product.title,
        description: producto.product.description,
        category: producto.product.category,
        price: producto.product.price,
        thumbnail: producto.product.thumbnail,
        code: producto.product.code,
        stock: producto.product.stock,
      };
    }),
  };
  console.log(context.productos);
  res.render("carts", {
    style: "styles.css",
    title: "Carrito",
    products: context.productos,
  });
});

router.get('/register', (req, res) => {

  res.render('register');

})



router.get('/login', (req, res) => {

  res.render('login');

})

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {

  res.render('profile', {

      user: req.user

  });
})


export default router;
