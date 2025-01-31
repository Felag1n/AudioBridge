"use client"

import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useEffect, useState } from "react"
import { AvatarUpload } from "../../components/avatar-upload"
import { Loader2 } from "lucide-react"
import { userApi } from "@/app/services/api"
import { toast } from "sonner"
import { useAuth } from '@/app/components/contexts/auth-context'

export function EditProfileDialog() {
  const { user, setUser } = useAuth()
  const [nickname, setNickname] = useState(user?.username || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Загружаем текущий никнейм при открытии диалога
  useEffect(() => {
    if (isOpen && user) {
      setNickname(user.username || '')
    }
  }, [isOpen, user]);

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      toast.error("Введите никнейм")
      return
    }

    setIsSubmitting(true)
    try {
      await userApi.updateProfile({ 
        nickname: nickname.trim(),
        avatar: avatarFile
      })

      // Обновляем данные пользователя в контексте и localStorage
      if (user) {
        const updatedUserData = {
          ...user,
          username: nickname.trim()
        }
        localStorage.setItem('userData', JSON.stringify(updatedUserData))
        setUser(updatedUserData)
      }

      toast.success("Профиль обновлен")
      setIsOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Не удалось обновить профиль";
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Редактировать профиль</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="mx-auto">
            <AvatarUpload
              currentAvatarUrl={user?.avatarUrl || "/api/placeholder/96/96"}
              onAvatarChange={setAvatarFile}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nickname">Никнейм</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              'Сохранить'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}