//client\src\app\providers\index.tsx

"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { AuthProvider } from "@/app/components/contexts/auth-context"
import { AudioPlayerProvider } from "@/app/components/contexts/audio-player-context"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AudioPlayerProvider>
          {children}
        </AudioPlayerProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}