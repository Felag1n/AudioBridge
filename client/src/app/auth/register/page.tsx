'use client'

import { AuthForm } from '../auth-form'

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-[400px] space-y-6">
      <AuthForm mode="register" />
    </div>
  )
}