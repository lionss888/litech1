"use server"

import { cookies } from "next/headers"
import { getSession, getCSVData, saveCSVData } from "@/lib/storage"

// Функция для получения сводки по данным CSV
export async function getSummary() {
  try {
    // Получаем идентификатор сессии из cookie
    const sessionId = cookies().get("sessionId")?.value

    if (!sessionId) {
      return { success: false, error: "Пользователь не аутентифицирован" }
    }

    // Получаем идентификатор пользователя из сессии
    const userId = await getSession(sessionId)

    if (!userId) {
      return { success: false, error: "Сессия недействительна" }
    }

    // Получаем данные CSV пользователя
    const csvData = await getCSVData(userId)

    if (!csvData || csvData.length === 0) {
      return { success: false, error: "Нет данных для анализа" }
    }

    // Рассчитываем сводку
    const summary = calculateSummary(csvData)

    return { success: true, summary }
  } catch (error) {
    console.error("Ошибка при получении сводки:", error)
    return { success: false, error: "Ошибка при получении сводки" }
  }
}

// Функция для сохранения данных CSV
export async function saveCSV(data: any[]) {
  try {
    // Получаем идентификатор сессии из cookie
    const sessionId = cookies().get("sessionId")?.value

    if (!sessionId) {
      return { success: false, error: "Пользователь не аутентифицирован" }
    }

    // Получаем идентификатор пользователя из сессии
    const userId = await getSession(sessionId)

    if (!userId) {
      return { success: false, error: "Сессия недействительна" }
    }

    // Сохраняем данные CSV
    await saveCSVData(userId, data)

    return { success: true }
  } catch (error) {
    console.error("Ошибка при сохранении данных CSV:", error)
    return { success: false, error: "Ошибка при сохранении данных CSV" }
  }
}

// Функция для расчета сводки по данным CSV
function calculateSummary(data: any[]) {
  // Инициализируем объекты для хранения сводки
  const categorySummary: Record<string, { income: number; expense: number }> = {}
  const monthlySummary: Record<string, { income: number; expense: number }> = {}
  let totalIncome = 0
  let totalExpense = 0

  // Обрабатываем каждую запись
  data.forEach((item) => {
    const amount = Number.parseFloat(item.amount)
    const category = item.category || "Без категории"
    const date = new Date(item.date)
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`

    // Инициализируем категорию, если она еще не существует
    if (!categorySummary[category]) {
      categorySummary[category] = { income: 0, expense: 0 }
    }

    // Инициализируем месяц, если он еще не существует
    if (!monthlySummary[month]) {
      monthlySummary[month] = { income: 0, expense: 0 }
    }

    // Обновляем сводку в зависимости от типа операции
    if (item.type === "income") {
      categorySummary[category].income += amount
      monthlySummary[month].income += amount
      totalIncome += amount
    } else if (item.type === "expense") {
      categorySummary[category].expense += amount
      monthlySummary[month].expense += amount
      totalExpense += amount
    }
  })

  // Рассчитываем прибыль
  const profit = totalIncome - totalExpense

  return {
    categorySummary,
    monthlySummary,
    totalIncome,
    totalExpense,
    profit,
  }
}
