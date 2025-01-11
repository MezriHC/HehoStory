'use client'

import { Check, ClipboardCopy, Info } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function IntegrationPage() {
  const [copied, setCopied] = useState(false)
  const [showInstagramUI, setShowInstagramUI] = useState(true)

  const generateCode = () => {
    return `<!-- HehoStory Widget -->
<script>
  window.HehoStoryConfig = {
    showInstagramUI: ${showInstagramUI}
  };
</script>
<script 
  src="https://hehostory.com/widget.js" 
  data-widget-id="universal"
></script>`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Integration</h1>
          <p className="mt-2 text-gray-600">
            Add this universal code once to your website. Then use the Widgets page to control where your stories appear.
          </p>
        </div>

        {/* Configuration Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuration</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Instagram-like UI
              </label>
              <p className="text-sm text-gray-500">Show Instagram-style interface for stories</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showInstagramUI}
                onChange={(e) => setShowInstagramUI(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
            </label>
          </div>
        </div>

        {/* Code Snippet Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Integration Code</h2>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium text-gray-700 transition-all bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardCopy className="w-4 h-4 mr-2" />
                  Copy code
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
              <code>{generateCode()}</code>
            </pre>
          </div>

          <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              This is a universal code that you only need to add once to your website template, ideally after your product title. 
              Once installed, go to the <Link href="/widget" className="text-gray-900 underline hover:text-gray-600">Widgets page</Link> to 
              create widgets and specify which products or pages should display your stories.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 