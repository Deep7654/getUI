import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'
import View from '../../../modules/project/ui/view/ProjectView' 
import { getProject, getMessages } from '@/lib/queries'

interface Props {
  params: Promise< {
    projectId: string
  }>
}

export default async function Page({ params }: Props) {
  const { projectId } = await params

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId),
  })

  await queryClient.prefetchQuery({
    queryKey: ['messages', projectId],
    queryFn: () => getMessages(projectId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <View projectId={projectId} />
    </HydrationBoundary>
  )
}



