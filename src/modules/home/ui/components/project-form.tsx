"use client";

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import { Form, FormField } from '@/components/ui/form'
import TextareaAutosize from "react-textarea-autosize"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowUpIcon, Loader2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'


const formSchema = z.object({
    value : z.string()
    .min(1 , {message : "value is Required"})
    .max(1000 , "Prompt is tooo lOng")
})

export default function ProjectForm() {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues:{
            value: ""
        },
        mode: "onChange"
    })

    

    const onSubmit = async (value : z.infer<typeof formSchema>)=>{
        try {
        setLoading(true)
        setDisable(true)

        // API Call to create project
      const res = await fetch("/api/project", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: value.value }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${data.error}`)
      }

      // Push to project page
      router.push(`/project/${data.createdUser._id}`)
    } catch (error) {
        console.log(error)
    } finally {
      setLoading(false)
      setDisable(false)
    }
    }
    
    const [IsFocused,setIsFocused] = useState();
    const [ loading , setLoading] = useState(false)
    const [ isBtnDisable , setDisable] = useState( loading || form.formState.isValid)
    
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
            "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
            IsFocused && "shadow-xs",
            
        )}>
            <FormField
            control={form.control}
            name="value"
            render={({ field})=>{
                return <TextareaAutosize
                {...field}
                disabled={loading}
                onFocus={()=> setIsFocused(true)}
                onBlur={()=> setIsFocused(false)}
                minRows={2}
                maxRows={8}
                className='pt-4 resize-none border-none w-full outline-none bg-transparent'
                placeholder='what whould yo type'
                onKeyDown={(e)=>{
                    if(e.key === "Enter" && (e.ctrlKey || e.metaKey)){
                        e.preventDefault();
                        form.handleSubmit(onSubmit)(e)
                    }
                }}
                />
            }}
            />
            <div  className='flex gap-x-2 items-end justify-between pt-2'>
                <div className='text-[10px] text-muted-foreground font mono  '>
                    <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground  '>
                        <span>&#8984;</span>Enter
                    </kbd>
            &nbsp; to submit 
                </div>
                <Button
                disabled={isBtnDisable}
                className={cn(
                    "size-8 rounded-full ",
                    isBtnDisable && "bg-muted-foreground border"
                )}>
                    {loading ? (
                        <Loader2Icon className='size-4 animate-spin'/>
                    ) : (

                    <ArrowUpIcon/>
                    ) }
                </Button>
            </div>
        </form>
    </Form>
  )
}


