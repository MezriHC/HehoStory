import { Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface VideoThumbnailProps {
  url: string
  className?: string
}

export default function VideoThumbnail({ url, className }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    // Créer une URL blob pour la vidéo
    const videoBlob = fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob)
        video.src = blobUrl

        const handleLoadedMetadata = () => {
          // Choisir un moment aléatoire dans la première moitié de la vidéo
          const randomTime = Math.random() * (video.duration / 2)
          video.currentTime = randomTime
        }

        const handleSeeked = () => {
          const context = canvas.getContext('2d')
          if (!context) return

          // Définir les dimensions du canvas pour correspondre à la vidéo
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          // Dessiner la frame actuelle sur le canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height)

          try {
            // Convertir le canvas en URL de données
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
            setThumbnail(dataUrl)
          } catch (error) {
            console.error('Erreur lors de la génération de la miniature:', error)
            // En cas d'erreur, on utilise une miniature par défaut
            setThumbnail(null)
          }

          // Nettoyer
          video.removeEventListener('loadedmetadata', handleLoadedMetadata)
          video.removeEventListener('seeked', handleSeeked)
          URL.revokeObjectURL(blobUrl)
          video.src = ''
        }

        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('seeked', handleSeeked)
      })
      .catch(error => {
        console.error('Erreur lors du chargement de la vidéo:', error)
        setThumbnail(null)
      })

    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', () => {})
        video.removeEventListener('seeked', () => {})
        video.src = ''
      }
    }
  }, [url])

  return (
    <>
      <video ref={videoRef} className="hidden" preload="metadata" crossOrigin="anonymous" />
      <canvas ref={canvasRef} className="hidden" />
      {thumbnail ? (
        <img src={thumbnail} alt="" className={className} />
      ) : (
        <div className={`${className} bg-gray-200 flex items-center justify-center`}>
          <div className="relative">
            <Play className="w-8 h-8 text-gray-400" />
            <div className="absolute inset-0 animate-pulse bg-gray-300/50 rounded-full" />
          </div>
        </div>
      )}
    </>
  )
} 