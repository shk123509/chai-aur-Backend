import mongoose from "mongoose";

const platlistSchema = new mongoose.Schema({
    name: {
        type: String,
        reuire: true,
        trim: true
    },
    description: {
        type: String,
        reuire: true,
        trim: true
    },
    vedio: [{
        
        type : mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
owner: {
    type: mongoose.Schema.Types.ObjectId,
        ref : "User"

}
}, { timestamps: true })

export const Playlist = mongoose.model("Playlist", platlistSchema)