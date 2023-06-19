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
    const result = await cartModel.findOne({_id: id});
    return result;
  }
  

  addCart = async () => {
      const result = await cartModel.create({products: []});
      return result;
  }

  getCartProducts = async (id) => {
     const cart = await this.getCartById(id);
     const products = await cart.products;
     return products;
  }

  addProduct = async (cartId, productId) => {
    const product = await pM.getProductById(productId);
    const cart = await this.getCartById(cartId);
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
    return;
  }
}

export default CartManager;