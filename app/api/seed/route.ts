import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function GET() {
  try {
    // Проверяем, что мы в режиме разработки или есть специальный флаг
    if (process.env.NODE_ENV !== "development" && process.env.ALLOW_SEED !== "true") {
      return NextResponse.json(
        { error: "Seed API доступен только в режиме разработки или с флагом ALLOW_SEED" },
        { status: 403 },
      )
    }

    // Создаем администратора по умолчанию, если его еще нет
    const adminExists = await prisma.user.findUnique({
      where: { email: "admin@finuchet.ru" },
    })

    if (!adminExists) {
      const adminPassword = await hash("admin123", 12)

      await prisma.user.create({
        data: {
          email: "admin@finuchet.ru",
          name: "Администратор",
          password: adminPassword,
          role: "ADMIN",
        },
      })

      console.log("Создан администратор по умолчанию")
    }

    // Создаем тестового пользователя
    const testUserExists = await prisma.user.findUnique({
      where: { email: "user@finuchet.ru" },
    })

    if (!testUserExists) {
      const userPassword = await hash("user123", 12)

      await prisma.user.create({
        data: {
          email: "user@finuchet.ru",
          name: "Тестовый пользователь",
          password: userPassword,
          role: "USER",
        },
      })

      console.log("Создан тестовый пользователь")
    }

    // Создаем категории для тестового пользователя
    const testUser = await prisma.user.findUnique({
      where: { email: "user@finuchet.ru" },
    })

    if (testUser) {
      // Категории доходов
      const incomeCategories = [
        { name: "Зарплата", color: "#4CAF50", icon: "wallet" },
        { name: "Фриланс", color: "#2196F3", icon: "laptop" },
        { name: "Инвестиции", color: "#9C27B0", icon: "trending-up" },
        { name: "Подарки", color: "#E91E63", icon: "gift" },
      ]

      // Категории расходов
      const expenseCategories = [
        { name: "Продукты", color: "#FF5722", icon: "shopping-cart" },
        { name: "Транспорт", color: "#795548", icon: "car" },
        { name: "Развлечения", color: "#FFC107", icon: "film" },
        { name: "Рестораны", color: "#FF9800", icon: "coffee" },
        { name: "Коммунальные платежи", color: "#607D8B", icon: "home" },
        { name: "Здоровье", color: "#F44336", icon: "activity" },
      ]

      // Добавляем категории доходов
      for (const category of incomeCategories) {
        const exists = await prisma.category.findFirst({
          where: {
            name: category.name,
            userId: testUser.id,
            type: "INCOME",
          },
        })

        if (!exists) {
          await prisma.category.create({
            data: {
              name: category.name,
              color: category.color,
              icon: category.icon,
              type: "INCOME",
              userId: testUser.id,
            },
          })
        }
      }

      // Добавляем категории расходов
      for (const category of expenseCategories) {
        const exists = await prisma.category.findFirst({
          where: {
            name: category.name,
            userId: testUser.id,
            type: "EXPENSE",
          },
        })

        if (!exists) {
          await prisma.category.create({
            data: {
              name: category.name,
              color: category.color,
              icon: category.icon,
              type: "EXPENSE",
              userId: testUser.id,
            },
          })
        }
      }
    }

    return NextResponse.json({ success: true, message: "База данных успешно инициализирована" })
  } catch (error) {
    console.error("Ошибка при инициализации базы данных:", error)
    return NextResponse.json({ error: "Ошибка при инициализации базы данных" }, { status: 500 })
  }
}

