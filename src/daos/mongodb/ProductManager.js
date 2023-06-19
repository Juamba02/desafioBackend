import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

class ProductManager {
  connection = mongoose.connect("mongodb+srv://Juamba02:Juamba02@cluster0.qfqgbxb.mongodb.net/?retryWrites=true&w=majority")

  getProducts = async () => {
    let result = await productsModel.find().lean()
    return result;
  };

  addProduct = async (product) => {
    console.log(product);
    try {
      let result = await productsModel.create(product);
      return result;
    }catch{
      return "Código ya existente"
    }
  
  };

  getProductById = async (id) => {
    let result = await productsModel.findOne( {_id: id} )
    return result;
  };

  updateProduct = async (id, updatedProperties) =>{
    let result = await productsModel.updateOne({_id: id}, {$set: updatedProperties});
    return result;
  }

  deleteProduct = async (id) => {
    let result = await productsModel.deleteOne({_id: id});
    return result;
  }
}

export default ProductManager;