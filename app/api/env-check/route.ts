import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Получаем все переменные окружения
    const envVars = {
      EDGE_CONFIG: process.env.EDGE_CONFIG ? "Установлен" : "Не установлен (используется значение по умолчанию)",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "Не установлен",
    }

    // Проверяем наличие необходимых переменных окружения
    const missingEnvVars = []
    if (!process.env.NEXT_PUBLIC_APP_URL) missingEnvVars.push("NEXT_PUBLIC_APP_URL")

    return NextResponse.json({
      status: missingEnvVars.length > 0 ? "warning" : "success",
      message:
        missingEnvVars.length > 0
          ? `Отсутствуют переменные окружения: ${missingEnvVars.join(", ")}`
          : "Все необходимые переменные окружения установлены",
      envVars,
      missingEnvVars,
    })
  } catch (error) {
    console.error("Ошибка при проверке переменных окружения:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Ошибка при проверке переменных окружения",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
