import { z } from "zod";
import {Sandbox} from "@e2b/code-interpreter"
import {  createAgent, createTool,gemini, createNetwork } from "@inngest/agent-kit";
import { PROMPT } from "@/prompt";
import { inngest } from "./client";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { Message } from "@/db/models/message.model";
import { Fragment } from "@/db/models/fragment.model";

interface AgentState {
  summary : string,
  file : {[path:string] : string}
}

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" }, 
  async ({ event , step}) => {
    const sandboxId = await step.run("get-sandbox-id" , async ()=>{
      const sandbox = await Sandbox.create("getuitest");
      return sandbox.sandboxId
    } )
   
    const coder = createAgent<AgentState>({
      name: "Coder",
      description : "An Expert Coding Agent",
      system: PROMPT,
      model :gemini({
        model: "gemini-2.5-flash"
      }),
      
      tools : [
        createTool({
          name : "terminal",
          description : "use the terminal to run commands",
          parameters: z.object({
            command : z.string(),
          }),
          handler:async ({command},{step})=>{
            return await step?.run("terminal" , async()=>{
              const buffer = {stdout: "", stderr: ""};
              
              try{
                //  await step.sleep("wait-a-moment", "10s");
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command , {
                  onStdout: (data : string)=> {
                      buffer.stdout += data;
                  },
                  onStderr : (data:string)=>{
                      buffer.stderr += data;
                  }
                });
                //  await step.sleep("wait-a-moment", "10s");
                return result.stdout;
              }catch(e){
                console.error(`Command Failed error ${e} \n stdout: ${buffer.stdout} \n stderr: ${buffer.stderr}`)
                return  `Command Failed error ${e} \n stdout: ${buffer.stdout} \n stderr: ${buffer.stderr}`
              }
            })
          }
        }),
        createTool({
          name : "createOrUpdateFiles",
          description : "create or Update files in the sandbox",
          parameters : z.object({
            files: z.array(
              z.object({
                path : z.string(),
                content : z.string()
              })
            )
          }),
          handler:async(
            {files},
            {step, network}
          )=>{
            const newFiles = await step?.run("createOrUpdateFiles" , async ()=>{
              try {
                //  await step.sleep("wait-a-moment", "10s");
                const updatedFilesh = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for(const file of files){
                  await sandbox.files.write(file.path , file.content);
                  updatedFilesh[file.path] = file.content;

                }
                return updatedFilesh;
                //  await step.sleep("wait-a-moment", "10s");
              } catch (error) {
                return 'Error : ' + error;
              }
            })
            if (typeof newFiles === "object"){
              // change one here file to files
              network.state.data.file = newFiles;
            }
          }
        }),
        createTool({
          name : "readFiles",
          description : "Read files from the sandbox",
          parameters : z.object({
            files : z.array(z.string()),
          }),
          handler : async({files} , {step})=>{
            return await step?.run("readFiles" , async()=>{
              try {
                //  await step.sleep("wait-a-moment", "10s");
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for(const file of files){
                  const content = await sandbox.files.read(file)
                contents.push({path : file , content});
                }
                //  await step.sleep("wait-a-moment", "10s");
                return JSON.stringify(contents)
              } catch (error) {
                return "Error :" + error;
              }
            })
          }
        })
      ],
      lifecycle:{
        onResponse: async({result , network })=>{
          const lastAssistantMessageText = lastAssistantTextMessageContent(result);
          if (lastAssistantMessageText && network){
            if(lastAssistantMessageText.includes("<task_summary>")){
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        }
      }
    });
//  await step.sleep("wait-a-moment", "10s");
    const network = createNetwork({
      name : "coding-agent-network",
      agents : [coder],
      maxIter : 2,
      router : async({network})=>{
        const summary = network.state.data.summary;

        if(summary){
          return ;
        }
        return coder;
      }
    })
    // // //  await step.sleep("wait-a-mofment", "10s");
    const result = await network.run(event.data.email)

    // const isError = !result.state.data.summary || Object.keys(result.state.data.file || {}).length === 0
    
    // await step.sleep("wait-a-moment", "10s");
    const { output } = await coder.run(`Write Code with Nextjs and ReactJs ${event.data.email}`);
    console.log(output)

    const sandboxUrl = await step.run("get-sandbox-url" , async()=>{
    const sandbox = await getSandbox(sandboxId);
    const host =  sandbox.getHost(3000);
    return `https://${host}`
    })
    
    await step.run("save-result" , async ()=>{

      // if(isError){
      //   return await Message.create({
      //     projectId : event.data.projectId,
      //         content:"Something went Wrong. please try again ",
      //         messageRole : "ASSISTANT",
      //         MessageType : "ERROR",
      //   })
      // }

     

      const msg = await Message.create({
    projectId: event.data.projectId,
    content: result.state.data.summary || "No summary provided or Something went Wrong",
    messageRole: "ASSISTANT",
    MessageType: "RESULT"
  });

  // Now create the fragment, referencing msg._id
  const frag = await Fragment.create({
    messageId: msg._id, // <-- include this
    sandboxUrl: sandboxUrl,
    fragmentTitle: "fragment",
    file: result.state.data.file,
    fragmentType: "RESULT"
  });

  // Then update message with the fragment ID if needed
  await Message.findByIdAndUpdate(
    msg._id,
   { fragmentId: frag._id }
  );

  return { msg, frag };
    })
    
    return { 
      url : sandboxUrl,
      title : "Fragment",
      files : result.state.data.file || " files here not Given",
      summary: result.state.data.summary  ,
     };
  },
);


