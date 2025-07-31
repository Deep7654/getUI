// import { inngest } from "../../../inngest/client";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
// const { email } = await req.json() // <- get email from frontend
// // const gif = email;

//   await inngest.send({
//     name: "test/hello.world",
//     data: {
//       email :  email, // or dynamic
//     },
//   });

//   return NextResponse.json({ status:  "event sent 7367 "  });
// }


// /api/trigger-job/route.ts
// import { inngest } from "@/inngest/client";
// import { NextResponse } from "next/server";
// import { randomUUID } from "crypto";

// export async function POST() {
//   const jobId = randomUUID();

//   await inngest.send({
//     name: "user/registered",
//     data: {
//       email: "test@example.com",
//       jobId,
//     },
//   });

//   // Store initial status in DB as "pending"

//   return NextResponse.json({ jobId, message: "Job started" });
// }
