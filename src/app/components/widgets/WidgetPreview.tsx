import BrowserPreview from '../BrowserPreview'
import { WidgetFormat } from '@/types/database.types'

interface WidgetPreviewProps {
  borderColor: string
}

export default function WidgetPreview({ borderColor }: WidgetPreviewProps) {
  return (
    <BrowserPreview 
      isOpen={true}
      onClose={() => {}}
      widget={{
        format: {
          type: 'card',
          size: 'M',
          alignment: 'center'
        },
        story_ids: []
      }}
      stories={[]}
      borderColor={borderColor}
    />
  )
} 