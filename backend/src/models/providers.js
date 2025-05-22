import { Schema, model } from "mongoose";

const providerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
     phoneNumber: {
         type: String,
         required: true,
     },
     image: {
         type: String,
         required: true,
     },
     
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Provider", providerSchema);
