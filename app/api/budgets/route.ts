import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-utils"

// Получение всех бюджетов пользователя
export async function GET(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period")
    const categoryId = searchParams.get("categoryId")

    const whereClause: any = {
      userId: session.user.id,
    }

    if (period) {
      whereClause.period = period
    }

    if (categoryId) {
      whereClause.categoryId = categoryId
    }

    const budgets = await prisma.budget.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return NextResponse.json({ error: "Ошибка при получении бюджетов" }, { status: 500 })
  }
}

// Создание нового бюджета
export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { name, amount, categoryId, period, startDate, endDate } = body

    // Проверка обязательных полей
    if (!name || !amount || !period || !startDate || !endDate) {
      return NextResponse.json({ error: "Не все обязательные поля заполнены" }, { status: 400 })
    }

    // Проверка, что сумма положительная
    if (amount <= 0) {
      return NextResponse.json({ error: "Сумма должна быть положительной" }, { status: 400 })
    }

    // Если указана категория, проверяем, что она существует и принадлежит пользователю
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      })

      if (!category) {
        return NextResponse.json({ error: "Категория не найдена" }, { status: 404 })
      }

      if (category.userId !== session.user.id) {
        return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
      }
    }

    // Создание нового бюджета
    const budget = await prisma.budget.create({
      data: {
        name,
        amount: Number.parseFloat(amount.toString()),
        spent: 0,
        categoryId: categoryId || null,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: session.user.id,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(budget)
  } catch (error) {
    console.error("Error creating budget:", error)
    return NextResponse.json({ error: "Ошибка при создании бюджета" }, { status: 500 })
  }
}

