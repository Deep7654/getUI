'use client'

import React from 'react'

interface Props {
  pramps: {
    projectId: string,
    project: string,
    messages: string
  }
}

export default function View({ pramps }: Props) {
  const { projectId, project, messages } = pramps;

  return (
    <div>
      <pre>{projectId}</pre>
      <pre>{JSON.stringify(project, null, 2)}</pre>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </div>
  )
}
