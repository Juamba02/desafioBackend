import express from "express";
import ProductManager from "./classes/app.js";

const app = express();

const manager = new ProductManager();

app.get('/productos', async (req, res) =>{
    const productos = await manager.getProducts();
    if(req.query.limit){
        res.send(productos.splice(0, req.query.limit))
    }else{
        res.send(productos);
    }
})

app.get('/productos/:id', async (req, res) =>{
    const producto = await manager.getProductById(req.params.id)
    res.send(producto)
})

app.listen(3000, () =>{console.log("Servidor levantado");})