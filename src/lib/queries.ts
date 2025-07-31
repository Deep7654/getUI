"use server"; 

import { Project } from '@/db/models/project.model'
import { Message } from '@/db/models/message.model'

export async function getProject(id: string) {
  const doc = await Project.findById(id)
  return JSON.parse(JSON.stringify(doc))
}

export async function getMessages(projectId: string) {
  const docs = (await Message.find({ projectId }).populate("fragmentId"))
  return JSON.parse(JSON.stringify(docs))
}
