import mongoose from "mongoose";


const messageSchema = mongoose.Schema({
    timestamp: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 100
    }
})

export default messageSchema;