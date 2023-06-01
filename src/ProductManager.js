import fs from "fs";

class ProductManager {
  constructor() {
    this.path = "./src/files/products.json";
  }

  getProducts = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = await JSON.parse(data);
      return products;
    } else {
      return [];
    }
  };

  addProduct = async (title, description, category, price, thumbnail, code, stock) => {
    const completeInformation = (
      title,
      description,
      category,
      price,
      thumbnail,
      code,
      stock
    ) => {
      if (
        title != undefined &&
        description != undefined &&
        category != undefined &&
        price != undefined &&
        thumbnail != undefined &&
        code != undefined &&
        stock != undefined
      ) {
        return true;
      } else {
        return false;
      }
    };

    const products = await this.getProducts();
    if (
      products.length === 0 &&
      completeInformation(title, description,category, price, thumbnail, code, stock)
    ) {
      const product = {
        title,
        description,
        category,
        price,
        thumbnail,
        code,
        stock,
        id: 0,
      };
      products.push(product);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return "success";
    } else if (
      completeInformation(title, description, category, price, thumbnail, code, stock)
    ) {
      let isCodeRepeated = false;
      for (let i = 0; i < products.length; i++) {
        if (products[i].code === code) {
          isCodeRepeated = true;
        }
      }
      if (!isCodeRepeated) {
        const product = {
          title,
          description,
          category,
          price,
          thumbnail,
          code,
          stock,
          id: products.length,
        };
        products.push(product);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(products, null, "\t")
        );
        return "success";
      } else {
        return "The code is repeated!";
      }
    } else {
      return "Error, please complete the information provided";
    }
  };

  getProductById = async (id) => {
    const products = await this.getProducts()
    const product = products.find((product) => product.id === id);
    if (product === undefined) {
      console.log("Invalid Id!");
      return undefined
    } else {
      return product
    }
  };

  updateProduct = async (id, updatedProperties) =>{
    const product = await this.getProductById(id)
    if(product === undefined){
      return "Invalid ID!";
    } else {
      const products = await this.getProducts()
      Object.assign(products[id], updatedProperties);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return "Product updated!";
    }
  }

  deleteProduct = async (id) => {
    const product = await this.getProductById(id)
    if(product === undefined){
      console.log("Invalid Id");
    } else {
      const products = await this.getProducts()
      products.splice(id, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      console.log("Product deleted!");
    }
  }
}

export default ProductManager;