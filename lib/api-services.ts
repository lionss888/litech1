import { prisma } from "@/lib/prisma"

// Типы для параметров синхронизации
type SyncParams = {
  provider: string
  apiKey: string
  apiSecret: string | null
  baseUrl: string | null
  userId: string
  connectionId: string
  lastSyncDate: Date
}

// Типы для транзакций из внешних API
type ExternalTransaction = {
  id: string
  amount: number
  description?: string
  date: string
  type: "INCOME" | "EXPENSE"
  category?: string
}

// Функция для синхронизации транзакций
export async function syncTransactions(params: SyncParams): Promise<{ count: number }> {
  const { provider, apiKey, apiSecret, baseUrl, userId, connectionId, lastSyncDate } = params

  // Получаем транзакции из внешнего API в зависимости от провайдера
  let transactions: ExternalTransaction[] = []

  switch (provider) {
    case "sberbank":
      transactions = await getSberbankTransactions(apiKey, apiSecret, lastSyncDate)
      break
    case "tinkoff":
      transactions = await getTinkoffTransactions(apiKey, apiSecret, lastSyncDate)
      break
    case "alfabank":
      transactions = await getAlfabankTransactions(apiKey, apiSecret, lastSyncDate)
      break
    case "vtb":
      transactions = await getVTBTransactions(apiKey, apiSecret, lastSyncDate)
      break
    case "custom":
      if (!baseUrl) {
        throw new Error("Для пользовательского API необходим базовый URL")
      }
      transactions = await getCustomApiTransactions(baseUrl, apiKey, apiSecret, lastSyncDate)
      break
    default:
      throw new Error(`Неподдерживаемый провайдер API: ${provider}`)
  }

  // Сохраняем полученные транзакции в базу данных
  let count = 0

  for (const transaction of transactions) {
    // Проверяем, существует ли уже такая транзакция
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        externalId: transaction.id,
        apiConnectionId: connectionId,
      },
    })

    if (!existingTransaction) {
      // Ищем или создаем категорию, если она указана
      let categoryId = null

      if (transaction.category) {
        const category = await prisma.category.findFirst({
          where: {
            name: transaction.category,
            userId,
            type: transaction.type,
          },
        })

        if (category) {
          categoryId = category.id
        }
      }

      // Создаем новую транзакцию
      await prisma.transaction.create({
        data: {
          amount: Math.abs(transaction.amount),
          description: transaction.description || null,
          date: new Date(transaction.date),
          type: transaction.type,
          categoryId,
          userId,
          externalId: transaction.id,
          apiConnectionId: connectionId,
        },
      })

      count++
    }
  }

  return { count }
}

// Функции для работы с API различных банков
// В реальном приложении здесь будет реальная логика взаимодействия с API

async function getSberbankTransactions(
  apiKey: string,
  apiSecret: string | null,
  lastSyncDate: Date,
): Promise<ExternalTransaction[]> {
  // Здесь будет реальная логика получения транзакций из API Сбербанка
  // Пока возвращаем тестовые данные
  return [
    {
      id: "sb1",
      amount: 5000,
      description: "Зарплата",
      date: new Date().toISOString(),
      type: "INCOME",
      category: "Зарплата",
    },
    {
      id: "sb2",
      amount: 1500,
      description: "Продукты в Пятерочке",
      date: new Date().toISOString(),
      type: "EXPENSE",
      category: "Продукты",
    },
  ]
}

async function getTinkoffTransactions(
  apiKey: string,
  apiSecret: string | null,
  lastSyncDate: Date,
): Promise<ExternalTransaction[]> {
  // Здесь будет реальная логика получения транзакций из API Тинькофф
  // Пока возвращаем тестовые данные
  return [
    {
      id: "tk1",
      amount: 3000,
      description: "Перевод от друга",
      date: new Date().toISOString(),
      type: "INCOME",
    },
    {
      id: "tk2",
      amount: 2500,
      description: 'Кафе "Вкусно и точка"',
      date: new Date().toISOString(),
      type: "EXPENSE",
      category: "Рестораны",
    },
  ]
}

async function getAlfabankTransactions(
  apiKey: string,
  apiSecret: string | null,
  lastSyncDate: Date,
): Promise<ExternalTransaction[]> {
  // Здесь будет реальная логика получения транзакций из API Альфа-Банка
  // Пока возвращаем тестовые данные
  return [
    {
      id: "ab1",
      amount: 10000,
      description: "Бонус",
      date: new Date().toISOString(),
      type: "INCOME",
      category: "Бонусы",
    },
    {
      id: "ab2",
      amount: 3500,
      description: "Аренда квартиры",
      date: new Date().toISOString(),
      type: "EXPENSE",
      category: "Жилье",
    },
  ]
}

async function getVTBTransactions(
  apiKey: string,
  apiSecret: string | null,
  lastSyncDate: Date,
): Promise<ExternalTransaction[]> {
  // Здесь будет реальная логика получения транзакций из API ВТБ
  // Пока возвращаем тестовые данные
  return [
    {
      id: "vtb1",
      amount: 7000,
      description: "Возврат налога",
      date: new Date().toISOString(),
      type: "INCOME",
      category: "Налоги",
    },
    {
      id: "vtb2",
      amount: 1200,
      description: "Такси",
      date: new Date().toISOString(),
      type: "EXPENSE",
      category: "Транспорт",
    },
  ]
}

async function getCustomApiTransactions(
  baseUrl: string,
  apiKey: string,
  apiSecret: string | null,
  lastSyncDate: Date,
): Promise<ExternalTransaction[]> {
  try {
    // Формируем URL для запроса транзакций
    const url = new URL("/api/transactions", baseUrl)
    url.searchParams.append("from", lastSyncDate.toISOString())
    url.searchParams.append("to", new Date().toISOString())

    // Выполняем запрос к API
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Преобразуем данные в формат ExternalTransaction
    return data.transactions.map((item: any) => ({
      id: item.id.toString(),
      amount: Number.parseFloat(item.amount),
      description: item.description || null,
      date: item.date,
      type: Number.parseFloat(item.amount) >= 0 ? "INCOME" : "EXPENSE",
      category: item.category || null,
    }))
  } catch (error) {
    console.error("Error fetching transactions from custom API:", error)
    throw new Error(
      `Ошибка при получении данных из пользовательского API: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`,
    )
  }
}

