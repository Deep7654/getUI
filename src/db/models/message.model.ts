import mongoose from "mongoose"

const messageSchema =  new mongoose.Schema({
    content : {
        type : String,
        require : true 
    },
    fragmentId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Fragment"
    },
    messageRole : {
        type: String,
        enum: ["USER", "ASSISTANT"],
        default: "USER"
    },
    messageType:{
        type: String,
        enum: ["RESULT", "ERROR"],
        default : "RESULT"
    },
   
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Project",
        required: true
    }
},{
    timestamps:true
})

export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema)
