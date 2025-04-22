//client\src\app\components\audio-waveform.tsx
import { useRef, useEffect } from 'react'
import { cn } from '../lib/utils'

interface WaveformProps {
  audioUrl: string
  isPlaying: boolean
  progress: number
  duration: number
  onSeek: (progress: number) => void
  className?: string
}

export function Waveform({ 
  audioUrl, 
  isPlaying, 
  progress, 
  duration, 
  onSeek,
  className 
}: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext>()
  const analyserRef = useRef<AnalyserNode>()
  const sourceRef = useRef<MediaElementAudioSourceNode>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Инициализация Web Audio API
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const audioContext = audioContextRef.current
    analyserRef.current = audioContext.createAnalyser()
    analyserRef.current.fftSize = 256

    // Загрузка и подключение аудио
    const audio = new Audio(audioUrl)
    audio.crossOrigin = "anonymous"

    audio.addEventListener('canplay', () => {
      if (!audioContext || !analyserRef.current) return
      
      sourceRef.current = audioContext.createMediaElementSource(audio)
      sourceRef.current.connect(analyserRef.current)
      analyserRef.current.connect(audioContext.destination)
    })

    // Функция для отрисовки визуализации
    const draw = () => {
      if (!analyserRef.current || !ctx) return

      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyserRef.current.getByteFrequencyData(dataArray)

      ctx.fillStyle = '#18181b' // bg-zinc-900
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height

        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height)
        gradient.addColorStop(0, '#22c55e') // text-green-500
        gradient.addColorStop(1, '#15803d') // text-green-700

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }

      if (isPlaying) {
        requestAnimationFrame(draw)
      }
    }

    if (isPlaying) {
      draw()
    }

    return () => {
      if (sourceRef.current) {
        sourceRef.current.disconnect()
      }
    }
  }, [audioUrl, isPlaying])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const progress = (x / rect.width) * duration
    onSeek(progress)
  }

  return (
    <div className={cn("relative h-24 w-full rounded-lg bg-zinc-900", className)}>
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-pointer"
        onClick={handleClick}
        width={1024}
        height={200}
      />
      <div 
        className="absolute bottom-0 left-0 h-full bg-green-500/20" 
        style={{ width: `${(progress / duration) * 100}%` }}
      />
    </div>
  )
}