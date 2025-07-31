import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuSubTrigger , DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuSubContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu'
import { getProject } from '@/lib/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import Image from 'next/image';
import { ChevronDownIcon, ChevronLeftIcon, SunMoonIcon } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from 'next-themes'


interface Props{
    projectId : string
}

export default function ProjectHeader({projectId} : Props) {
    const { data: project } = useSuspenseQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
  })

  const {setTheme, theme} = useTheme();

  return (
    <header className='p-2 flex justify-between items-center border-b '>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="ghost"
                size="sm"
                className='focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!'
                >
             <Image src="/logo.svg" alt='getUi' width={18} height={18} />
                    <span className='text-sm font-medium'>{project.name}</span>
                    <ChevronDownIcon/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='bottom' align='start'>
                <DropdownMenuItem asChild>
                    <Link href="/" >
                    <ChevronLeftIcon/>
                    <span>
                        Got to Dashboard
                    </span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className='gap-2'>
                        <SunMoonIcon />
                        <span>Appearance</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup value={theme}  onValueChange={setTheme}>
                                <DropdownMenuRadioItem value='light'>
                                    <span>Light</span>
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value='dark'>
                                    <span>Dark</span>
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value='System'>
                                    <span>System</span>
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    </header>
  )
}
