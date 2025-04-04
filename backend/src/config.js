import dotenv from "dotenv";

//Configuro dotenv
dotenv.config();

export const config = {
  db: {
    DB_URI: process.env.DB_URI,
  },
  server: {
    PORT: process.env.PORT,
  },
  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES: process.env.JWT_EXPIRES,
  },
  email: {
    EMAIL: "20210240@ricaldone.edu.sv",
    PASSWORD: process.env.APP_PASSWORD_EMAIL,
  },
  admin: {
    EMAIL: process.env.ADMIN_EMAIL,
    PASSWORD: process.env.ADMIN_PASSWORD,
  },
};
