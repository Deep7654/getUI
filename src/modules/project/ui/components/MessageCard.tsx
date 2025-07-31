import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {format} from "date-fns" 
import { ChevronRightIcon, Code2Icon } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

interface UserMessageprops{
  content : string;
}

const UserMessage = ({content}:UserMessageprops)=>{
  return(
    <div className='flex justify-end pb-4 pr-2 pl-10'>
      <Card className='rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words '>
        {content}
      </Card>
    </div>
  )
}

interface FragmentCardProps{
  fragment : string,
  isActiveFragment : boolean,
  onFragmentClick : (fragment : string)=> void
}

const FragmentCard = ({fragment , onFragmentClick , isActiveFragment} :FragmentCardProps)=>{
  return(
    <button
    className={cn(
      "flex items-start text-start gap-2 border rounded-lg bg-muted w-fit p-3 hover:bg-secondary transition-colors",
      isActiveFragment && 
      "bg-primary text-primary-foreground border-primary hover:bg-primary"
    )}
    onClick={()=> onFragmentClick(fragment)}
    >
      <Code2Icon className='size-4 mt-0.5'/>
        <div className='flex flex-col flex-1'>
          <span className='text-sm font-medium line-clamp-1'>
            Fragment
          </span>
          <span className='text-sm '>Preview</span>
        </div>
      <div className='flex items-center justify-center mt-0.5'>
        <ChevronRightIcon className='size-4' />
      </div>
    </button>
  )
}

interface AssistantMessageprops{
  content : string;
  createdAt : Date,
  fragment : string | null ,
  isActiveFragment : boolean,
  msgtype : string,
  msgrole:string,
  onFragmentClick: (fragment: string) => void
}

const AssistantMessage = ({content , createdAt ,  isActiveFragment , msgtype , fragment  , onFragmentClick  }:AssistantMessageprops)=>{
  // console.log(fragment)
  return(
    <div className={cn(
      "flex flex-col group px-2 pb-4",
      msgtype === "ERROR" && "text-red-700 dark:text-red-500",
    )}>
      <div className='flex items-center gap-2 pl-2 mb-2'>
       <Image
       src="/logo.svg"
       alt="getUi"
       width={18}
       height={18}
       className='shrink-0'
       />
        <span className='text-sm font-medium'> getui </span>
        <span className='text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-80'> 
        {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>
      <div className='pl-8.5 flex flex-col gap-y-4 '>
        <span>{content}</span>
        {fragment && msgtype === "RESULT" &&(
          <FragmentCard
          fragment={fragment}
          isActiveFragment={isActiveFragment}
          onFragmentClick={onFragmentClick}/>
        )}
      </div>
    </div>
  )
}

interface MessageCardProps{
    content : string,
    msgrole : string,
    msgtype : string,
    fragment : string | null ,
    isActiveFragment : boolean,
    createdAt : Date,
    updatedAt : Date
    onFragmentClick: (fragment: string) => void
}

export default function MessageCard({content , msgrole , msgtype , isActiveFragment , createdAt , fragment , onFragmentClick} : MessageCardProps) {

  if(msgrole == "ASSISTANT"){
    return (
        <AssistantMessage 
        content={content}
        createdAt = {createdAt}
        isActiveFragment = {isActiveFragment}
        msgtype = {msgtype}
        fragment={fragment}
        onFragmentClick={onFragmentClick}
        msgrole={msgrole}
        /> )
  }
  if(msgrole == "USER"){
    return (
        <UserMessage content={content}/>
    )
  }
}
