import { Message } from "@/db/models/message.model";
import { inngest } from "../../../inngest/client";
import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect/dbConnect";
import { Project } from "@/db/models/project.model";
import { z } from "zod";
// import { dbConnects } from "@/lib/db";

const MessageSchema = z.object({
  message: z.string().min(1, "Enter valid length"),
  projectID : z.string()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = MessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { message , projectID } = parsed.data;

    await dbConnect();

    const userMsg = await Message.create({
      content: message,
      projectId: projectID,
    });
    await Project.findByIdAndUpdate(
  projectID,
  { 
    // Use $push to add the new message's ID to the 'messages' array
    $push: { messages: userMsg._id } 
  }
);

    if (!userMsg) {
      return NextResponse.json(
        { error: "Problem while saving the message" },
        { status: 500 }
      );
    }

    await inngest.send({
      name: "test/hello.world",
      data: {
        email: message,
        projectId:  projectID,
      },
    });

    // const msg = await Project.findById(createdUser._id)
    return NextResponse.json({ status: "Success", userMsg }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  } 
}
