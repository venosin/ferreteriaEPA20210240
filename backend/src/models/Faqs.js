/*
 collection: Faqs
 fields:
    question: string
    answer: string
    level: number
    isActive: boolean
*/

import { Schema, model } from "mongoose";

const faqSchema = new Schema(
    {
        question: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 100,
            trim: true,
        },
        answer: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 100,
            trim: true,
        },
        level: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Faq", faqSchema);
