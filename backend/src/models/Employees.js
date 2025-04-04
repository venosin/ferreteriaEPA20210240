import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        birthday: {
            type: Date, 
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        hireDate: {
            type: Date, 
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        telephone: {
            type: String,
            required: true,
        },
        dui: {
            type: String,
            required: true,
        },
        isssNumber: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Employee", employeeSchema);