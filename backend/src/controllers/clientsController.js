// Aqui en el controlador iran todos los metodos 
// ( CRUD ) 

const clientsController = {};
import { request } from "express";
import clientsModel from "../models/Clients.js";

// SELECT
clientsController.getClients = async (req, res) => {
    const clients = await clientsModel.find();
    res.json(clients);
};

// INSERT 
clientsController.createClients = async (req, res) => {
   const { name, lastName, birthday, email, password, telephone, dui, isVerified } = req.body;
   const newClient = new clientsModel({ name, lastName, birthday, email, password, telephone, dui, isVerified });
   await newClient.save();
   res.json({ message: "Cliente creado con éxito" });
};

// DELETE
clientsController.deleteClients = async (req, res) => {
    const deleteClients = await clientsModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Cliente eliminado" });
};

// UPDATE
clientsController.updateClients = async (req, res) => {
    const { name, lastName, birthday, email, password, telephone, dui, isVerified } = req.body;
    const updateClient = await clientsModel.findByIdAndUpdate(
        req.params.id,
        { name, lastName, birthday, email, password, telephone, dui, isVerified },
        { new: true }
    );

    res.json({ message: "Cliente actualizado" });
};

// SELECT CLIENT BY ID // OPCIONAL
clientsController.getClient = async (req, res) => {
    const client = await clientsModel.findById(req.params.id);
    res.json(client);
};

export default clientsController;

// // Aqui en el controlador iran todos los metodos 
// // ( CRUD ) 

// const clientsController = {};
// import clientsModel from "../models/Clients.js";

// // SELECT - Obtener todos los clientes
// clientsController.getClients = async (req, res) => {
//     try {
//         const clients = await clientsModel.find();
//         res.json(clients);
//     } catch (error) {
//         res.status(500).json({ message: "Error al obtener los clientes", error });
//     }
// };

// // INSERT - Crear un nuevo cliente
// clientsController.createClients = async (req, res) => {
//     try {
//         const { name, lastname, birthday, email, password, telephone, dui, isVerified } = req.body;
//         const newClient = new clientsModel({ name, lastname, birthday, email, password, telephone, dui, isVerified });
//         await newClient.save();
//         res.json({ message: "Cliente creado con éxito" });
//     } catch (error) {
//         res.status(500).json({ message: "Error al crear el cliente", error });
//     }
// };

// // DELETE - Eliminar cliente por ID
// clientsController.deleteClients = async (req, res) => {
//     try {
//         await clientsModel.findByIdAndDelete(req.params.id);
//         res.json({ message: "Cliente eliminado con éxito" });
//     } catch (error) {
//         res.status(500).json({ message: "Error al eliminar el cliente", error });
//     }
// };

// // UPDATE - Actualizar cliente por ID
// clientsController.updateClients = async (req, res) => {
//     try {
//         const { name, lastname, birthday, email, password, telephone, dui, isVerified } = req.body;
//         const updatedClient = await clientsModel.findByIdAndUpdate(
//             req.params.id,
//             { name, lastname, birthday, email, password, telephone, dui, isVerified },
//             { new: true }
//         );

//         res.json({ message: "Cliente actualizado con éxito", updatedClient });
//     } catch (error) {
//         res.status(500).json({ message: "Error al actualizar el cliente", error });
//     }
// };

// // SELECT BY ID - Obtener cliente por ID
// clientsController.getClient = async (req, res) => {
//     try {
//         const client = await clientsModel.findById(req.params.id);
//         if (!client) {
//             return res.status(404).json({ message: "Cliente no encontrado" });
//         }
//         res.json(client);
//     } catch (error) {
//         res.status(500).json({ message: "Error al obtener el cliente", error });
//     }
// };

// export default clientsController;
// Aqui en el controlador iran todos los metodos 
// ( CRUD ) 