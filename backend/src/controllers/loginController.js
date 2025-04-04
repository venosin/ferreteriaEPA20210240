import clientsModel from "../models/Clients.js"
import employeesModel from "../models/Employees.js"
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

// CREATE: Login para clientes, empleados y administrador
loginController.login = async (req, res) => {
  const { email, password } = req.body;

  // Validación de campos requeridos
if (!email || !password) {
  return res.status(400).json({ message: "Faltan campos" });
}

try {
    let userFound;
    let userType;

//Verificar si es el administrador
if (email === config.admin.EMAIL && password === config.admin.PASSWORD) {
    userType = "admin";
    userFound = { _id: "admin" };
} else {
 // Buscar primero en la colección de empleados
 userFound = await employeesModel.findOne({ email });
 if (userFound) {
   userType = "Employee";
   // Comparar las contraseñas de manera correcta (esperar el resultado de la comparación)
   const isMatch = await bcrypt.compare(password, userFound.password);
   if (!isMatch) {
     return res.status(401).json({ message: "Invalid password" });
   }
 } else {
   // Si no es un empleado, buscar en la colección de clientes
   userFound = await clientsModel.findOne({ email });
   if (userFound) {
     userType = "client";
     // Comparar las contraseñas de manera correcta (esperar el resultado de la comparación)
     const isMatch = await bcrypt.compare(password, userFound.password);
     if (!isMatch) {
       return res.status(401).json({ message: "Invalid password" });
     }
   }
 }
}

// Si no se encuentra el usuario en ninguna colección (ni cliente ni empleado), devolver error
if (!userFound) {
    console.log("Usuario no encontrado en ninguna colección");
    return res.status(404).json({ message: "User not found" });
}

//Generar el token JWT

JWT.sign(
    {
        id: userFound._id,
        userType,
    },

    config.JWT.SECRET,
    {
         expiresIn: config.JWT.EXPIRES, 
    },
    (error, token) => {
      if (error) {
        console.error(error);
        return res.json({ message: "Error al generar el token" });
      }

    // Guardar el token en una cookie
      res.cookie("authToken", token, {httpOnly: true });
      res.json({ message: `${userType} login successful`, token });
    }
  );
} catch (error) {
  res.json({ message: "Error", error: error.message });
}
};

export default loginController;


