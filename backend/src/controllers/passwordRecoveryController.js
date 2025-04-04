import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import clientsModel from "../models/Clients.js";
import employeesModel from "../models/Employees.js";
import { sendEmail, HTMLRecoveryEmail } from "../utils/passwordRecoveryMail.js";
import { config } from "../config.js";

const passwordRecoveryController = {};

//Solicitar codigo de verificacion
passwordRecoveryController.requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    //Validar que el email no este vacio
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user;
    let userType = null;

    //Buscar primero en la coleccion de clientes
    user = await clientsModel.findOne({ email });
    if (user) {
      userType = "Client";
    } else {
      //Si no es cliente, buscar en la coleccion de empleados
      user = await employeesModel.findOne({ email });
      if (user) {
        userType = "Employee";
      }
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    //Generar un codigo de 6 digitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Crear token JWT con el correo del usuario, el código y el userType
    const token = jwt.sign(
      { email, code, userType, verified: false },
      config.JWT.SECRET,
      { expiresIn: "15mn" }
    );

    //Guardar el token en una cookie
    res.cookie("tokenRecoveryCode", token, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    //Enviar correo con el codigo
    await sendEmail(
      email,
      "Password Recovery  Code",
      `Your verification code is: ${code}`,
      HTMLRecoveryEmail(code)
    );

    res.status(200).json({ message: "Verification code sent to email" });
  } catch (error) {
    res.status(500).json({
      message: "Error sending verification code",
      error: error.message,
    });
  }
};

//Verificar el codigo
passwordRecoveryController.verifyCode = (req, res) => {
    const { code } = req.body;

    try {
        //Validar que el codigo no este vacio
    if(!code) return res.status(400).json({ message: "Code is required" });

    //Extraer el token de las cookies
    const token = req.cookies.tokenRecoveryCode;

    if (!token) {
        return res
        .status(401)
        .json({ message: "Token is missing, unauthorized"});
    }

    //Verificar el token en JWT
      const decoded = jwt.verify(token, config.JWT.SECRET);

      //Verificar si el codigo es correcto
      if (decoded.code !== code) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
      
      //Marcar el token como verificado
      const newToken = jwt.sign(
        { email: decoded.email, code: decoded.code, userType: decoded.userType, verified: true },
        config.JWT.SECRET,
        { expiresIn: "15mn" }
      );

      // Remplazar el token en la cookie con el nuevo token(marcado como verificado)
      res.cookie("tokenRecoveryCode", newToken, {
        httpOnly: true,
        secure: false,
        maxAge: 15 * 60 * 1000,
      });
      
      res.status(200).json({ 
        message: "Code verified successfully" 
    });
    } catch (error) {
      if (error.name === "TokenExpireError") {
        return res
        .status(403)
        .json({ message: "Token has expired, please request a new code"});
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Invalid token" });
      }
      return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
    }
  };

  // Reestablecer contraseña
passwordRecoveryController.resetPassword = async (req, res) => {
    const { newPassword } = req.body;
  
    try {
      // Extraer el token de las cookies
      const token = req.cookies.tokenRecoveryCode;
  
      if (!token) {
        return res.status(401).json({ message: "Token is missing, unauthorized" });
      }
  
      // Verificar el token JWT
      const decoded = jwt.verify(token, config.JWT.SECRET);
  
      // Verificar si el código fue verificado
      if (!decoded.verified) {
        return res.status(400).json({ message: "Code not verified, cannot reset password" });
      }
  
      // Extraer el email y userType del token
      const { email, userType } = decoded;
  
      let user;
  
      // Buscar al usuario dependiendo del userType
      if (userType === "Client") {
        user = await clientsModel.findOne({ email });
      } else if (userType === "Employee") {
        user = await employeesModel.findOne({ email });
      }
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Actualizar la contraseña en la base de datos
      let updatedUser;
      if (userType === "Client") {
        updatedUser = await clientsModel.findOneAndUpdate(
          { email },
          { password: hashedPassword },
          { new: true }
        );
      } else if (userType === "Employee") {
        updatedUser = await employeesModel.findOneAndUpdate(
          { email },
          { password: hashedPassword },
          { new: true }
        );
      }
  
      if (!updatedUser)
        return res.status(404).json({ message: "User not updated" });
  
      // Eliminar la cookie después de usarla
      res.clearCookie("tokenRecoveryCode");
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(403)
          .json({ message: "Token expired, please request a new code" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Invalid token" });
      }
  
      res
        .status(500)
        .json({ message: "Error resetting password", error: error.message });
    }
  };
  
  export default passwordRecoveryController;