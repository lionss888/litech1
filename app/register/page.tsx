"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "../auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Проверка паролей
    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    setIsLoading(true)

    try {
      const result = await register(name, email, password)
      if (result.success) {
        router.push("/")
      } else {
        setError(result.error || "Ошибка при регистрации")
      }
    } catch (err) {
      setError("Произошла ошибка при регистрации")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#2c3e50] text-white py-4">
        <div className="container mx-auto px-4">
          <div className="text-xl font-bold">ФинУчет</div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Регистрация</h1>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Имя</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Пароль</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Подтверждение пароля</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full bg-[#3498db] hover:bg-[#2980b9]" disabled={isLoading}>
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Уже есть аккаунт?{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              Войти
            </Link>
          </div>
        </Card>
      </main>

      <footer className="bg-[#2c3e50] text-white py-3 text-center">
        <div className="container mx-auto px-4">&copy; 2023 ФинУчет. Все права защищены.</div>
      </footer>
    </div>
  )
}

