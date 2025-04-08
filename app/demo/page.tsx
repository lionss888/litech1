"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LogOut,
  UploadCloud,
  BarChart3,
  TrendingDown,
  Home,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Info,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { demoUser, calculateDemoSummary } from "@/lib/demo-data"

export default function DemoPage() {
  const router = useRouter()
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    // Рассчитываем сводку на основе демо-данных
    const demoSummary = calculateDemoSummary()
    setSummary(demoSummary)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex">
      {/* Боковая панель */}
      <aside className="w-20 md:w-64 bg-[#1E293B] border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-center md:justify-start">
          <span className="hidden md:block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] to-[#818CF8]">
            ФинУчет
          </span>
          <span className="md:hidden text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] to-[#818CF8]">
            Ф
          </span>
        </div>

        <nav className="flex-1 py-6">
          <div className="px-3 mb-6">
            <p className="text-white/40 text-xs uppercase tracking-wider px-3 mb-2 hidden md:block">Главное меню</p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/demo"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 text-white font-medium"
                >
                  <Home className="h-5 w-5 text-[#38BDF8]" />
                  <span className="hidden md:block">Дашборд</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => alert("Эта функция недоступна в демо-режиме")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <UploadCloud className="h-5 w-5" />
                  <span className="hidden md:block">Загрузить данные</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert("Эта функция недоступна в демо-режиме")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="hidden md:block">Сводная таблица</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="px-3">
            <p className="text-white/40 text-xs uppercase tracking-wider px-3 mb-2 hidden md:block">Действия</p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/login?register=true"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">Регистрация</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden md:block">На главную</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10 hidden md:block">
          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8] flex items-center justify-center text-white font-medium">
              {demoUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{demoUser.name}</p>
              <p className="text-xs text-white/60 truncate">{demoUser.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 overflow-auto">
        <header className="bg-[#1E293B]/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Демо-режим</h1>
            <div className="flex items-center gap-4">
              <Link href="/login?register=true">
                <Button
                  className="rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:opacity-90 transition-opacity border-0"
                  size="sm"
                >
                  Регистрация
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5">
                  <LogOut className="h-4 w-4 mr-2" />
                  На главную
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-bold">Демонстрационный режим</p>
            </div>
            <p className="text-sm">
              Вы находитесь в демо-режиме приложения. Здесь вы можете ознакомиться с основными функциями без
              регистрации. Данные в этом режиме предустановлены и не могут быть изменены.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/login?register=true">
                <Button
                  size="sm"
                  className="rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:opacity-90 transition-opacity border-0"
                >
                  Зарегистрироваться
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  Войти
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center">
              <Info className="h-5 w-5 mr-2" />
              <p className="text-sm">
                <strong>Демо-данные:</strong> Загружены тестовые финансовые данные за 3 месяца
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center">
              <h3 className="text-lg font-medium mb-2 text-white/80">Баланс</h3>
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#38BDF8] to-[#818CF8]">
                {summary ? formatCurrency(summary.profit) : "0 ₽"}
              </div>
              <div className={`text-sm mt-2 ${summary && summary.profit > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {summary && summary.totalExpense > 0
                  ? `${summary.profit > 0 ? "+" : ""}${((summary.profit / summary.totalExpense) * 100).toFixed(1)}% к расходам`
                  : "Нет данных о расходах"}
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center">
              <h3 className="text-lg font-medium mb-2 text-white/80">Доходы</h3>
              <div className="text-3xl font-bold text-emerald-400">
                {summary ? formatCurrency(summary.totalIncome) : "0 ₽"}
              </div>
              <div className="text-emerald-400/60 text-sm mt-2 flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {summary && Object.keys(summary.categorySummary).length > 0
                  ? `${Object.keys(summary.categorySummary).length} категорий`
                  : "Нет данных"}
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center">
              <h3 className="text-lg font-medium mb-2 text-white/80">Расходы</h3>
              <div className="text-3xl font-bold text-red-400">
                {summary ? formatCurrency(summary.totalExpense) : "0 ₽"}
              </div>
              <div className="text-red-400/60 text-sm mt-2 flex items-center justify-center">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                {summary && Object.keys(summary.categorySummary).length > 0
                  ? `${Object.keys(summary.categorySummary).length} категорий`
                  : "Нет данных"}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-4 text-white/80">Действия</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => alert("Эта функция недоступна в демо-режиме")}
                  className="rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:opacity-90 transition-opacity border-0"
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Загрузить CSV данные
                </Button>
                <Button
                  onClick={() => alert("Эта функция недоступна в демо-режиме")}
                  variant="outline"
                  className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Просмотреть сводную таблицу
                </Button>
                <Link href="/login?register=true" className="col-span-1 md:col-span-2">
                  <Button className="w-full rounded-xl bg-gradient-to-r from-[#C084FC] to-[#F472B6] hover:opacity-90 transition-opacity border-0">
                    Зарегистрироваться для полного доступа
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-4 text-white/80">Информация</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/60">Email:</span>
                  <span className="font-medium">{demoUser.email}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="text-white/60">Имя:</span>
                  <span className="font-medium">{demoUser.name}</span>
                </div>
                {summary && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-white/60">Всего категорий:</span>
                      <span className="font-medium">{Object.keys(summary.categorySummary).length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-white/60">Периодов данных:</span>
                      <span className="font-medium">{Object.keys(summary.monthlySummary).length || 0}</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {summary && Object.keys(summary.categorySummary).length > 0 ? (
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white/80">Топ категорий по расходам</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert("Эта функция недоступна в демо-режиме")}
                  className="rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  Подробнее
                </Button>
              </div>

              <div className="space-y-4">
                {Object.entries(summary.categorySummary)
                  .sort((a, b) => b[1].expense - a[1].expense)
                  .slice(0, 3)
                  .map(([category, data]: [string, any]) => (
                    <div key={category} className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mr-4">
                        <TrendingDown className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{category}</div>
                        <div className="text-sm text-white/60">Расходы</div>
                      </div>
                      <div className="text-red-400 font-medium">{formatCurrency(data.expense)}</div>
                    </div>
                  ))}
              </div>
            </Card>
          ) : (
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl text-center">
              <div className="w-16 h-16 rounded-full bg-[#38BDF8]/10 flex items-center justify-center mx-auto mb-6">
                <Plus className="h-8 w-8 text-[#38BDF8]" />
              </div>
              <h3 className="text-xl font-medium mb-4">Начните работу с системой</h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Загрузите CSV файл с вашими финансовыми данными, чтобы увидеть аналитику и сводную информацию
              </p>
              <Link href="/login?register=true">
                <Button className="rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:opacity-90 transition-opacity border-0">
                  Зарегистрироваться
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
