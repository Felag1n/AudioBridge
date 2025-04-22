//client\src\app\components\user-button.tsx

"use client"

import { LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Button } from "@/app/components/ui/button"
import { authApi } from "@/app/services/api"
import { useAuth } from '@/app/components/contexts/auth-context'
import Link from "next/link"

export function UserButton() {
  const { setUser } = useAuth();

  const handleLogout = () => {
    authApi.logout();
    setUser(null); // Update the auth context when logging out
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-zinc-800/50">
          <User className="h-5 w-5 text-zinc-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-zinc-900 border-zinc-800">
        <Link href="/profile">
          <DropdownMenuItem className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Профиль
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}