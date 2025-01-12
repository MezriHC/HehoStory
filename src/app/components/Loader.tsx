export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-gray-900 rounded-full animate-[spin_1s_ease-in-out_infinite] border-t-transparent"></div>
      </div>
    </div>
  )
} 