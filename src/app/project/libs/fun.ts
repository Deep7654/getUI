import { Message } from "@/db/models/message.model";
import { Project } from "@/db/models/project.model";

const fetchProjectFn = async (projectId: string) => { 
     const msg  = await Project.findById(projectId);
     return msg ? msg.name : 'Project not found';
}

const fetchMessagesFn = async (projectId: string) => {
    const messages = await Message.find({ projectId }).populate('fragments');
    return messages;    }

export { fetchProjectFn , fetchMessagesFn };