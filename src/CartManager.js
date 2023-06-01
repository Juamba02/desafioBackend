import fs from "fs";
import { promises } from "fs";
import { pM } from "./server.js";

class CartManager {
  constructor() {
    this.path = "./src/files/carts.json";
  }

  getCarts = async () => {
    if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        const carts = await JSON.parse(data);
        return carts;
      } else {
        return [];
      }
  }

  getCartById = async (id) => {
    const carts = await this.getCarts();
  
    const cart = carts.find((cart) => cart.id === id);
  
    if (!cart) {
      return "Cart not found";
    } else {
      return cart;
    }
  }
  

  addCart = async () => {
    const carts = await this.getCarts();
    const cart = {
        id: carts.length,
        products: [],
      };
      carts.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
      return "success";
  }

  getCartProducts = async (id) => {
    const cart = await this.getCartById(id);
    if (!cart){
        return undefined    ;
    }else{
        return cart.products;
    }
  }

  addProduct = async (cartId, productId) => {
    const product = await pM.getProductById(productId);
    if (!product) {return "Invalid product"}
    const cart = await this.getCartById(cartId);

    const index = cart.products.findIndex((product) => {
        return product.id == productId;
    });

    if (index == -1) {
        cart.products.push({ id: productId, quantity: 1 });
    } else {
        cart.products[index].quantity++;
    }

    const carts = await this.getCarts()
    const cartIndex = carts.findIndex((cartIterator) => {
        return cartIterator.id == cart.id
    })

    carts[cartIndex] = cart

    await promises.writeFile(this.path, JSON.stringify(carts, null, "\t"))
    return "success";
  }
}

export default CartManager;