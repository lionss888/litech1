// Демонстрационные данные для использования в демо-режиме

// Демо-пользователь
export const demoUser = {
  name: "Демо-пользователь",
  email: "demo@example.com",
}

// Демо-данные CSV
export const demoCSVData = [
  {
    date: "2023-01-05",
    type: "income",
    category: "Зарплата",
    amount: "85000",
    description: "Ежемесячная зарплата",
  },
  {
    date: "2023-01-10",
    type: "expense",
    category: "Продукты",
    amount: "12500",
    description: "Еженедельная закупка",
  },
  {
    date: "2023-01-15",
    type: "expense",
    category: "Транспорт",
    amount: "3000",
    description: "Бензин",
  },
  {
    date: "2023-01-20",
    type: "expense",
    category: "Развлечения",
    amount: "5000",
    description: "Кино и ужин",
  },
  {
    date: "2023-01-25",
    type: "expense",
    category: "Коммунальные услуги",
    amount: "8500",
    description: "Счета за месяц",
  },
  {
    date: "2023-02-05",
    type: "income",
    category: "Зарплата",
    amount: "85000",
    description: "Ежемесячная зарплата",
  },
  {
    date: "2023-02-07",
    type: "income",
    category: "Подработка",
    amount: "15000",
    description: "Фриланс проект",
  },
  {
    date: "2023-02-10",
    type: "expense",
    category: "Продукты",
    amount: "13000",
    description: "Еженедельная закупка",
  },
  {
    date: "2023-02-15",
    type: "expense",
    category: "Транспорт",
    amount: "3200",
    description: "Бензин",
  },
  {
    date: "2023-02-18",
    type: "expense",
    category: "Здоровье",
    amount: "4500",
    description: "Лекарства",
  },
  {
    date: "2023-02-25",
    type: "expense",
    category: "Коммунальные услуги",
    amount: "8500",
    description: "Счета за месяц",
  },
  {
    date: "2023-03-05",
    type: "income",
    category: "Зарплата",
    amount: "90000",
    description: "Ежемесячная зарплата с премией",
  },
  {
    date: "2023-03-10",
    type: "expense",
    category: "Продукты",
    amount: "12800",
    description: "Еженедельная закупка",
  },
  {
    date: "2023-03-15",
    type: "expense",
    category: "Транспорт",
    amount: "3100",
    description: "Бензин",
  },
  {
    date: "2023-03-20",
    type: "expense",
    category: "Одежда",
    amount: "15000",
    description: "Новая куртка",
  },
  {
    date: "2023-03-25",
    type: "expense",
    category: "Коммунальные услуги",
    amount: "8700",
    description: "Счета за месяц",
  },
]

// Функция для расчета сводки по демо-данным
export function calculateDemoSummary() {
  // Инициализируем объекты для хранения сводки
  const categorySummary: Record<string, { income: number; expense: number }> = {}
  const monthlySummary: Record<string, { income: number; expense: number }> = {}
  let totalIncome = 0
  let totalExpense = 0

  // Обрабатываем каждую запись
  demoCSVData.forEach((item) => {
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
