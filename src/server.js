import express, { json, urlencoded } from "express";
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import ProductManager from "./daos/mongodb/ProductManager.js";
import CartManager from "./daos/mongodb/CartManager.js";
import MessageManager from "./daos/mongodb/MessageManager.js";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
export const pM = new ProductManager();
export const cM = new CartManager();
const products = await pM.getProducts();
const messageManager = new MessageManager()

app.use(express.json());
app.engine("handlebars", handlebars.engine());
app.use(urlencoded({ extended: true }));

app.set("views", __dirname + "/views");

app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8080, () => {
  console.log("Servidor levantado");
});

export const socketServer = new Server(expressServer);

socketServer.on("connection", async (socket) => {
  console.log("New connection");
  socket.emit("products", await pM.getProducts());
});

app.use(function (req, res, next) {
  req.socketServer = socketServer;
  next();
});

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/", viewsRouter);



socketServer.on("connection", (socket) => {
  console.log("connected " + socket.id);

  socket.on("message", (data) => {
    console.log(data);
    messageManager.saveMessage(data)
    messageManager.getMessages().then((messages) => {
      const context = {
        mensajes: messages.map(message =>{
          return {
            user: message.user,
            message: message.message
          }
        })
      }
      socketServer.emit("imprimir", context.mensajes);
    })


    
  });
});

