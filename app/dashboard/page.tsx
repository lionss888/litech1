"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { checkAuth, logoutUser } from "@/app/actions/auth"
import { getSummary } from "@/app/actions/csv"
import {
  LogOut,
  UploadCloud,
  BarChart3,
  TrendingDown,
  Settings,
  Database,
  Home,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Bell,
  Search,
  Menu,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<any>(null)
  const [error, setError] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [storageStatus, setStorageStatus] = useState<any>(null)

  useEffect(() => {
    async function checkUserAuth() {
      try {
        setIsLoading(true)
        const { authenticated, user } = await checkAuth()

        if (!authenticated) {
          const hasLocalSession =
            typeof window !== "undefined" &&
            (localStorage.getItem("finuchet:session") || sessionStorage.getItem("finuchet:session"))

          if (!hasLocalSession) {
            router.replace("/login")
            return
          }
        }

        setUser(user)

        const result = await getSummary()
        if (result.success) {
          setSummary(result.summary)
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error)
        setError("Произошла ошибка при загрузке данных")
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAuth()
    checkStorageStatus()
  }, [router])

  const handleLogout = async () => {
    const result = await logoutUser()
    if (result.success) {
      router.push("/login")
    }
  }

  const checkStorageStatus = async () => {
    try {
      const response = await fetch("/api/storage-status")
      const data = await response.json()
      setStorageStatus(data)
    } catch (error) {
      console.error("Ошибка при проверке статуса хранилища:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen apple-bg flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-[#0071e3] border-r-transparent"></div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen apple-bg">
      {/* Мобильное меню */}
      <div
        className={`fixed inset-0 apple-glass z-50 transition-transform duration-300 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="p-6 flex justify-between items-center">
          <span className="text-xl font-semibold apple-gradient">ФинУчет</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-6">
          <ul className="space-y-3">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0071e3] text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Дашборд</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/upload"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1d1d1f] hover:bg-black/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UploadCloud className="h-5 w-5" />
                <span>Загрузить данные</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/summary"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1d1d1f] hover:bg-black/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Сводная таблица</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#1d1d1f] hover:bg-black/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Профиль</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#1d1d1f] hover:bg-black/5 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Выйти</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Шапка */}
      <header className="apple-glass sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4 text-[#1d1d1f] hover:bg-black/5 p-2 rounded-full transition-colors clickable"
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ zIndex: 20 }}
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-xl font-semibold apple-gradient">ФинУчет</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-[#86868b]" />
              <input type="text" placeholder="Поиск..." className="apple-input pl-10 pr-4 py-2 w-48" />
            </div>
            <button
              className="relative text-[#1d1d1f] hover:bg-black/5 p-2 rounded-full transition-colors clickable"
              style={{ zIndex: 20 }}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#0071e3] rounded-full"></span>
            </button>
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-black/10">
              <div className="w-8 h-8 rounded-full bg-[#0071e3] flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "У"}
              </div>
              <button
                onClick={handleLogout}
                className="text-[#1d1d1f] hover:text-[#0071e3] text-sm clickable transition-colors"
                style={{ zIndex: 20 }}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Навигация */}
        <div className="hidden md:flex mb-8">
          <nav className="flex space-x-2">
            <Link href="/dashboard" className="px-4 py-2 rounded-full bg-[#0071e3] text-white text-sm font-medium">
              Дашборд
            </Link>
            <Link
              href="/dashboard/upload"
              className="px-4 py-2 rounded-full text-[#1d1d1f] hover:bg-black/5 transition-colors text-sm"
            >
              Загрузить данные
            </Link>
            <Link
              href="/dashboard/summary"
              className="px-4 py-2 rounded-full text-[#1d1d1f] hover:bg-black/5 transition-colors text-sm"
            >
              Сводная таблица
            </Link>
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 rounded-full text-[#1d1d1f] hover:bg-black/5 transition-colors text-sm"
            >
              Профиль
            </Link>
          </nav>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-6">{error}</div>
        )}

        {/* Основные показатели */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="apple-card p-6 flex flex-col apple-card-hover">
            <span className="text-sm text-[#86868b] mb-2">Баланс</span>
            <span className="text-2xl font-semibold apple-heading">
              {summary ? formatCurrency(summary.profit) : "0 ₽"}
            </span>
            <div className={`text-sm mt-2 ${summary && summary.profit > 0 ? "text-green-600" : "text-red-600"}`}>
              {summary && summary.totalExpense > 0
                ? `${summary.profit > 0 ? "+" : ""}${((summary.profit / summary.totalExpense) * 100).toFixed(0)}%`
                : "Нет данных"}
            </div>
          </div>

          <div className="apple-card p-6 flex flex-col apple-card-hover">
            <span className="text-sm text-[#86868b] mb-2">Доходы</span>
            <span className="text-2xl font-semibold text-green-600">
              {summary ? formatCurrency(summary.totalIncome) : "0 ₽"}
            </span>
            <div className="text-green-600/70 text-sm mt-2 flex items-center">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              {summary && Object.keys(summary.categorySummary).length > 0
                ? `${Object.keys(summary.categorySummary).length} категорий`
                : "Нет данных"}
            </div>
          </div>

          <div className="apple-card p-6 flex flex-col apple-card-hover">
            <span className="text-sm text-[#86868b] mb-2">Расходы</span>
            <span className="text-2xl font-semibold text-red-600">
              {summary ? formatCurrency(summary.totalExpense) : "0 ₽"}
            </span>
            <div className="text-red-600/70 text-sm mt-2 flex items-center">
              <ArrowDownRight className="h-4 w-4 mr-1" />
              {summary && Object.keys(summary.categorySummary).length > 0
                ? `${Object.keys(summary.categorySummary).length} категорий`
                : "Нет данных"}
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="apple-card p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 apple-heading">Быстрые действия</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push("/dashboard/upload")}
              className="apple-button py-3 flex items-center justify-center clickable"
              style={{ zIndex: 20 }}
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Загрузить CSV
            </button>
            <button
              onClick={() => router.push("/dashboard/summary")}
              className="apple-button-secondary py-3 flex items-center justify-center clickable"
              style={{ zIndex: 20 }}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Сводная таблица
            </button>
            <button
              onClick={checkStorageStatus}
              className="apple-button-secondary py-3 flex items-center justify-center clickable"
              style={{ zIndex: 20 }}
            >
              <Database className="h-4 w-4 mr-2" />
              Проверить хранилище
            </button>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="apple-button-secondary py-3 flex items-center justify-center clickable"
              style={{ zIndex: 20 }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </button>
          </div>
        </div>

        {/* Основной контент в сетке */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Информация о пользователе */}
          <div className="apple-card p-6 apple-card-hover">
            <h3 className="text-lg font-semibold mb-4 apple-heading">Информация</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/5">
                <span className="text-[#86868b]">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/5">
                <span className="text-[#86868b]">Имя:</span>
                <span className="font-medium">{user?.name || "Не указано"}</span>
              </div>
              {summary && (
                <>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/5">
                    <span className="text-[#86868b]">Категорий:</span>
                    <span className="font-medium">{Object.keys(summary.categorySummary).length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/5">
                    <span className="text-[#86868b]">Периодов:</span>
                    <span className="font-medium">{Object.keys(summary.monthlySummary).length || 0}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Топ категорий по расходам */}
          <div className="apple-card p-6 md:col-span-2 apple-card-hover">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold apple-heading">Топ категорий по расходам</h3>
              <button
                onClick={() => router.push("/dashboard/summary")}
                className="text-[#0071e3] hover:text-[#0077ed] transition-colors flex items-center clickable"
                style={{ zIndex: 20 }}
              >
                Подробнее
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            {summary && Object.keys(summary.categorySummary).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(summary.categorySummary)
                  .sort((a, b) => b[1].expense - a[1].expense)
                  .slice(0, 3)
                  .map(([category, data]: [string, any]) => (
                    <div
                      key={category}
                      className="flex items-center p-4 rounded-xl bg-black/5 hover:bg-black/10 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mr-4">
                        <TrendingDown className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium truncate">{category}</div>
                        <div className="text-sm text-[#86868b]">Расходы</div>
                      </div>
                      <div className="text-base text-red-600 font-medium">{formatCurrency(data.expense)}</div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#0071e3]/10 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-[#0071e3]" />
                </div>
                <p className="text-[#86868b] mb-4">Нет данных для анализа</p>
                <button
                  onClick={() => router.push("/dashboard/upload")}
                  className="apple-button py-2 px-4 clickable"
                  style={{ zIndex: 20 }}
                >
                  Загрузить данные
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Статус хранилища */}
        {storageStatus && storageStatus.status === "success" && (
          <div className="apple-card p-6 mt-6 apple-card-hover">
            <h3 className="text-lg font-semibold mb-4 apple-heading">Статус хранилища</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black/5">
                <p className="text-[#86868b] mb-2">Режим</p>
                <p className="font-medium">
                  {storageStatus.data.currentMode === "edge-config"
                    ? "Vercel Edge Config"
                    : storageStatus.data.currentMode === "browser"
                      ? "Браузерное хранилище"
                      : "Локальное хранилище"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-black/5">
                <p className="text-[#86868b] mb-2">Edge Config</p>
                <p className="font-medium">{storageStatus.data.edgeConfig.isAvailable ? "Доступен" : "Недоступен"}</p>
              </div>
              <div className="p-4 rounded-xl bg-black/5">
                <p className="text-[#86868b] mb-2">Браузерное хранилище</p>
                <p className="font-medium">
                  {storageStatus.data.browserStorage.isAvailable
                    ? `Доступно (${storageStatus.data.browserStorage.storageType})`
                    : "Недоступно"}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
