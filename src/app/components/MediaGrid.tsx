import { File, GripHorizontal, Image, Plus, Trash2, Video } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DeleteConfirmation from './DeleteConfirmation'

export interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  file: File | null
  thumbnailUrl?: string // URL de la miniature pour les vidéos
}

interface MediaGridProps {
  items: MediaItem[]
  onAdd: (files: File[]) => void
  onRemove: (id: string) => void
  onReorder: (items: MediaItem[]) => void
}

function SortableItem({ item, index, onRemove }: { item: MediaItem; index: number; onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    zIndex: isDragging ? 50 : 0,
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`group relative aspect-[3/4] rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-xl ring-2 ring-gray-900' : ''
      }`}
    >
      {/* Preview */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        {item.type === 'image' ? (
          <img
            src={item.url}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <video
            src={item.url}
            className="h-full w-full object-cover"
            draggable={false}
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {/* Position number */}
      <div className="absolute top-3 left-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-xs font-medium text-gray-900 shadow-sm backdrop-blur-sm">
        {index + 1}
      </div>

      {/* File type icon */}
      <div className="absolute top-3 right-3 z-10">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
          {item.type === 'video' ? (
            <Video className="h-4 w-4 text-gray-600" />
          ) : (
            <Image className="h-4 w-4 text-gray-600" />
          )}
        </div>
      </div>

      {/* Drag indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 transition-all group-hover:opacity-100 bg-black/50 backdrop-blur-sm rounded-lg p-2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <circle cx="7" cy="5" r="1.5" fill="currentColor" />
          <circle cx="7" cy="10" r="1.5" fill="currentColor" />
          <circle cx="7" cy="15" r="1.5" fill="currentColor" />
          <circle cx="13" cy="5" r="1.5" fill="currentColor" />
          <circle cx="13" cy="10" r="1.5" fill="currentColor" />
          <circle cx="13" cy="15" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove(item.id)
        }}
        className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:text-red-500 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function MediaGrid({ items, onAdd, onRemove, onReorder }: MediaGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onAdd(acceptedFiles)
  }, [onAdd])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    }
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      onReorder(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              item={item}
              index={index}
              onRemove={onRemove}
            />
          ))}
        </SortableContext>

        {/* Add new item card */}
        <div
          {...getRootProps()}
          className={`group relative aspect-[3/4] rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
            isDragActive
              ? 'border-gray-400 bg-gray-100'
              : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex h-full flex-col items-center justify-center p-6">
            <div className="mb-4 rounded-full bg-white p-4 shadow-sm ring-1 ring-gray-200/50 transition-all group-hover:shadow-md">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-900">Add media</p>
            <p className="mt-1 text-center text-xs text-gray-500">
              Drop files here or click to upload
            </p>
          </div>
        </div>
      </div>
    </DndContext>
  )
} 