"use client"

import { useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { trackApi } from "../../services/api"
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  PlayCircle,
  Pause,
  AudioLines
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Textarea } from "../../components/ui/textarea"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

function WaveformVisualizer() {
  return (
    <div className="relative h-24 w-full bg-zinc-900 rounded-lg">
      <div className="absolute inset-0 flex items-center justify-center">
        <AudioLines className="h-16 w-16 text-zinc-700" />
      </div>
    </div>
  )
}

function CommentSection({ trackId }: { trackId: string }) {
  const [newComment, setNewComment] = useState("")
  const queryClient = useQueryClient()

  const { data: comments, isLoading } = useQuery({
    queryKey: ['track', trackId, 'comments'],
    queryFn: () => trackApi.getComments(trackId)
  })

  const { mutate: addComment, isPending: isAddingComment } = useMutation({
    mutationFn: (content: string) => trackApi.addComment(trackId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['track', trackId, 'comments'] })
      setNewComment("")
      toast.success("Комментарий добавлен")
    },
    onError: () => {
      toast.error("Не удалось добавить комментарий")
    }
  })

  const handleSubmit = () => {
    if (!newComment.trim()) return
    addComment(newComment)
  }

  if (isLoading) {
    return <div className="flex justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/api/placeholder/32/32" alt="Your avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea 
            placeholder="Напишите комментарий..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="mt-2 flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isAddingComment || !newComment.trim()}
            >
              {isAddingComment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                'Отправить'
              )}
            </Button>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[400px]">
        {comments?.data.map((comment: any) => (
          <div key={comment.id} className="flex gap-4 p-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.user.avatarUrl} alt={comment.user.nickname} />
              <AvatarFallback>{comment.user.nickname[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{comment.user.nickname}</span>
                <span className="text-sm text-zinc-400">{comment.createdAt}</span>
              </div>
              <p className="mt-1 text-zinc-300">{comment.content}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

export default function TrackPage() {
  const params = useParams()
  const trackId = params.id as string
  const queryClient = useQueryClient()
  const [isPlaying, setIsPlaying] = useState(false)

  const { data: track, isLoading } = useQuery({
    queryKey: ['track', trackId],
    queryFn: () => trackApi.getTrack(trackId)
  })

  const { mutate: toggleLike, isPending: isTogglingLike } = useMutation({
    mutationFn: () => trackApi.toggleLike(trackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['track', trackId] })
      toast.success(track?.isLiked ? "Удалено из любимых" : "Добавлено в любимые")
    },
    onError: () => {
      toast.error("Не удалось обновить статус")
    }
  })

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Ссылка скопирована")
    } catch (err) {
      toast.error("Не удалось скопировать ссылку")
    }
  }

  if (isLoading || !track) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.32))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end gap-6">
        <div className="relative aspect-square w-48 overflow-hidden rounded-lg">
          <img 
            src="/favicon.ico" 
            alt={track.title}
            className="object-cover"
          />
          <button 
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-12 w-12" />
            ) : (
              <PlayCircle className="h-12 w-12" />
            )}
          </button>
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{track.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={track.artist.avatarUrl} alt={track.artist.name} />
              <AvatarFallback>{track.artist.name[0]}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{track.artist.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            size="icon" 
            variant="ghost"
            onClick={() => toggleLike()}
            disabled={isTogglingLike}
            className={track.isLiked ? "text-purple-400" : ""}
          >
            <Heart 
              className={`h-6 w-6 ${track.isLiked ? "fill-current" : ""}`} 
            />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleShare}>
            <Share2 className="h-6 w-6" />
          </Button>
          <Button size="icon" variant="ghost">
            <MoreHorizontal className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <WaveformVisualizer />

      <div className="flex gap-4 border-b border-zinc-800">
        <button className="border-b-2 border-purple-400 px-4 py-2 font-medium">
          Комментарии
        </button>
        <button className="px-4 py-2 text-zinc-400 hover:text-zinc-100">
          Похожие треки
        </button>
      </div>

      <CommentSection trackId={trackId} />
    </div>
  )
}