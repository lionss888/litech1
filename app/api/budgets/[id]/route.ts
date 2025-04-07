import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-utils"

// Получение бюджета по ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const budget = await prisma.budget.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: true,
      },
    })

    if (!budget) {
      return NextResponse.json({ error: "Бюджет не найден" }, { status: 404 })
    }

    // Проверка, принадлежит ли бюджет пользователю
    if (budget.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error("Error fetching budget:", error)
    return NextResponse.json({ error: "Ошибка при получении бюджета" }, { status: 500 })
  }
}

// Обновление бюджета
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем, существует ли бюджет и принадлежит ли он пользователю
    const existingBudget = await prisma.budget.findUnique({
      where: { id: params.id },
    })

    if (!existingBudget) {
      return NextResponse.json({ error: "Бюджет не найден" }, { status: 404 })
    }

    if (existingBudget.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    const body = await request.json()
    const { name, amount, categoryId, period, startDate, endDate, spent } = body

    // Проверка обязательных полей
    if (!name || amount === undefined) {
      return NextResponse.json({ error: "Название и сумма обязательны" }, { status: 400 })
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

    // Подготавливаем данные для обновления
    const updateData: any = {
      name,
      amount: Number.parseFloat(amount.toString()),
    }

    if (categoryId !== undefined) updateData.categoryId = categoryId || null
    if (period) updateData.period = period
    if (startDate) updateData.startDate = new Date(startDate)
    if (endDate) updateData.endDate = new Date(endDate)
    if (spent !== undefined) updateData.spent = Number.parseFloat(spent.toString())

    // Обновление бюджета
    const updatedBudget = await prisma.budget.update({
      where: { id: params.id },
      data: updateData,
      include: {
        category: true,
      },
    })

    return NextResponse.json(updatedBudget)
  } catch (error) {
    console.error("Error updating budget:", error)
    return NextResponse.json({ error: "Ошибка при обновлении бюджета" }, { status: 500 })
  }
}

// Удаление бюджета
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем, существует ли бюджет и принадлежит ли он пользователю
    const budget = await prisma.budget.findUnique({
      where: { id: params.id },
    })

    if (!budget) {
      return NextResponse.json({ error: "Бюджет не найден" }, { status: 404 })
    }

    if (budget.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    // Удаляем бюджет
    await prisma.budget.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting budget:", error)
    return NextResponse.json({ error: "Ошибка при удалении бюджета" }, { status: 500 })
  }
}

