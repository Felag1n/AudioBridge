//client\src\app\components\avatar-upload.tsx

"use client"

import { useState, useRef } from "react"
import { Camera, X } from "lucide-react"
import { Button } from "../components/ui/button"
import { toast } from "sonner"
import Image from "next/image"

interface AvatarUploadProps {
  currentAvatarUrl?: string
  onAvatarChange: (file: File | null) => void
  className?: string
}

export function AvatarUpload({ 
  currentAvatarUrl, 
  onAvatarChange,
  className = "h-24 w-24"
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        toast.error('Пожалуйста, выберите изображение')
        return
      }

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Размер файла не должен превышать 5MB')
        return
      }

      // Создаем превью
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      onAvatarChange(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onAvatarChange(null)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Изображение аватара */}
      <div className="aspect-square overflow-hidden rounded-full">
        {(preview || currentAvatarUrl) ? (
          <img
            src={preview || currentAvatarUrl}
            alt="Avatar preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-800">
            <Camera className="h-1/3 w-1/3 text-zinc-400" />
          </div>
        )}
      </div>

      {/* Кнопка загрузки */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="absolute -bottom-2 -right-2 flex gap-1">
        {(preview || currentAvatarUrl) && (
          <Button 
            size="icon"
            variant="destructive"
            className="h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button 
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
