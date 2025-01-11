import { LucideIcon, Plus } from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  title: string
  description: string
  icon: LucideIcon
  actionLabel: string
  actionHref: string
  topActionLabel?: string
  topActionHref?: string
}

export default function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  topActionLabel,
  topActionHref,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 relative">
      {topActionLabel && topActionHref && (
        <Link
          href={topActionHref}
          className="absolute right-4 top-4 inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          {topActionLabel}
        </Link>
      )}
      <div className="flex flex-col items-center p-12">
        <div className="w-16 h-16 rounded-xl bg-gray-900 flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
          {title}
        </h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          {description}
        </p>
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Link>
      </div>
    </div>
  )
} 