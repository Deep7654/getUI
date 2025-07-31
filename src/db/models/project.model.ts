import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    message : {
        type:[],  
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    {timestamps: true});

    export const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);