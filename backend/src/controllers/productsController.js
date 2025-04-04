// Aqui en el controlador iran todos los metodos 
// ( CRUD ) 

const productsController = {};
import { request } from "express";
import productsModel from "../models/Products.js";

// SELECT

productsController.getProducts = async (req, res) => {
    const products = await productsModel.find();
    res.json(products)
} 

// INSERT 
productsController.createProducts = async (req, res) => {
   const {name, description, price, stock} = req.body;
   const newProduct = new productsModel ({ name, description, price, stock });
   await  newProduct.save();
   res.json({message: "Producto creador con exito"})
}


// DELETE 
productsController.deleteProducts = async (req, res) =>  {
  const deleteProducts = await productsModel.findByIdAndDelete(req.params.id);
  res.json({message: "Producto eliminado"})
}

// UPDATE

productsController.updateProducts = async (req, res) => {
    const { name, description, price,stock } = req.body;
    const  updateProduct = await productsModel.findByIdAndUpdate (
        req.params.id,
        {name, description, price, stock}, {new: true }
    );

    res.json({ message: "Producto actualizado"})
}

// SELECT PRODUCTS BY ID //OPCIONAL 

productsController.getProduct = async (req, res) => {
    const product = await productsModel.findById(req.params.id);
    res.json(product);
};

export default productsController;

