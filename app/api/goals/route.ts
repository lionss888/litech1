import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/auth-utils"

// Получение всех финансовых целей пользователя
export async function GET(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const goals = await prisma.financialGoal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error("Error fetching goals:", error)
    return NextResponse.json({ error: "Ошибка при получении финансовых целей" }, { status: 500 })
  }
}

// Создание новой финансовой цели
export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { name, targetAmount, currentAmount, deadline, description } = body

    // Проверка обязательных полей
    if (!name || !targetAmount || !deadline) {
      return NextResponse.json({ error: "Не все обязательные поля заполнены" }, { status: 400 })
    }

    // Проверка, что целевая сумма положительная
    if (targetAmount <= 0) {
      return NextResponse.json({ error: "Целевая сумма должна быть положительной" }, { status: 400 })
    }

    // Создание новой финансовой цели
    const goal = await prisma.financialGoal.create({
      data: {
        name,
        targetAmount: Number.parseFloat(targetAmount.toString()),
        currentAmount: currentAmount ? Number.parseFloat(currentAmount.toString()) : 0,
        deadline: new Date(deadline),
        description: description || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(goal)
  } catch (error) {
    console.error("Error creating goal:", error)
    return NextResponse.json({ error: "Ошибка при создании финансовой цели" }, { status: 500 })
  }
}

