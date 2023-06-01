import express, {json, urlencoded} from "express";
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";
import { Server } from "socket.io";


const app = express();
export const pM = new ProductManager();
export const cM = new CartManager();
const products = await pM.getProducts();

app.use(express.json());
app.engine('handlebars', handlebars.engine());
app.use(json());
app.use(urlencoded({ extended: true }))


app.set('views',__dirname+'/views');

app.set('view engine', 'handlebars');

app.use(express.static(__dirname+'/public'));

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/", viewsRouter);

const expressServer = app.listen(8080, () => {
  console.log("Servidor levantado");
});

export const socketServer = new Server(expressServer);

socketServer.on("connection", (socket) => {
  console.log("New connection");
  socket.emit('products', products);
})

app.use(function (req, res, next) {
  req.socketServer = socketServer;
  next();
})






