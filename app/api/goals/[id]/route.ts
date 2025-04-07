import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-utils"

// Получение финансовой цели по ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const goal = await prisma.financialGoal.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!goal) {
      return NextResponse.json({ error: "Финансовая цель не найдена" }, { status: 404 })
    }

    // Проверка, принадлежит ли цель пользователю
    if (goal.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    return NextResponse.json(goal)
  } catch (error) {
    console.error("Error fetching goal:", error)
    return NextResponse.json({ error: "Ошибка при получении финансовой цели" }, { status: 500 })
  }
}

// Обновление финансовой цели
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем, существует ли цель и принадлежит ли она пользователю
    const existingGoal = await prisma.financialGoal.findUnique({
      where: { id: params.id },
    })

    if (!existingGoal) {
      return NextResponse.json({ error: "Финансовая цель не найдена" }, { status: 404 })
    }

    if (existingGoal.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    const body = await request.json()
    const { name, targetAmount, currentAmount, deadline, description } = body

    // Проверка обязательных полей
    if (!name || targetAmount === undefined) {
      return NextResponse.json({ error: "Название и целевая сумма обязательны" }, { status: 400 })
    }

    // Проверка, что целевая сумма положительная
    if (targetAmount <= 0) {
      return NextResponse.json({ error: "Целевая сумма должна быть положительной" }, { status: 400 })
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      name,
      targetAmount: Number.parseFloat(targetAmount.toString()),
    }

    if (currentAmount !== undefined) updateData.currentAmount = Number.parseFloat(currentAmount.toString())
    if (deadline) updateData.deadline = new Date(deadline)
    if (description !== undefined) updateData.description = description || null

    // Обновление финансовой цели
    const updatedGoal = await prisma.financialGoal.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error("Error updating goal:", error)
    return NextResponse.json({ error: "Ошибка при обновлении финансовой цели" }, { status: 500 })
  }
}

// Удаление финансовой цели
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем, существует ли цель и принадлежит ли она пользователю
    const goal = await prisma.financialGoal.findUnique({
      where: { id: params.id },
    })

    if (!goal) {
      return NextResponse.json({ error: "Финансовая цель не найдена" }, { status: 404 })
    }

    if (goal.userId !== session.user.id) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 })
    }

    // Удаляем финансовую цель
    await prisma.financialGoal.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting goal:", error)
    return NextResponse.json({ error: "Ошибка при удалении финансовой цели" }, { status: 500 })
  }
}

