import { Schema, model } from "mongoose";

const brancheSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        telephone: {
            type: String,
            required: true,
        },
        schedule: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Branch", brancheSchema);
