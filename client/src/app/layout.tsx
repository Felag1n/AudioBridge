//client\src\app\layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from './components/sidebar'
import { Header } from './components/header'
import { Player } from './components/player'
import { Providers } from './providers'
import { AuthProvider } from './contexts/auth-context'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Временно для тестирования
  const isAuthenticated = true ;

  return (
    <html lang="ru">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50`}>
        <AuthProvider>
          <Providers>
            {isAuthenticated ? (
              // Layout для авторизованных пользователей
              <div className="flex h-screen flex-col">
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto">
                    <Header />
                    <div className="p-6">
                      {children}
                    </div>
                  </main>
                </div>
                <Player />
              </div>
            ) : (
              // Layout для страницы авторизации
              <div className="min-h-screen">
                {children}
              </div>
            )}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}