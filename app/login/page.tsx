import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-4">
        
        {/* TEKS DI ATAS FORM */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">CS Assistance</h1>
          <p className="text-sm text-muted-foreground">
            Masuk untuk melanjutkan
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
