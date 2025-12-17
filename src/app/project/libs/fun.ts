import dbConnect from "@/db/dbConnect/dbConnect";
import { Message } from "@/db/models/message.model";
import { Project } from "@/db/models/project.model";

dbConnect();
console.log("DB Connected at fun.ts");
const fetchProjectFn = async (projectId: string) => { 
     const msg  = await Project.findById(projectId);
     return msg ? msg.name : 'Project not found';
}

dbConnect();
const fetchMessagesFn = async (projectId: string) => {
    const messages = await Message.find({ projectId }).populate('fragments');
    return messages;    }

export { fetchProjectFn , fetchMessagesFn };