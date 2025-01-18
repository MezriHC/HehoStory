export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    </div>
  )
} 