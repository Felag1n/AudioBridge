'use client'

import { AuthForm } from '@/app/auth/auth-form'

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-[400px] space-y-6">
      <AuthForm mode="login" />
    </div>
  )
}


