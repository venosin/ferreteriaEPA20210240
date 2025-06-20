// importar lo de lalibreria "express"
import express from "express" ;
import productsRoutes from "./src/routes/products.js"
import clientsRoutes from "./src/routes/clients.js"
import employeesRoutes from "./src/routes/employees.js"
import branchesRoutes from "./src/routes/branches.js"
import reviewsRoutes from "./src/routes/reviews.js"
import registerEmployeeRoutes from "./src/routes/registerEmployee.js"
import registerClientRoutes from "./src/routes/registerClient.js"
import loginRoutes from "./src/routes/login.js"
import logoutRoutes from "./src/routes/logout.js"
import passwordRecoveryRoutes from "./src/routes/passwordRecovery.js"
import cookieParser from "cookie-parser";
import providersRoutes from "./src/routes/providers.js";
import faqsRoutes from "./src/routes/faqs.js";
import salesRoutes from "./src/routes/sales.js";
import { validateAuthToken } from "./src/middlewares/validateAuthToken.js";
import cors from "cors";
//Creso la constante para poder usar express en otros archivos
const app = express();

//middleware para aceptar datos desde postman

//Que acepte datos en json
app.use(express.json());
//Para que POSTMAN guarde el token en una cookie
app.use(cookieParser());

//Middleware para cors
app.use(cors({
    origin: ["https://ferreteria-epa-20210240.vercel.app", "http://localhost:5173"],
    credentials: true,
}));

//Mandae a llamar a rutas
app.use("/api/products", productsRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/employees", /*validateAuthToken(["Employee", "Admin"]),*/ employeesRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/providers", /*validateAuthToken(["Employee", "Admin"]),*/ providersRoutes);
app.use("/api/faqs", faqsRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/logout", logoutRoutes);

// Rutas publicas que no necesitan haber iniciado sesión
app.use("/api/login", loginRoutes);
app.use("/api/registerEmployee", /*validateAuthToken(["Admin"]), */ registerEmployeeRoutes);
app.use("/api/registerClient", registerClientRoutes);
app.use("/api/passwordRecovery", passwordRecoveryRoutes);


//Archivo la constante para poder usar express en otros archivos
export default app;
