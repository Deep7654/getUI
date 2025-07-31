
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'
import View from '../../../modules/project/ui/view/ProjectView'
import { getProject, getMessages } from '@/lib/queries'

interface Props {
  params: {
    projectId: string
  }
}

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['project', params.projectId],
    queryFn: () => getProject(params.projectId),
  })

  await queryClient.prefetchQuery({
    queryKey: ['messages', params.projectId],
    queryFn: () => getMessages(params.projectId),
  })

  return (
    
      <HydrationBoundary state={dehydrate(queryClient)}>
        <View projectId={params.projectId} />
      </HydrationBoundary>

  )
}