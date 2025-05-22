import express from "express";
import providersController from "../controllers/providersController.js";
//importar multer 
import multer from "multer";

//Configurar carpeta local que guarde el registro de las imagenes subidas
const router = express.Router();
const upload = multer({dest:"public/"})
router
.route("/")
.get(providersController.getProviders)
.post(upload.single("image"), providersController.createProvider);

export default router;
