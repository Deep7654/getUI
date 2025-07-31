import mongoose from "mongoose"
// import { Schema } from "zod";

export interface IFragment extends mongoose.Document {
    messageId: mongoose.Schema.Types.ObjectId;
    sandboxUrl: string;
    title?: string;
    file?: JSON;
    fragmentType?: string;
}

const fragmentSchema : mongoose.Schema<IFragment> = new mongoose.Schema({
   messageId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Message", // optional, if you want
  // remove unique: true if present
},
    sandboxUrl :{
        type: String,
        required: true
    },
    title: {
        type: String,
        // required: true
    },
    file :{
        type :JSON
    },
    fragmentType:{
        type : String,
        enum : ["RESULT" , "ERROR"],
        default : "RESULT"
    }
}, {
    timestamps: true
})

export const Fragment = mongoose.models.Fragment || mongoose.model("Fragment", fragmentSchema)
