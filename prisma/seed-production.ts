import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
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

  console.log("База данных успешно инициализирована")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

