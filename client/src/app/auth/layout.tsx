//client\src\app\auth\layout.tsx

export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-0 h-full w-full animate-pulse bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
          <div className="absolute top-1/2 right-0 h-full w-full animate-pulse bg-gradient-to-tl from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />
        </div>
        {children}
      </div>
    );
  }
  