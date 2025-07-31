

"use client"

import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
// import { dbConnects } from "@/lib/db"
// import { da } from "date-fns/locale"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
// import { useRouter } from "next/dist/client/components/navigation"
// import { Router } from "next/router"

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")
  const [value , setValue]=useState("")

  const handleClick = async () => {
    setLoading(true)
    setResult("")
    try {
      const res = await fetch("/api/project", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: value }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${data.error}`)
      }
      console.log(data)
      setResult(JSON.stringify(data))
      toast.success("Event sent successfully!")
      router.push(`/project/${data.createdUser._id}`) // Redirect to the project page after sending the event
    } catch (error) {
      setResult(`eRROR  While Sending Event  ${(error as Error).message}`)
      toast.error(`Error sending event: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 bg-red-600">
      
      <Input
      value={value}
      onChange={(e)=> setValue(e.target.value)  }  
      />
      <Button
        onClick={handleClick}
        // className="bg-blue-500 px-4 py-2 rounded text-white"
      >
        {loading ? "Sending..." : "Send Inngest Job"}
      </Button>

      <p className="mt-4">{result}</p>
    </main>
  )
}



