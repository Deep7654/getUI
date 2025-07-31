'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getMessages, getProject} from '@/lib/queries'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import MessageConatiner from '../components/message-container'
import {  act, Suspense, useState } from 'react'
import ProjectHeader from '../components/projectHeader'
import FragmentWeb from '../components/fragmentweb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CrownIcon, EyeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileExplorer } from '@/components/file-explorer'

// Corrected Props interface for this component
interface ViewProps {
  projectId: string
}

export default function View({ projectId }: ViewProps) { // Destructure projectId directly

  const [activeFragment , setActiveFragment] = useState(null);
  const [tabState , setTabState]= useState<"preview" | "code">("preview")

  const { data: project } = useSuspenseQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
  })
  const { data: messages } = useSuspenseQuery({
        queryKey: ['messages', projectId],
        queryFn: () => getMessages(projectId),
        refetchInterval : 5000
      })


  return (
    <div className=' h-screen'>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel
        defaultSize={35}
        minSize={20}
        className=' flex flex-col min-h-0'
        >
          <Suspense fallback={<p>Loading Project...</p>}>  
          <ProjectHeader projectId={projectId}/>
          </Suspense>
          <Suspense fallback={<p>Loding Messages</p>}> 
          <MessageConatiner 
          projectId={projectId}
          activeFragment = {activeFragment}
          setActiveFragment = {setActiveFragment}
          />
          </Suspense>
  

        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel
        defaultSize={65}
        minSize={50}
        className=''
        >
          <Tabs
          className='h-full gap-y-0'
          defaultValue='preview'
          value={tabState}
          onValueChange={(value)=>setTabState(value as "preview" | "code")}
          >
            <div className='w-full flex items-center p-2 border-b gap-x-2'>
              <TabsList className='h-8 p-0 border rounded-md'>
                <TabsTrigger value='preview' className='rounded-md'>
                  <EyeIcon/><span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value='code' className='rounded-md'>
                  <EyeIcon/><span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className='ml-auto flex items-center gap-x-2'>
                <Button asChild size="sm" variant="default">
                  <Link href="/pricing">
                  <CrownIcon/> Upgrade
                  </Link>
                </Button>
              </div>
            </div>
            <TabsContent value='preview'>
          {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value='code' className='min-h-0'>
              {!!activeFragment?.file && (
    <FileExplorer files={activeFragment.file as {[path:string]:string}} />
  )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      
    </div>
  )
}