import mongoose from "mongoose";
import { productsModel } from "./models/products.model.js";

class ProductManager {
  connection = mongoose.connect(
    "mongodb+srv://Juamba02:Juamba02@cluster0.qfqgbxb.mongodb.net/?retryWrites=true&w=majority"
  );

  getProducts = async (
    limit = 10,
    page = 1,
    sort = 0,
    filtro = null,
    filtroVal = null
  ) => {
    let filtros = {};
    if (filtro != "" && filtroVal != "") {
      filtros = { [filtro]: filtroVal };
    }
    let result = await productsModel.paginate(filtros, {
      limit: limit,
      page: page,
      sort: { price: sort },
    });
    return result;
  };

  addProduct = async (product) => {
    console.log(product);
    try {
      let result = await productsModel.create(product);
      return result;
    } catch {
      return "Código ya existente";
    }
  };

  getProductById = async (id) => {
    try {
      let result = await productsModel.findOne({ _id: id });
      return result;
    } catch {
      let result = "ID invalido!";
      return result;
    }
  };

  updateProduct = async (id, updatedProperties) => {
    try {
      let result = await productsModel.updateOne(
        { _id: id },
        { $set: updatedProperties }
      );
      return await this.getProductById(id);
    } catch {
      return "ID invalido!";
    }
  };

  deleteProduct = async (id) => {
    try {
      let result = await productsModel.deleteOne({ _id: id });
      return result;
    } catch {
      return "ID invalido!";
    }
  };
}

export default ProductManager;
