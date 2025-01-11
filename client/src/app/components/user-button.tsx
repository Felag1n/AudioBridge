import { User } from 'lucide-react'
import Link from 'next/link'

export function UserButton() {
  return (
    <Link href="/profile" className="flex items-center gap-2 rounded-full bg-zinc-800 p-2 hover:bg-zinc-700">
      <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center">
        <User size={20} className="text-zinc-400" />
      </div>
      <span className="mr-2">Пользователь</span>
    </Link>
  )
}