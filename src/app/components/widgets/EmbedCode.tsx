import { useState } from 'react';
import { generateEmbedCode } from '@/lib/generateEmbedCode';

interface EmbedCodeProps {
  widgetId: string;
}

export default function EmbedCode({ widgetId }: EmbedCodeProps) {
  const [copied, setCopied] = useState(false);
  const embedCode = generateEmbedCode(widgetId);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Code d'intégration</h3>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>
      <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
        <code>{embedCode}</code>
      </pre>
      <p className="mt-2 text-xs text-gray-500">
        Copiez ce code et collez-le à l'endroit où vous souhaitez afficher le widget sur votre site.
      </p>
    </div>
  );
} 