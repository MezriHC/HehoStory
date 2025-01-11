declare module '@hello-pangea/dnd' {
  import * as React from 'react'

  export type DraggableId = string
  export type DroppableId = string

  export interface DraggableLocation {
    droppableId: DroppableId
    index: number
  }

  export interface DragStart {
    draggableId: DraggableId
    type: string
    source: DraggableLocation
  }

  export interface DropResult {
    draggableId: DraggableId
    type: string
    source: DraggableLocation
    destination: DraggableLocation | null
    reason: 'DROP' | 'CANCEL'
  }

  export interface DraggableProvided {
    innerRef: (element: HTMLElement | null) => void
    draggableProps: {
      'data-rbd-draggable-context-id': string
      'data-rbd-draggable-id': string
      style?: React.CSSProperties
    }
    dragHandleProps: {
      'data-rbd-drag-handle-draggable-id': string
      'data-rbd-drag-handle-context-id': string
      'aria-labelledby': string
      role: string
      tabIndex: number
      draggable: boolean
      onDragStart: (event: React.DragEvent<HTMLElement>) => void
    } | null
  }

  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => void
    droppableProps: {
      'data-rbd-droppable-context-id': string
      'data-rbd-droppable-id': string
    }
    placeholder?: React.ReactElement | null
  }

  export interface DragDropContextProps {
    onDragEnd: (result: DropResult) => void
    onDragStart?: (initial: DragStart) => void
    children?: React.ReactNode
  }

  export interface DroppableProps {
    droppableId: string
    type?: string
    mode?: 'standard' | 'virtual'
    isDropDisabled?: boolean
    isCombineEnabled?: boolean
    direction?: 'vertical' | 'horizontal'
    ignoreContainerClipping?: boolean
    children: (provided: DroppableProvided) => React.ReactElement
  }

  export interface DraggableProps {
    draggableId: string
    index: number
    isDragDisabled?: boolean
    disableInteractiveElementBlocking?: boolean
    shouldRespectForcePress?: boolean
    children: (provided: DraggableProvided) => React.ReactElement
  }

  export class DragDropContext extends React.Component<DragDropContextProps> {}
  export class Droppable extends React.Component<DroppableProps> {}
  export class Draggable extends React.Component<DraggableProps> {}
} 