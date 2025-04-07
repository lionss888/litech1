"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Target, Wallet, Calendar } from "lucide-react"

// Типы для бюджетов и целей
type Budget = {
  id: string
  name: string
  amount: number
  spent: number
  categoryId: string | null
  category: {
    name: string
    color: string
  } | null
  period: string
  startDate: string
  endDate: string
}

type Goal = {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  description: string | null
}

export default function BudgetPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("budgets")
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Состояния для диалогов
  const [isAddBudgetDialogOpen, setIsAddBudgetDialogOpen] = useState(false)
  const [isEditBudgetDialogOpen, setIsEditBudgetDialogOpen] = useState(false)
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null)
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null)

  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false)
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false)
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null)
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null)

  // Состояния для форм
  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: "",
    categoryId: "",
    period: "month",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
  })

  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
    description: "",
  })

  // Загрузка данных
  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    if (!authLoading && !user) {
      router.push("/")
      return
    }

    if (user) {
      fetchCategories()
      fetchBudgets()
      fetchGoals()
    }
  }, [user, authLoading, router])

  // Загрузка категорий
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories?type=EXPENSE")

      if (!response.ok) {
        throw new Error("Ошибка при загрузке категорий")
      }

      const data = await response.json()
      setCategories(data)
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError("Не удалось загрузить категории")
    }
  }

  // Загрузка бюджетов
  const fetchBudgets = async () => {
    setIsLoading(true)
    try {
      // Здесь будет запрос к API для получения бюджетов
      // Пока используем моковые данные
      const mockBudgets: Budget[] = [
        {
          id: "1",
          name: "Продукты",
          amount: 15000,
          spent: 8500,
          categoryId: "1",
          category: {
            name: "Продукты",
            color: "#FF5722",
          },
          period: "month",
          startDate: "2023-04-01",
          endDate: "2023-04-30",
        },
        {
          id: "2",
          name: "Развлечения",
          amount: 10000,
          spent: 3200,
          categoryId: "2",
          category: {
            name: "Развлечения",
            color: "#FFC107",
          },
          period: "month",
          startDate: "2023-04-01",
          endDate: "2023-04-30",
        },
        {
          id: "3",
          name: "Транспорт",
          amount: 5000,
          spent: 4800,
          categoryId: "3",
          category: {
            name: "Транспорт",
            color: "#795548",
          },
          period: "month",
          startDate: "2023-04-01",
          endDate: "2023-04-30",
        },
      ]

      setBudgets(mockBudgets)
    } catch (err) {
      console.error("Error fetching budgets:", err)
      setError("Не удалось загрузить бюджеты")
    } finally {
      setIsLoading(false)
    }
  }

  // Загрузка целей
  const fetchGoals = async () => {
    setIsLoading(true)
    try {
      // Здесь будет запрос к API для получения целей
      // Пока используем моковые данные
      const mockGoals: Goal[] = [
        {
          id: "1",
          name: "Отпуск в Турции",
          targetAmount: 100000,
          currentAmount: 35000,
          deadline: "2023-07-15",
          description: "Накопить на отпуск в Турции на двоих",
        },
        {
          id: "2",
          name: "Новый ноутбук",
          targetAmount: 80000,
          currentAmount: 45000,
          deadline: "2023-06-01",
          description: "Купить новый ноутбук для работы",
        },
        {
          id: "3",
          name: "Резервный фонд",
          targetAmount: 150000,
          currentAmount: 50000,
          deadline: "2023-12-31",
          description: "Создать резервный фонд на случай непредвиденных расходов",
        },
      ]

      setGoals(mockGoals)
    } catch (err) {
      console.error("Error fetching goals:", err)
      setError("Не удалось загрузить финансовые цели")
    } finally {
      setIsLoading(false)
    }
  }

  // Обработчик изменения вкладки
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Обработчики для бюджетов
  const handleNewBudgetChange = (field: string, value: any) => {
    setNewBudget((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddBudget = async () => {
    try {
      // Здесь будет запрос к API для добавления бюджета
      // Пока просто добавляем в локальный стейт
      const newBudgetItem: Budget = {
        id: Date.now().toString(),
        name: newBudget.name,
        amount: Number.parseFloat(newBudget.amount),
        spent: 0,
        categoryId: newBudget.categoryId === "" ? null : newBudget.categoryId,
        category: newBudget.categoryId ? categories.find((c) => c.id === newBudget.categoryId) : null,
        period: newBudget.period,
        startDate: newBudget.startDate,
        endDate: newBudget.endDate,
      }

      setBudgets((prev) => [...prev, newBudgetItem])

      // Сбрасываем форму
      setNewBudget({
        name: "",
        amount: "",
        categoryId: "",
        period: "month",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
      })

      // Закрываем диалог
      setIsAddBudgetDialogOpen(false)

      // Показываем сообщение об успехе
      setSuccessMessage("Бюджет успешно добавлен")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error adding budget:", err)
      setError("Ошибка при добавлении бюджета")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleEditBudgetClick = (budget: Budget) => {
    setBudgetToEdit(budget)
    setIsEditBudgetDialogOpen(true)
  }

  const handleEditBudgetChange = (field: string, value: any) => {
    if (budgetToEdit) {
      setBudgetToEdit({
        ...budgetToEdit,
        [field]: value,
      })
    }
  }

  const handleSaveBudget = async () => {
    if (!budgetToEdit) return

    try {
      // Здесь будет запрос к API для обновления бюджета
      // Пока просто обновляем в локальном стейте
      setBudgets((prev) => prev.map((budget) => (budget.id === budgetToEdit.id ? budgetToEdit : budget)))

      // Закрываем диалог
      setIsEditBudgetDialogOpen(false)
      setBudgetToEdit(null)

      // Показываем сообщение об успехе
      setSuccessMessage("Бюджет успешно обновлен")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error updating budget:", err)
      setError("Ошибка при обновлении бюджета")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleDeleteBudgetClick = (budget: Budget) => {
    setBudgetToDelete(budget)
  }

  const confirmDeleteBudget = async () => {
    if (!budgetToDelete) return

    try {
      // Здесь будет запрос к API для удаления бюджета
      // Пока просто удаляем из локального стейта
      setBudgets((prev) => prev.filter((budget) => budget.id !== budgetToDelete.id))

      // Сбрасываем состояние
      setBudgetToDelete(null)

      // Показываем сообщение об успехе
      setSuccessMessage("Бюджет успешно удален")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error deleting budget:", err)
      setError("Ошибка при удалении бюджета")
      setTimeout(() => setError(""), 3000)
    }
  }

  // Обработчики для целей
  const handleNewGoalChange = (field: string, value: any) => {
    setNewGoal((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddGoal = async () => {
    try {
      // Здесь будет запрос к API для добавления цели
      // Пока просто добавляем в локальный стейт
      const newGoalItem: Goal = {
        id: Date.now().toString(),
        name: newGoal.name,
        targetAmount: Number.parseFloat(newGoal.targetAmount),
        currentAmount: Number.parseFloat(newGoal.currentAmount) || 0,
        deadline: newGoal.deadline,
        description: newGoal.description || null,
      }

      setGoals((prev) => [...prev, newGoalItem])

      // Сбрасываем форму
      setNewGoal({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
        description: "",
      })

      // Закрываем диалог
      setIsAddGoalDialogOpen(false)

      // Показываем сообщение об успехе
      setSuccessMessage("Цель успешно добавлена")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error adding goal:", err)
      setError("Ошибка при добавлении цели")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleEditGoalClick = (goal: Goal) => {
    setGoalToEdit(goal)
    setIsEditGoalDialogOpen(true)
  }

  const handleEditGoalChange = (field: string, value: any) => {
    if (goalToEdit) {
      setGoalToEdit({
        ...goalToEdit,
        [field]: value,
      })
    }
  }

  const handleSaveGoal = async () => {
    if (!goalToEdit) return

    try {
      // Здесь будет запрос к API для обновления цели
      // Пока просто обновляем в локальном стейте
      setGoals((prev) => prev.map((goal) => (goal.id === goalToEdit.id ? goalToEdit : goal)))

      // Закрываем диалог
      setIsEditGoalDialogOpen(false)
      setGoalToEdit(null)

      // Показываем сообщение об успехе
      setSuccessMessage("Цель успешно обновлена")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error updating goal:", err)
      setError("Ошибка при обновлении цели")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleDeleteGoalClick = (goal: Goal) => {
    setGoalToDelete(goal)
  }

  const confirmDeleteGoal = async () => {
    if (!goalToDelete) return

    try {
      // Здесь будет запрос к API для удаления цели
      // Пока просто удаляем из локального стейта
      setGoals((prev) => prev.filter((goal) => goal.id !== goalToDelete.id))

      // Сбрасываем состояние
      setGoalToDelete(null)

      // Показываем сообщение об успехе
      setSuccessMessage("Цель успешно удалена")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error deleting goal:", err)
      setError("Ошибка при удалении цели")
      setTimeout(() => setError(""), 3000)
    }
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

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU")
  }

  // Расчет процента выполнения
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100)
  }

  // Расчет оставшихся дней
  const calculateDaysLeft = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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
            <h1 className="text-2xl font-bold">Планирование бюджета</h1>
            <Button
              className="bg-[#3498db] hover:bg-[#2980b9]"
              onClick={() => (activeTab === "budgets" ? setIsAddBudgetDialogOpen(true) : setIsAddGoalDialogOpen(true))}
            >
              <Plus className="h-5 w-5 mr-2" />
              Добавить {activeTab === "budgets" ? "бюджет" : "цель"}
            </Button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{successMessage}</div>}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="budgets">Бюджеты</TabsTrigger>
              <TabsTrigger value="goals">Финансовые цели</TabsTrigger>
            </TabsList>

            <TabsContent value="budgets">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : budgets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {budgets.map((budget) => (
                    <Card key={budget.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-medium">{budget.name}</h3>
                          <p className="text-sm text-gray-500">{budget.category?.name || "Без категории"}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditBudgetClick(budget)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteBudgetClick(budget)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Потрачено: {formatAmount(budget.spent)}</span>
                          <span>Бюджет: {formatAmount(budget.amount)}</span>
                        </div>
                        <Progress value={calculateProgress(budget.spent, budget.amount)} className="h-2" />
                      </div>

                      <div className="text-sm text-gray-500 flex justify-between">
                        <div>
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                        </div>
                        <div>
                          <Wallet className="h-4 w-4 inline mr-1" />
                          Осталось: {formatAmount(budget.amount - budget.spent)}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">У вас пока нет бюджетов</div>
                  <Button className="bg-[#3498db] hover:bg-[#2980b9]" onClick={() => setIsAddBudgetDialogOpen(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Добавить бюджет
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="goals">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              ) : goals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {goals.map((goal) => (
                    <Card key={goal.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-medium">{goal.name}</h3>
                          <p className="text-sm text-gray-500">{goal.description || "Без описания"}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditGoalClick(goal)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteGoalClick(goal)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Накоплено: {formatAmount(goal.currentAmount)}</span>
                          <span>Цель: {formatAmount(goal.targetAmount)}</span>
                        </div>
                        <Progress value={calculateProgress(goal.currentAmount, goal.targetAmount)} className="h-2" />
                      </div>

                      <div className="text-sm text-gray-500 flex justify-between">
                        <div>
                          <Calendar className="h-4 w-4 inline mr-1" />
                          Срок: {formatDate(goal.deadline)}
                        </div>
                        <div>
                          <Target className="h-4 w-4 inline mr-1" />
                          Осталось: {calculateDaysLeft(goal.deadline)} дней
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">У вас пока нет финансовых целей</div>
                  <Button className="bg-[#3498db] hover:bg-[#2980b9]" onClick={() => setIsAddGoalDialogOpen(true)}>
                    <Plus className="h-5 w-5 mr-2" />
                    Добавить цель
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-[#2c3e50] text-white py-3 text-center">
        <div className="container mx-auto px-4">&copy; 2023 ФинУчет. Все права защищены.</div>
      </footer>

      {/* Диалог добавления бюджета */}
      <Dialog open={isAddBudgetDialogOpen} onOpenChange={setIsAddBudgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить бюджет</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <Input
                placeholder="Название бюджета"
                value={newBudget.name}
                onChange={(e) => handleNewBudgetChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Сумма</label>
              <Input
                type="number"
                placeholder="0"
                value={newBudget.amount}
                onChange={(e) => handleNewBudgetChange("amount", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Категория</label>
              <Select
                value={newBudget.categoryId}
                onValueChange={(value) => handleNewBudgetChange("categoryId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Без категории</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Период</label>
              <Select value={newBudget.period} onValueChange={(value) => handleNewBudgetChange("period", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите период" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                  <SelectItem value="quarter">Квартал</SelectItem>
                  <SelectItem value="year">Год</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Дата начала</label>
                <Input
                  type="date"
                  value={newBudget.startDate}
                  onChange={(e) => handleNewBudgetChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Дата окончания</label>
                <Input
                  type="date"
                  value={newBudget.endDate}
                  onChange={(e) => handleNewBudgetChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddBudgetDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-[#3498db] hover:bg-[#2980b9]" onClick={handleAddBudget}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования бюджета */}
      <Dialog open={isEditBudgetDialogOpen} onOpenChange={setIsEditBudgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать бюджет</DialogTitle>
          </DialogHeader>

          {budgetToEdit && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название</label>
                <Input
                  placeholder="Название бюджета"
                  value={budgetToEdit.name}
                  onChange={(e) => handleEditBudgetChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Сумма</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={budgetToEdit.amount}
                  onChange={(e) => handleEditBudgetChange("amount", Number.parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Категория</label>
                <Select
                  value={budgetToEdit.categoryId || ""}
                  onValueChange={(value) => handleEditBudgetChange("categoryId", value === "" ? null : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Без категории</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Период</label>
                <Select value={budgetToEdit.period} onValueChange={(value) => handleEditBudgetChange("period", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите период" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Неделя</SelectItem>
                    <SelectItem value="month">Месяц</SelectItem>
                    <SelectItem value="quarter">Квартал</SelectItem>
                    <SelectItem value="year">Год</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Дата начала</label>
                  <Input
                    type="date"
                    value={budgetToEdit.startDate.split("T")[0]}
                    onChange={(e) => handleEditBudgetChange("startDate", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Дата окончания</label>
                  <Input
                    type="date"
                    value={budgetToEdit.endDate.split("T")[0]}
                    onChange={(e) => handleEditBudgetChange("endDate", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Потрачено</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={budgetToEdit.spent}
                  onChange={(e) => handleEditBudgetChange("spent", Number.parseFloat(e.target.value))}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBudgetDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-[#3498db] hover:bg-[#2980b9]" onClick={handleSaveBudget}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления бюджета */}
      <AlertDialog open={!!budgetToDelete} onOpenChange={() => setBudgetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить бюджет "{budgetToDelete?.name}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteBudget} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Диалог добавления цели */}
      <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить финансовую цель</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <Input
                placeholder="Название цели"
                value={newGoal.name}
                onChange={(e) => handleNewGoalChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Целевая сумма</label>
              <Input
                type="number"
                placeholder="0"
                value={newGoal.targetAmount}
                onChange={(e) => handleNewGoalChange("targetAmount", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Текущая сумма</label>
              <Input
                type="number"
                placeholder="0"
                value={newGoal.currentAmount}
                onChange={(e) => handleNewGoalChange("currentAmount", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Срок достижения</label>
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => handleNewGoalChange("deadline", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Описание</label>
              <Textarea
                placeholder="Описание цели"
                value={newGoal.description}
                onChange={(e) => handleNewGoalChange("description", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddGoalDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-[#3498db] hover:bg-[#2980b9]" onClick={handleAddGoal}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования цели */}
      <Dialog open={isEditGoalDialogOpen} onOpenChange={setIsEditGoalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать финансовую цель</DialogTitle>
          </DialogHeader>

          {goalToEdit && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название</label>
                <Input
                  placeholder="Название цели"
                  value={goalToEdit.name}
                  onChange={(e) => handleEditGoalChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Целевая сумма</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={goalToEdit.targetAmount}
                  onChange={(e) => handleEditGoalChange("targetAmount", Number.parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Текущая сумма</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={goalToEdit.currentAmount}
                  onChange={(e) => handleEditGoalChange("currentAmount", Number.parseFloat(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Срок достижения</label>
                <Input
                  type="date"
                  value={goalToEdit.deadline.split("T")[0]}
                  onChange={(e) => handleEditGoalChange("deadline", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Описание</label>
                <Textarea
                  placeholder="Описание цели"
                  value={goalToEdit.description || ""}
                  onChange={(e) => handleEditGoalChange("description", e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGoalDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-[#3498db] hover:bg-[#2980b9]" onClick={handleSaveGoal}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления цели */}
      <AlertDialog open={!!goalToDelete} onOpenChange={() => setGoalToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить финансовую цель "{goalToDelete?.name}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGoal} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

