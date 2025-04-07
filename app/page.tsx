"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "./auth-context"
import { Mail, LogOut } from "lucide-react"
import Link from "next/link"

// Добавим импорты для новых иконок
import { BarChart, List, Target } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OnlineAccountingDemo() {
  const { user, isLoading } = useAuth()

  // Показываем состояние загрузки при проверке аутентификации
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  // Если не аутентифицирован, показываем страницу входа
  if (!user) {
    return <LoginPage />
  }

  // Если аутентифицирован, показываем панель управления
  return <Dashboard user={user} />
}

function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Исправляем проблемы с гидратацией
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (!result.success) {
        setError(result.error || "Неверный email или пароль")
      }
    } catch (err) {
      setError("Произошла ошибка при входе")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Обработка клика по кнопке социальной авторизации
  const handleSocialLogin = (provider: string) => {
    alert(`${provider} авторизация будет добавлена позже`)
  }

  if (!isClient) {
    return null // Предотвращаем ошибки гидратации
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
          <h1 className="text-2xl font-bold text-center mb-6">Вход в систему</h1>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                placeholder="example@mail.ru"
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
              />
            </div>

            <Button type="submit" className="w-full bg-[#3498db] hover:bg-[#2980b9]" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Зарегистрироваться
            </Link>
          </div>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-500 mb-4">Или войдите через:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("Google")}
              >
                <Mail className="w-5 h-5" />
                Google
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("Яндекс")}
              >
                <Mail className="w-5 h-5" />
                Яндекс
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("ВТБ ID")}
              >
                <Mail className="w-5 h-5" />
                ВТБ ID
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2"
                onClick={() => handleSocialLogin("Apple")}
              >
                <Mail className="w-5 h-5" />
                Apple
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <footer className="bg-[#2c3e50] text-white py-3 text-center">
        <div className="container mx-auto px-4">&copy; 2023 ФинУчет. Все права защищены.</div>
      </footer>
    </div>
  )
}

function Dashboard({ user }: { user: any }) {
  const { logout } = useAuth()
  const router = useRouter()
  const [statistics, setStatistics] = useState<any>(null)

  useEffect(() => {
    // Здесь будет логика для получения статистики
    const fetchStatistics = async () => {
      try {
        // Заглушка для статистики
        const mockStatistics = {
          balance: {
            total: 120500,
            income: 45000,
            expense: 32500,
          },
          budgets: [
            { category: "Продукты", spent: 8500, limit: 15000 },
            { category: "Развлечения", spent: 3200, limit: 10000 },
            { category: "Транспорт", spent: 4800, limit: 5000 },
          ],
        }
        setStatistics(mockStatistics)
      } catch (error) {
        console.error("Failed to fetch statistics", error)
      }
    }

    fetchStatistics()
  }, [])

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    })
  }

  const calculateChange = (income: number, expense: number) => {
    if (expense === 0) return 100 // Избегаем деления на ноль
    return ((income - expense) / expense) * 100
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#2c3e50] text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-xl font-bold">ФинУчет</div>
          {/* В разделе навигации добавим ссылки на новые страницы */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-white hover:text-gray-300">
              Дашборд
            </Link>
            <Link href="/transactions" className="text-white hover:text-gray-300">
              Транзакции
            </Link>
            <Link href="/categories" className="text-white hover:text-gray-300">
              Категории
            </Link>
            <Link href="/budget" className="text-white hover:text-gray-300">
              Бюджет
            </Link>
            <Link href="/reports" className="text-white hover:text-gray-300">
              Отчеты
            </Link>
            {user.role === "ADMIN" && (
              <Link href="/admin/users" className="text-white hover:text-gray-300">
                Пользователи
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {user.image ? (
              <img src={user.image || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-[#3498db] rounded-full flex items-center justify-center text-white">
                {user?.name ? user.name.charAt(0) : "У"}
              </div>
            )}
            <span className="hidden md:inline">{user?.name || "Пользователь"}</span>
            <Button variant="ghost" size="icon" className="text-white" onClick={logout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Панель управления</h1>

          {/* В разделе с карточками добавим ссылки на новые функции */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-4 text-center">
              <h3 className="text-lg font-medium mb-2">Баланс</h3>
              <div className="text-2xl font-bold">{statistics ? formatAmount(statistics.balance.total) : "0 ₽"}</div>
              <div className="text-green-500 text-sm">
                {statistics && statistics.balance.income > 0
                  ? `+${calculateChange(statistics.balance.income, statistics.balance.expense).toFixed(1)}% за месяц`
                  : "0% за месяц"}
              </div>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => router.push("/reports")}>
                <BarChart className="h-4 w-4 mr-2" />
                Подробнее
              </Button>
            </Card>

            <Card className="p-4 text-center">
              <h3 className="text-lg font-medium mb-2">Доходы (месяц)</h3>
              <div className="text-2xl font-bold">{statistics ? formatAmount(statistics.balance.income) : "0 ₽"}</div>
              <div className="text-green-500 text-sm">
                {statistics && statistics.balance.income > 0 ? "+8.3% к прошлому месяцу" : "0% к прошлому месяцу"}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => router.push("/transactions?type=income")}
              >
                <List className="h-4 w-4 mr-2" />
                Все доходы
              </Button>
            </Card>

            <Card className="p-4 text-center">
              <h3 className="text-lg font-medium mb-2">Расходы (месяц)</h3>
              <div className="text-2xl font-bold">{statistics ? formatAmount(statistics.balance.expense) : "0 ₽"}</div>
              <div className="text-green-500 text-sm">
                {statistics && statistics.balance.expense > 0 ? "-5.2% к прошлому месяцу" : "0% к прошлому месяцу"}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => router.push("/transactions?type=expense")}
              >
                <List className="h-4 w-4 mr-2" />
                Все расходы
              </Button>
            </Card>
          </div>

          {/* Добавим новую карточку для бюджетов */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="p-4 col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Движение средств</h3>
                <Link href="/reports">
                  <Button variant="outline" size="sm">
                    <BarChart className="h-4 w-4 mr-2" />
                    Подробнее
                  </Button>
                </Link>
              </div>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                {statistics ? (
                  <div className="w-full h-full p-4">
                    <div className="text-center text-gray-500">График движения средств</div>
                  </div>
                ) : (
                  <div className="text-gray-500">Нет данных для отображения</div>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Бюджеты</h3>
                <Link href="/budget">
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Подробнее
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Продукты</span>
                    <span className="text-sm">8 500 ₽ / 15 000 ₽</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "57%" }}></div>
                  </div>
                </div>
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Развлечения</span>
                    <span className="text-sm">3 200 ₽ / 10 000 ₽</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "32%" }}></div>
                  </div>
                </div>
                <div className="p-3 border rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Транспорт</span>
                    <span className="text-sm">4 800 ₽ / 5 000 ₽</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "96%" }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Последние операции</h3>
              <Button variant="outline" size="sm">
                Все операции
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center p-3 border-b">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                  ↓
                </div>
                <div className="flex-1">
                  <div className="font-medium">Поступление от клиента</div>
                  <div className="text-sm text-gray-500">Доходы</div>
                </div>
                <div className="text-sm text-gray-500 mx-4">15.04.2023</div>
                <div className="text-green-600 font-medium">+15 000 ₽</div>
              </div>

              <div className="flex items-center p-3 border-b">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-4">
                  ↑
                </div>
                <div className="flex-1">
                  <div className="font-medium">Оплата аренды</div>
                  <div className="text-sm text-gray-500">Расходы</div>
                </div>
                <div className="text-sm text-gray-500 mx-4">12.04.2023</div>
                <div className="text-red-600 font-medium">-8 500 ₽</div>
              </div>

              <div className="flex items-center p-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                  ↓
                </div>
                <div className="flex-1">
                  <div className="font-medium">Оплата по договору</div>
                  <div className="text-sm text-gray-500">Доходы</div>
                </div>
                <div className="text-sm text-gray-500 mx-4">10.04.2023</div>
                <div className="text-green-600 font-medium">+12 000 ₽</div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <footer className="bg-[#2c3e50] text-white py-3 text-center">
        <div className="container mx-auto px-4">&copy; 2023 ФинУчет. Все права защищены.</div>
      </footer>
    </div>
  )
}

