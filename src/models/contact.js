import mongoose from "mongoose";    

const contactSchema = new mongoose.Schema({
    fullname : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    description : {
        type : String,
        require : true
    }
}, {timestamps : true})


export const Contact = mongoose.model("Contact", contactSchema)