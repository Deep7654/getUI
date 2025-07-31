import { TreeItem } from '@/types'
import React from 'react'

interface TreeViewProps{
    data : TreeItem[],
    value?: string | null,
    onSelect?:(value:string)=> void ;
};

export default function TreeView({data , value , onSelect}:TreeViewProps) {
  return (
    <p>
        {JSON.stringify(data)}
    </p>
  )
}
