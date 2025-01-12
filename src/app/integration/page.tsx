'use client'

import { Check, ClipboardCopy, Info, Smartphone, Monitor, Palette, Layout } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function IntegrationPage() {
  const [copied, setCopied] = useState(false)
  const [mobileOptimized, setMobileOptimized] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [fullWidth, setFullWidth] = useState(true)
  const [autoPlay, setAutoPlay] = useState(true)

  const generateCode = () => {
    return `<!-- HehoStory Widget -->
<script>
  window.HehoStoryConfig = {
    mobileOptimized: ${mobileOptimized},
    darkMode: ${darkMode},
    fullWidth: ${fullWidth},
    autoPlay: ${autoPlay}
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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Integration</h1>
          <p className="mt-3 text-lg text-gray-600">
            Customize your HehoStory widget and add it to your website in minutes.
          </p>
        </div>

        {/* Configuration Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-8">Configuration</h2>
          
          <div className="grid gap-8">
            {/* Mobile Optimization */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <label className="block text-base font-medium text-gray-900">
                    Mobile Optimization
                  </label>
                  <p className="text-sm text-gray-500">Automatically adjust layout and controls for mobile devices</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={mobileOptimized}
                  onChange={(e) => setMobileOptimized(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
              </label>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Palette className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <label className="block text-base font-medium text-gray-900">
                    Dark Mode
                  </label>
                  <p className="text-sm text-gray-500">Enable dark theme for better visibility in dark environments</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
              </label>
            </div>

            {/* Full Width */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Layout className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <label className="block text-base font-medium text-gray-900">
                    Full Width Display
                  </label>
                  <p className="text-sm text-gray-500">Expand widgets to use the full width of their container</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={fullWidth}
                  onChange={(e) => setFullWidth(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
              </label>
            </div>

            {/* Auto Play */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Monitor className="w-5 h-5 text-gray-700 mt-1" />
                <div>
                  <label className="block text-base font-medium text-gray-900">
                    Auto Play
                  </label>
                  <p className="text-sm text-gray-500">Automatically play stories when they come into view</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Code Snippet Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Integration Code</h2>
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium text-gray-700 transition-all bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200"
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
            <pre className="p-6 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto">
              <code>{generateCode()}</code>
            </pre>
          </div>

          <div className="mt-6 flex items-start gap-3 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />
            <div>
              <p className="text-blue-900 font-medium mb-1">Quick Setup Guide</p>
              <p className="text-blue-800">
                Add this universal code once to your website template, ideally before the closing body tag. 
                Then use the <Link href="/widget" className="text-blue-700 underline hover:text-blue-900 font-medium">Widgets page</Link> to 
                create and manage your story widgets. Changes to widget settings will be applied automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 