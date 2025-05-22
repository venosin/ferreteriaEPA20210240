import providersModel from "../models/providers.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";

// Configurar Cloudinary
console.log("Cloudinary config:", config.cloudinary);

cloudinary.config({
    cloud_name: config.cloudinary.CLOUD_NAME,
    api_key: config.cloudinary.API_KEY,
    api_secret: config.cloudinary.API_SECRET,
});

const providersController = {};

// GET all providers
providersController.getProviders = async (req, res) => {
    try {
        const providers = await providersModel.find();
        res.json(providers);
    } catch (error) {
        console.error("Error getting providers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// CREATE a provider
providersController.createProvider = async (req, res) => {
    try {
        const { name, phoneNumber } = req.body;
        let imageUrl = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "public",
                allowed_formats: ["png", "jpg", "jpeg"],
            });
            imageUrl = result.secure_url;
        }

        const newProvider = new providersModel({ name, phoneNumber, image: imageUrl });
        await newProvider.save();

        res.json({ message: "Provider created successfully" });
    } catch (error) {
        console.error("Error creating provider:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export default providersController;
