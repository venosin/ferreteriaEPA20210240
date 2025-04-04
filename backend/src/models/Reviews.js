import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
    {
        comment: {
            type: String,
        },
        rating: {
            type: Number,
            max: 5
        },
        idClient: {
            type: Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        }
    },
    {
        timestamps: true,
        strict: false
    }
);

export default model("review", reviewSchema);