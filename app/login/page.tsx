"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { loginUser, registerUser } from "../actions/auth-client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showTestUsers, setShowTestUsers] = useState(true)

  const [adminEmail, setAdminEmail] = useState("admin@example.com")
  const [adminPassword, setAdminPassword] = useState("admin123")
  const [testEmail, setTestEmail] = useState("test@example.com")
  const [testPassword, setTestPassword] = useState("test123")

  useEffect(() => {
    // Проверяем параметр register в URL
    const register = searchParams.get("register")
    if (register === "true") {
      setIsLogin(false)
    }
  }, [searchParams])

  const handleAdminTestAccount = () => {
    setEmail(adminEmail)
    setPassword(adminPassword)
  }

  const handleTestTestAccount = () => {
    setEmail(testEmail)
    setPassword(testPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isLogin) {
        // Вход пользователя
        const result = await loginUser(email, password)
        if (result.success) {
          router.replace("/dashboard")
        } else {
          setError(result.error || "Ошибка при входе")
        }
      } else {
        // Регистрация пользователя
        const result = await registerUser(name, email, password)
        if (result.success) {
          router.replace("/dashboard")
        } else {
          setError(result.error || "Ошибка при регистрации")

          // Если ошибка 409 (пользователь уже существует), предлагаем войти
          if (result.statusCode === 409) {
            setIsLogin(true)
          }
        }
      }
    } catch (error) {
      console.error("Ошибка:", error)
      setError("Произошла ошибка при обработке запроса")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen apple-bg flex flex-col">
      {/* Шапка с логотипом */}
      <header className="py-4 apple-glass sticky top-0 z-50">
        <div className="max-w-md mx-auto px-6 flex items-center">
          <Link href="/" className="flex items-center gap-2 group clickable">
            <ArrowLeft className="h-4 w-4 text-[#86868b] group-hover:text-[#1d1d1f] transition-colors" />
            <span className="text-base font-semibold apple-gradient">ФинУчет</span>
          </Link>
        </div>
      </header>

      {/* Основное содержимое */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2 apple-heading">{isLogin ? "Вход" : "Регистрация"}</h1>
            <p className="apple-text">{isLogin ? "Войдите в свой аккаунт" : "Создайте новый аккаунт"}</p>
          </div>

          {showTestUsers && (
            <div className="mb-6 apple-card p-4">
              <p className="text-sm font-medium mb-3 apple-heading">Тестовые аккаунты</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="apple-button-secondary text-sm py-2 px-3 clickable text-center"
                  onClick={handleAdminTestAccount}
                >
                  admin@example.com
                </button>
                <button
                  className="apple-button-secondary text-sm py-2 px-3 clickable text-center"
                  onClick={handleTestTestAccount}
                >
                  test@example.com
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="apple-form-group">
                <label htmlFor="name" className="apple-form-label">
                  Имя
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Введите ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="apple-input w-full"
                />
              </div>
            )}
            <div className="apple-form-group">
              <label htmlFor="email" className="apple-form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Введите ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="apple-input w-full"
              />
            </div>
            <div className="apple-form-group">
              <label htmlFor="password" className="apple-form-label">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                placeholder="Введите ваш пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="apple-input w-full"
              />
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="apple-button w-full py-3 mt-4 clickable"
              disabled={isLoading}
              style={{ zIndex: 20 }}
            >
              {isLoading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#0071e3] hover:text-[#0077ed] transition-colors text-sm clickable"
              style={{ zIndex: 20 }}
            >
              {isLogin ? "Нет учетной записи? Зарегистрироваться" : "Уже есть учетная запись? Войти"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
