"use server"; 

import { Project } from '@/db/models/project.model'
import { Message } from '@/db/models/message.model'
import dbConnect from '@/db/dbConnect/dbConnect';

export async function getProject(id: string) {
  dbConnect();
  const doc = await Project.findById(id)
  return JSON.parse(JSON.stringify(doc))
}

export async function getMessages(projectId: string) {
  dbConnect();
  const docs = (await Message.find({ projectId }).populate("fragmentId"))
  return JSON.parse(JSON.stringify(docs))
}
