import employeeModel from "../models/Employees.js";

import bcrypt from "bcryptjs"; // Encriptar
import jsonwebtoken from "jsonwebtoken"; //Tpken
import { config } from "../config.js";

//Creamos un array de funciones
const registerEmployeeController = {};

registerEmployeeController.register = async (req, res) => {
  //Pedimos los campos a registrar
  const {
    name,
    lastName,
    birthday,
    email,
    address,
    hireDate,
    password,
    telephone,
    dui,
    isssNumber,
    isVerified,
  } = req.body;

  try {
    //Verificamos si el usuario ya existe
    const employeeExist = await employeeModel.findOne({ email });
    if (employeeExist) {
      return res.json({ message: "El usuario ya existe" });
    }

    // Encriptar la contrasena
    const passwordHash = await bcrypt.hash(password, 10);

    //Guardo el empleado en la base de datos
    const newEmployee = new employeeModel({
      name,
      lastName,
      birthday,
      email,
      address,
      hireDate,
      password: passwordHash,
      telephone,
      dui,
      isssNumber,
      isVerified,
    });
    await newEmployee.save();

    // TOKEN
    jsonwebtoken.sign(
      //1- Que voy a guardar
      { id: newEmployee._id },
      //2- secreto
      config.JWT.SECRET,
      //3- Cuando expira
      { expiresIn: config.JWT.EXPIRES },
      //4- Funcion flecha
      (error, token) => {
        if (error) console.log("error");

        res.cookie("authToken", token);
        res.json({ message: "Employee register" });
      }
    );

  } catch (error) {
    console.log("error" + error)
    res.json({ message: "sign up error" });
  }
};

export default registerEmployeeController;
