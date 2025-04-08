import { NextResponse } from "next/server"
import { testEdgeConfigConnection, edgeConfigStatus } from "@/lib/edge-config"
import { localStore } from "@/lib/local-storage"

export async function GET() {
  try {
    const result = await testEdgeConfigConnection()

    return NextResponse.json({
      status: result.success ? "success" : "warning",
      message: result.message,
      edgeConfigInfo: process.env.EDGE_CONFIG
        ? "Используется переменная окружения EDGE_CONFIG"
        : "Используется явная конфигурация с ID и токеном",
      edgeConfigStatus: {
        isAvailable: edgeConfigStatus.isAvailable,
        error: edgeConfigStatus.error || undefined,
      },
      fallbackMode: !result.success ? "Используется локальное хранилище" : undefined,
      localUsers: !result.success
        ? Object.keys(localStore)
            .filter((key) => key.startsWith("user:"))
            .map((key) => key.replace("user:", ""))
        : undefined,
    })
  } catch (error) {
    console.error("Ошибка при тестировании Edge Config:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Ошибка при тестировании Edge Config",
        error: error instanceof Error ? error.message : String(error),
        edgeConfigStatus: {
          isAvailable: edgeConfigStatus.isAvailable,
          error: edgeConfigStatus.error || undefined,
        },
        fallbackMode: "Используется локальное хранилище",
        localUsers: Object.keys(localStore)
          .filter((key) => key.startsWith("user:"))
          .map((key) => key.replace("user:", "")),
      },
      { status: 500 },
    )
  }
}
