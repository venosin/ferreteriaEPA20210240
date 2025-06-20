/*
Coleccion: 
product
category
customer
total
date
*/

import { Schema, model } from "mongoose";

const salesSchema = new Schema(
    {
        product: {
            type: String,
            require: true,
        },
        category: {
              type: String
        },
        customer: {
            type: String,
            require: true,
            min:0
        },
        total: {
            type: Number,
            require: true,
            min: 0.01,
            max: 1000000
        },
        date: {
            type: Date,
            require: true,
        }
    },
    {
        timestamps: true,
        strict:false
    }

);

export default model("Sale", salesSchema)
