import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config.js";
import clientsModel from "../models/Clients.js";
import nodemailer from "nodemailer"; // Para envio de correos electronicos
import crypto from "crypto"; // Para generar un cpdigo aleatorio

const registerClientController = {};

//CREATE: Registrar un nuevo cliente y envia un codigo de verificacion por correo
registerClientController.register = async (req, res) => {
  const {
    name,
    lastName,
    birthday,
    email,
    password,
    telephone,
    dui,
    isVerified,
  } = req.body;

  //Validacion de campos requeridos
  if (
    !name ||
    !lastName ||
    !birthday ||
    !email ||
    !password ||
    !telephone ||
    !dui ||
    !isVerified === undefined // me lo dijo chatgpt , 
  ) {
    return res.status(400).json({ message: "Faltan campos " });
  }

  try {
    //Verificacion si el cliente ya existe
    const existingClient = await clientsModel.findOne({ email });
    if (existingClient) {
      return res.status(409).json({ message: "Client already exists" }); //Codigo 409: conflicto
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newClient = new clientsModel({
      name,
      lastName,
      birthday,
      email,
      password: passwordHash,
      telephone,
      dui: dui || null,
      isVerified,
    });

    await newClient.save();

    //Generar un codigo de verificacio unico
    const verificationCode = crypto.randomBytes(3).toString("hex"); //Codigo corto
    const experisAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas de expiracion

    //Crear un JWT con el codigo y su expiracion
    const tokenCode = jwt.sign(
      {
        email,
        verificationCode,
        experisAt,
      },
      config.JWT.SECRET,
      { expiresIn: "2h" } //El jwt expira en 2 horas
    );

    // Guardar el token en una cookie
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true, // La cookie no será accesible desde JavaScript
      secure: process.env.NODE_ENV === "production", // Solo se envía en HTTPS si estás en producción
      maxAge: 2 * 60 * 60 * 1000, // Duración de la cookie: 2 horas
    });

    //Enviar el correo de verificacion
    const transporter = nodemailer.createTransport({
      service: "gmail", // USa tu servicio de correo preferido
      auth: {
        user: config.email.EMAIL, // Tu correo electronico
        pass: config.email.PASSWORD, // La contraseña de la aplicación (asegúrate de usar una contraseña de app si usas Gmail)
      },
    });

    const mailOptions = {
      from: config.email.username, // Tu correo electronico
      to: email,
      subject: "Verificacion de correo electronico",
      text: `Para verificar tu cuenta, utiliza el siguiente código de verificación: ${verificationCode}\nEste código expirará en 2 horas.\nSi no solicitaste este registro, por favor ignora este correo.`,
    };

    //Enviar correo
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error sanding email" });
      }
      console.log("Email sent:" + info.response);
    });

    // ENviar una respuesta con el codigo de verificacion
    res.status(201).json({
      message:
        "Client registered. Please verify your email with the code sent.",
      token: tokenCode, // Devolver el token para verificacion posterior
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Verificacion del correo electronico al recibir el token
registerClientController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken; //Obtener el token de la cookie

  if (!token) {
    return res.status(400).json({ message: "No verification token provided" });
  }

  try {
    // Verificar y decodificar el jwt
    const decoded = jwt.verify(token, config.JWT.SECRET);
    const { email, verificationCode: storedCode } = decoded;

    //Comparar el codigo de recibido con el almacenado en el JWT
    if (verificationCode !== storedCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Marcar al cliente como verificado
    const client = await clientsModel.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Actualizar el cliente como verificado
    client.isVerified = true;
    await client.save();

    // Limpiar la cookie despuesd de la verificacion
    res.clearCookie("verificationToken");

    // Generar automáticamente el token de autenticación (login)
    jwt.sign(
      {
        id: client._id,
        userType: "client",
      },
      config.JWT.SECRET,
      {
        expiresIn: config.JWT.EXPIRES,
      },
      (error, authToken) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Error al generar el token de autenticación" });
        }

        // Guardar el token en una cookie
        res.cookie("authToken", authToken, { 
          httpOnly: true,
          secure: process.env.NODE_ENV === "production"
        });
        
        // Responder con éxito e incluir el token
        res.status(200).json({ 
          message: "Email verified successfully. You are now logged in", 
          token: authToken 
        });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  }
};

export default registerClientController;
