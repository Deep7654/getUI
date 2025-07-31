// src/app/queryOptions/project.ts

import { Message } from "@/db/models/message.model";
import { Project } from "@/db/models/project.model";

export const projectQueries = async (projectId)=>{
  const projectDoc = await Project.findById(projectId);
    const messagesDoc = await Message.find({ projectId });
  
    // Serialize Mongoose documents (remove ObjectId, Date, etc.)
    const project = projectDoc && {
      ...projectDoc.toObject(),
      _id: projectDoc._id.toString(),
      createdAt: projectDoc.createdAt?.toISOString(),
      updatedAt: projectDoc.updatedAt?.toISOString()
    };
  
    const messages = messagesDoc.map((msg) => ({
      ...msg.toObject(),
      _id: msg._id.toString(),
      projectId: msg.projectId.toString(),
      createdAt: msg.createdAt?.toISOString(),
      updatedAt: msg.updatedAt?.toISOString(),
    }));
  return {project , messages}
}

