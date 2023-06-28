import { pM } from "../../server.js";
import { cartModel } from "./models/carts.model.js";
import res from "express/lib/response.js";
import mongoose from "mongoose";

class CartManager {
  connection = mongoose.connect("mongodb+srv://Juamba02:Juamba02@cluster0.qfqgbxb.mongodb.net/?retryWrites=true&w=majority")

  getCarts = async () => {
    const result = await cartModel.find();
    return result;
  }

  getCartById = async (id) => {
    const result = await cartModel.findOne({_id: id}).populate("products.product");
    return result;
  }
  

  addCart = async () => {
      const result = await cartModel.create({products: []});
      return result;
  }

  getCartProducts = async (id) => {
     const cart = await this.getCartById(id);
     const products = cart.products;
     return products;
  }

  addProduct = async (cartId, productId) => {
    const product = await pM.getProductById(productId);
    const cart = await this.getCartById(cartId);
    console.log(productId, cartId);
    const index = cart.products.findIndex((item) => {
      console.log(item.product);
      return item.product.toString() === product._id.toString();
    })
    console.log(index);
    if(index == -1){
      cart.products.push({ product: product, quantity: 1 });
    }else{
      cart.products[index].quantity++;
    }
    await cart.save();
    console.log("agregado al carrito!");
    return;
  }

  deleteProductFromCart = async (cartId, productId) => {
    try{
      const cart = await this.getCartById(cartId);
      cart.products.pull(productId);
      await cart.save();
      return "Producto eliminado!";
    }catch{
      return "Algun ID invalido!";
    }
  }

  deleteAllProductsFromCart = async (cartId) => {
    try{
      const cart = await this.getCartById(cartId);
      cart.products = [];
      await cart.save();
      return "Productos eliminados!";
    }catch{
      return "Algun ID invalido!";
    }
  }

  updateQuantity = async (cartId, productId, quantity) => {
    try {
      const cart = await this.getCartById(cartId);
      const cantidad = quantity.quantity
      let funciono = false

      cart.products.forEach(product => {
        if(product.id == productId){
          product.quantity = cantidad
          cart.save()
          funciono = true
        }else{
          funciono = false
        }
      });

      if(funciono) {
        return "Cantidad actualizada!"
      }else{
        return "Producto no encontrado en el carrito"
      }
    } catch {
      return "ID invalido!"
    }
  }
}

export default CartManager;