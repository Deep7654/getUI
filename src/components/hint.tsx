"use client"

import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

interface HintProps{
    children : React.ReactNode,
    text : string ,
    side?:"top" | "right" | "bottom" | "left",
    align?: "start" |  "center" | "end"
}

export default function Hint({children , text , side= "top" , align="center" }:HintProps) {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align}>
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}
