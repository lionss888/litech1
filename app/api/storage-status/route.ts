import { NextResponse } from "next/server"
import { storageStatus } from "@/lib/storage"
import { getAllUsersFromBrowser } from "@/lib/browser-storage"
import { localStore } from "@/lib/local-storage"

export async function GET() {
  try {
    // Получаем информацию о статусе хранилища
    const status = {
      currentMode: storageStatus.currentMode,
      edgeConfig: {
        isAvailable: storageStatus.edgeConfig.isAvailable,
        error: storageStatus.edgeConfig.error || undefined,
      },
      browserStorage: {
        isAvailable: typeof window !== "undefined" && storageStatus.browserStorage.isAvailable,
        storageType: typeof window !== "undefined" ? storageStatus.browserStorage.storageType : "server-side",
      },
      localUsers: [],
      browserUsers: [],
    }

    // Получаем список пользователей из локального хранилища
    status.localUsers = Object.keys(localStore)
      .filter((key) => key.startsWith("user:"))
      .map((key) => key.replace("user:", ""))

    // Если код выполняется в браузере, получаем список пользователей из браузерного хранилища
    if (typeof window !== "undefined" && storageStatus.browserStorage.isAvailable) {
      status.browserUsers = getAllUsersFromBrowser()
    }

    return NextResponse.json({
      status: "success",
      data: status,
    })
  } catch (error) {
    console.error("Ошибка при получении статуса хранилища:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Ошибка при получении статуса хранилища",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
