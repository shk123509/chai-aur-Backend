import mongoose from "mongoose";

const subscriptionSchem = new mongoose.Schema({
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    }
}, { timestamps: true })


export const Subscription = mongoose.model("Subscription", subscriptionSchem)