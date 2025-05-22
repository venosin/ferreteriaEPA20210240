import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

export const validateAuthToken = (allowedUserTypes= []) => {

    return (req, res, next) => {
     try { 
        
       //1- Extraer el token de las cookies 
       const {authToken } = req.cookies;

       //2-Imprimir un mensaje de error si no gay cookies
       if(!authToken){
        return res.json({message:"No authentication token found, you must login homie"})
       }
       //3- Extraer la informacion del token
       const decoded = jsonwebtoken.verify(authToken, config.JWT.SECRET);

       // 4- Verificar si quien inicio sesion es un usuario permitido
       if(!allowedUserTypes.includes(decoded.userType)){
        return res.json({message: "Access denied"})
       }

       //5- Si todo esta bien, continuar con la siguiente funcion
       next();

     }  catch (error){
        console.log("error"+error);
     } 
    }
}