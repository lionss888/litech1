"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { FileDown } from "lucide-react"

type ChartData = {
  name: string
  value: number
  color: string
}

type TimeSeriesData = {
  date: string
  income: number
  expense: number
}

export default function ReportsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [period, setPeriod] = useState("month")
  const [statistics, setStatistics] = useState<any>(null)

  // Загрузка статистики
  const fetchStatistics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/statistics?period=${period}`)

      if (!response.ok) {
        throw new Error("Ошибка при загрузке статистики")
      }

      const data = await response.json()
      setStatistics(data)
    } catch (err) {
      console.error("Error fetching statistics:", err)
      setError("Не удалось загрузить статистику")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    if (!authLoading && !user) {
      router.push("/")
      return
    }

    if (user) {
      fetchStatistics()
    }
  }, [user, authLoading, router, period])

  // Обработчик изменения периода
  const handlePeriodChange = (value: string) => {
    setPeriod(value)
  }

  // Обработчик изменения вкладки
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Форматирование суммы
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Подготовка данных для круговой диаграммы расходов
  const prepareExpenseChartData = (): ChartData[] => {
    if (!statistics || !statistics.categories || !statistics.categories.expense) {
      return []
    }

    return statistics.categories.expense.map((item: any) => ({
      name: item.categoryName,
      value: item.amount,
      color: item.categoryColor,
    }))
  }

  // Подготовка данных для круговой диаграммы доходов
  const prepareIncomeChartData = (): ChartData[] => {
    if (!statistics || !statistics.categories || !statistics.categories.income) {
      return []
    }

    return statistics.categories.income.map((item: any) => ({
      name: item.categoryName,
      value: item.amount,
      color: item.categoryColor,
    }))
  }

  // Подготовка данных для линейного графика
  const prepareTimeSeriesData = (): TimeSeriesData[] => {
    if (!statistics || !statistics.chart) {
      return []
    }

    return statistics.chart
  }

  // Экспорт данных в CSV
  const exportToCSV = () => {
    if (!statistics) return

    // Подготовка данных для экспорта
    const incomeData = statistics.categories.income.map((item: any) => ({
      type: "Доход",
      category: item.categoryName,
      amount: item.amount,
    }))

    const expenseData = statistics.categories.expense.map((item: any) => ({
      type: "Расход",
      category: item.categoryName,
      amount: item.amount,
    }))

    const data = [...incomeData, ...expenseData]

    // Создание CSV строки
    const headers = ["Тип", "Категория", "Сумма"]
    const csvContent = [headers.join(","), ...data.map((row) => [row.type, row.category, row.amount].join(","))].join(
      "\n",
    )

    // Создание и скачивание файла
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `финансовый_отчет_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#2c3e50] text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-xl font-bold">ФинУчет</div>
          <Button variant="ghost" className="text-white" onClick={() => router.push("/")}>
            Вернуться на главную
          </Button>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Отчеты и аналитика</h1>
            <div className="flex gap-2">
              <Select value={period} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Выберите период" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                  <SelectItem value="year">Год</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportToCSV} disabled={!statistics}>
                <FileDown className="h-5 w-5 mr-2" />
                Экспорт
              </Button>
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="income">Доходы</TabsTrigger>
              <TabsTrigger value="expense">Расходы</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : statistics ? (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-4">Баланс за период</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-gray-500">Доходы</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatAmount(statistics.balance.income)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-gray-500">Расходы</div>
                        <div className="text-2xl font-bold text-red-600">
                          {formatAmount(statistics.balance.expense)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-gray-500">Баланс</div>
                        <div
                          className={`text-2xl font-bold ${statistics.balance.total >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatAmount(statistics.balance.total)}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-4">Динамика доходов и расходов</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={prepareTimeSeriesData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatAmount(Number(value))} />
                          <Legend />
                          <Line type="monotone" dataKey="income" name="Доходы" stroke="#4CAF50" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="expense" name="Расходы" stroke="#F44336" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Нет данных для отображения</div>
              )}
            </TabsContent>

            <TabsContent value="income">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : statistics && statistics.categories.income.length > 0 ? (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-4">Структура доходов</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareIncomeChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {prepareIncomeChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatAmount(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-4">Доходы по категориям</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prepareIncomeChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatAmount(Number(value))} />
                          <Legend />
                          <Bar dataKey="value" name="Сумма" fill="#4CAF50">
                            {prepareIncomeChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-4">Детализация доходов</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Категория
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Сумма
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Доля
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {statistics.categories.income.map((item: any, index: number) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div
                                    className="w-4 h-4 rounded-full mr-2"
                                    style={{ backgroundColor: item.categoryColor }}
                                  ></div>
                                  {item.categoryName}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{formatAmount(item.amount)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {((item.amount / statistics.balance.income) * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Нет данных о доходах для отображения</div>
              )}
            </TabsContent>

            <TabsContent value="expense">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : statistics && statistics.categories.expense.length > 0 ? (
                <div className="space-y-6">
                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-4">Структура расходов</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareExpenseChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {prepareExpenseChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatAmount(Number(value))} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-4">Расходы по категориям</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={prepareExpenseChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatAmount(Number(value))} />
                          <Legend />
                          <Bar dataKey="value" name="Сумма" fill="#F44336">
                            {prepareExpenseChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h3 className="text-lg font-medium mb-4">Детализация расходов</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Категория
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Сумма
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Доля
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {statistics.categories.expense.map((item: any, index: number) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div
                                    className="w-4 h-4 rounded-full mr-2"
                                    style={{ backgroundColor: item.categoryColor }}
                                  ></div>
                                  {item.categoryName}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{formatAmount(item.amount)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {((item.amount / statistics.balance.expense) * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Нет данных о расходах для отображения</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-[#2c3e50] text-white py-3 text-center">
        <div className="container mx-auto px-4">&copy; 2023 ФинУчет. Все права защищены.</div>
      </footer>
    </div>
  )
}

