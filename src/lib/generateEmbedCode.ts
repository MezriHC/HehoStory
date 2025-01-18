export const generateEmbedCode = (widgetId: string): string => {
  const embedCode = `<div id="hehostory-widget-${widgetId}"></div>
<script src="${process.env.NEXT_PUBLIC_APP_URL}/widget.js" data-widget-id="${widgetId}"></script>`;
  
  return embedCode;
}; 