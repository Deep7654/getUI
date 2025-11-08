"use client";

import { getMessages } from "@/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import MessageForm from "./messageForm";
import MessageLoading from "./messageLoading";

interface ViewProps {
  projectId: string;
  activeFragment: any;
  setActiveFragment: (fragment: any | null) => void;
}

export default function MessageConatiner({
  projectId,
  activeFragment,
  setActiveFragment,
}: ViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistentMessageIdRef = useRef<string | null>(null);

  const { data: messages } = useSuspenseQuery({
    queryKey: ["messages", projectId],
    queryFn: () => getMessages(projectId),
    refetchInterval: 5000,
  });

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(
      (message) => message.messageRole === "ASSISTANT"
    );
      if(
        lastAssistantMessage?.fragmentId && 
        lastAssistantMessage._id !== lastAssistentMessageIdRef.current
      ){
        setActiveFragment(lastAssistantMessage.fragmentId);
        lastAssistentMessageIdRef.current = lastAssistantMessage._id
      }
  }, [messages, setActiveFragment]);

  //     useEffect( ()=>{

  //       // const lastAssistantMessage =  getlastmsg(messages)
  //       // const lastAssistantMessage =  messages.findLast(
  //       //   (message)=> message.messageRole == "ASSISTANT"
  //       // );
  //       const lastAssistantMessage = [...messages].reverse().find(
  //   (msg) => msg.messageRole === "ASSISTANT" && !!msg.fragmentId
  // )

  //       if(lastAssistantMessage){
  //         setActiveFragment(lastAssistantMessage.fragmentId)
  //         console.log(lastAssistantMessage)
  //         console.log("lastAssistantMessage.fragmentId")
  //       }
  //     }, [messages , setActiveFragment])

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

  const lastmsg = messages[messages.length - 1];
  const isLastmsgUser = lastmsg?.messageRole === "USER";

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="pt-2 pr-1">
          {/* hjsgfjh */}
          {/* {JSON.stringify(messages)} */}
          {messages.map((message) => (
            <MessageCard
              key={message._id}
              content={message.content}
              msgrole={message.messageRole}
              msgtype={message.messageType}
              createdAt={message.createdAt}
              updatedAt={message.updatedAt}
              isActiveFragment={activeFragment?._id === message.fragmentId?._id}
              onFragmentClick={() => setActiveFragment(message.fragmentId)}
              fragment={message.fragmentId}
              // onFragmentClick={(fragment) => void}
            />
          ))}
          {isLastmsgUser && <MessageLoading />}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
}
