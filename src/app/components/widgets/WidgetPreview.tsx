import BrowserPreview from '../BrowserPreview'

interface WidgetPreviewProps {
  borderColor: string
}

export default function WidgetPreview({ borderColor }: WidgetPreviewProps) {
  return (
    <BrowserPreview 
      isOpen={true}
      onClose={() => {}}
      widget={{
        format: 'card',
        story_ids: []
      }}
      stories={[]}
    />
  )
} 