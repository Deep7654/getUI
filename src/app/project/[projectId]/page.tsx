import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query'
import View from '../../../modules/project/ui/view/ProjectView'
import { fetchProject, fetchMessages } from '@/lib/fetchers'

interface Props {
  params: {
    projectId: string
  }
}

export default async function Page({ params }: Props) {
  const { projectId } = params

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
  })

  await queryClient.prefetchQuery({
    queryKey: ['messages', projectId],
    queryFn: () => fetchMessages(projectId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <View projectId={projectId} />
    </HydrationBoundary>
  )
}
