"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, BarChart3, PieChart, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { demoCSVData, calculateDemoSummary } from "@/lib/demo-data"

export default function DemoSummaryPage() {
  const [summary, setSummary] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("categories")

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("ru-RU", { year: "numeric", month: "long", day: "numeric" }).format(date)
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      <header className="bg-[#1E293B]/50 backdrop-blur-sm border-b border-white/10 py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Link href="/demo" className="flex items-center text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Назад к демо</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-bold">Демонстрационный режим</p>
            </div>
            <p className="text-sm">
              Вы просматриваете демонстрационные данные. Для работы с собственными данными, пожалуйста,
              зарегистрируйтесь.
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
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-6">Сводная таблица</h1>

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
                <TrendingUp className="h-4 w-4 mr-1" />
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
                <TrendingDown className="h-4 w-4 mr-1" />
                {summary && Object.keys(summary.categorySummary).length > 0
                  ? `${Object.keys(summary.categorySummary).length} категорий`
                  : "Нет данных"}
              </div>
            </Card>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl mb-6 overflow-hidden">
            <div className="flex border-b border-white/10">
              <button
                className={`px-6 py-4 text-sm font-medium flex items-center ${
                  activeTab === "categories"
                    ? "text-white border-b-2 border-[#38BDF8]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setActiveTab("categories")}
              >
                <PieChart className="h-4 w-4 mr-2" />
                По категориям
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium flex items-center ${
                  activeTab === "months"
                    ? "text-white border-b-2 border-[#38BDF8]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setActiveTab("months")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                По месяцам
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium flex items-center ${
                  activeTab === "transactions"
                    ? "text-white border-b-2 border-[#38BDF8]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setActiveTab("transactions")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Все транзакции
              </button>
            </div>

            <div className="p-6">
              {activeTab === "categories" && summary && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Сводка по категориям</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-3 px-4 text-left text-white/80">Категория</th>
                          <th className="py-3 px-4 text-right text-white/80">Доходы</th>
                          <th className="py-3 px-4 text-right text-white/80">Расходы</th>
                          <th className="py-3 px-4 text-right text-white/80">Баланс</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {Object.entries(summary.categorySummary).map(([category, data]: [string, any]) => (
                          <tr key={category} className="hover:bg-white/5">
                            <td className="py-3 px-4 font-medium">{category}</td>
                            <td className="py-3 px-4 text-right text-emerald-400">{formatCurrency(data.income)}</td>
                            <td className="py-3 px-4 text-right text-red-400">{formatCurrency(data.expense)}</td>
                            <td
                              className={`py-3 px-4 text-right ${
                                data.income - data.expense >= 0 ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {formatCurrency(data.income - data.expense)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-white/20 font-medium">
                          <td className="py-3 px-4">Итого</td>
                          <td className="py-3 px-4 text-right text-emerald-400">
                            {formatCurrency(summary.totalIncome)}
                          </td>
                          <td className="py-3 px-4 text-right text-red-400">{formatCurrency(summary.totalExpense)}</td>
                          <td
                            className={`py-3 px-4 text-right ${
                              summary.profit >= 0 ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {formatCurrency(summary.profit)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "months" && summary && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Сводка по месяцам</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-3 px-4 text-left text-white/80">Месяц</th>
                          <th className="py-3 px-4 text-right text-white/80">Доходы</th>
                          <th className="py-3 px-4 text-right text-white/80">Расходы</th>
                          <th className="py-3 px-4 text-right text-white/80">Баланс</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {Object.entries(summary.monthlySummary)
                          .sort((a, b) => a[0].localeCompare(b[0]))
                          .map(([month, data]: [string, any]) => {
                            const [year, monthNum] = month.split("-")
                            const date = new Date(Number.parseInt(year), Number.parseInt(monthNum) - 1)
                            const monthName = date.toLocaleString("ru-RU", { month: "long", year: "numeric" })
                            return (
                              <tr key={month} className="hover:bg-white/5">
                                <td className="py-3 px-4 font-medium">{monthName}</td>
                                <td className="py-3 px-4 text-right text-emerald-400">{formatCurrency(data.income)}</td>
                                <td className="py-3 px-4 text-right text-red-400">{formatCurrency(data.expense)}</td>
                                <td
                                  className={`py-3 px-4 text-right ${
                                    data.income - data.expense >= 0 ? "text-emerald-400" : "text-red-400"
                                  }`}
                                >
                                  {formatCurrency(data.income - data.expense)}
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-white/20 font-medium">
                          <td className="py-3 px-4">Итого</td>
                          <td className="py-3 px-4 text-right text-emerald-400">
                            {formatCurrency(summary.totalIncome)}
                          </td>
                          <td className="py-3 px-4 text-right text-red-400">{formatCurrency(summary.totalExpense)}</td>
                          <td
                            className={`py-3 px-4 text-right ${
                              summary.profit >= 0 ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {formatCurrency(summary.profit)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "transactions" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Все транзакции</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-3 px-4 text-left text-white/80">Дата</th>
                          <th className="py-3 px-4 text-left text-white/80">Категория</th>
                          <th className="py-3 px-4 text-left text-white/80">Описание</th>
                          <th className="py-3 px-4 text-right text-white/80">Сумма</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {demoCSVData
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((transaction, index) => (
                            <tr key={index} className="hover:bg-white/5">
                              <td className="py-3 px-4 text-white/80">{formatDate(transaction.date)}</td>
                              <td className="py-3 px-4 font-medium">{transaction.category}</td>
                              <td className="py-3 px-4 text-white/80">{transaction.description}</td>
                              <td
                                className={`py-3 px-4 text-right ${
                                  transaction.type === "income" ? "text-emerald-400" : "text-red-400"
                                }`}
                              >
                                {transaction.type === "income" ? "+" : "-"}
                                {formatCurrency(Number.parseFloat(transaction.amount))}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/login?register=true">
              <Button className="rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:opacity-90 transition-opacity border-0">
                Зарегистрироваться для полного доступа
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
