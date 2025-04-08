// Флаг для отслеживания доступности Edge Config
let isEdgeConfigAvailable = false
let edgeConfigError: string | null = null

// Функция для безопасного получения данных из Edge Config
export async function getEdgeConfigValue<T>(key: string, defaultValue: T): Promise<T> {
  try {
    if (!isEdgeConfigAvailable) {
      console.log(`Edge Config недоступен, возвращаем значение по умолчанию для ${key}`)
      return defaultValue
    }

    // Динамически импортируем Edge Config только на сервере
    // Это предотвращает ошибки при сборке и выполнении на клиенте
    const { createClient } = await import("@vercel/edge-config")

    // Создаем клиент для каждого запроса
    const edgeConfigClient = process.env.EDGE_CONFIG
      ? createClient(process.env.EDGE_CONFIG)
      : createClient(
          "https://edge-config.vercel.com/ecfg_bvw2iqsegm1lyqtfgspv850ddlzl?token=0edb3e60-bbe1-4f84-ae20-f969bdd64345",
        )

    // Проверяем, что клиент имеет метод get
    if (typeof edgeConfigClient.get !== "function") {
      console.warn("Edge Config клиент не имеет метода get")
      return defaultValue
    }

    const value = await edgeConfigClient.get<T>(key)
    return value !== undefined ? value : defaultValue
  } catch (error) {
    console.error(`Ошибка при получении значения из Edge Config (${key}):`, error)
    edgeConfigError = error instanceof Error ? error.message : String(error)
    isEdgeConfigAvailable = false
    return defaultValue
  }
}

// Функция для безопасного сохранения данных в Edge Config
export async function setEdgeConfigValue<T>(key: string, value: T): Promise<boolean> {
  try {
    if (!isEdgeConfigAvailable) {
      console.log(`Edge Config недоступен, не удалось сохранить ${key}`)
      return false
    }

    // Динамически импортируем Edge Config только на сервере
    const { createClient } = await import("@vercel/edge-config")

    // Создаем клиент для каждого запроса
    const edgeConfigClient = process.env.EDGE_CONFIG
      ? createClient(process.env.EDGE_CONFIG)
      : createClient(
          "https://edge-config.vercel.com/ecfg_bvw2iqsegm1lyqtfgspv850ddlzl?token=0edb3e60-bbe1-4f84-ae20-f969bdd64345",
        )

    // Проверяем, что клиент имеет метод set
    if (typeof edgeConfigClient.set !== "function") {
      console.warn("Edge Config клиент не имеет метода set")
      return false
    }

    await edgeConfigClient.set(key, value)
    return true
  } catch (error) {
    console.error(`Ошибка при сохранении значения в Edge Config (${key}):`, error)
    edgeConfigError = error instanceof Error ? error.message : String(error)
    isEdgeConfigAvailable = false
    return false
  }
}

// Функция для безопасного удаления данных из Edge Config
export async function deleteEdgeConfigValue(key: string): Promise<boolean> {
  try {
    if (!isEdgeConfigAvailable) {
      console.log(`Edge Config недоступен, не удалось удалить ${key}`)
      return false
    }

    // Динамически импортируем Edge Config только на сервере
    const { createClient } = await import("@vercel/edge-config")

    // Создаем клиент для каждого запроса
    const edgeConfigClient = process.env.EDGE_CONFIG
      ? createClient(process.env.EDGE_CONFIG)
      : createClient(
          "https://edge-config.vercel.com/ecfg_bvw2iqsegm1lyqtfgspv850ddlzl?token=0edb3e60-bbe1-4f84-ae20-f969bdd64345",
        )

    // Проверяем, что клиент имеет метод delete
    if (typeof edgeConfigClient.delete !== "function") {
      console.warn("Edge Config клиент не имеет метода delete")
      return false
    }

    await edgeConfigClient.delete(key)
    return true
  } catch (error) {
    console.error(`Ошибка при удалении значения из Edge Config (${key}):`, error)
    edgeConfigError = error instanceof Error ? error.message : String(error)
    isEdgeConfigAvailable = false
    return false
  }
}

// Функция для проверки подключения к Edge Config
export async function testEdgeConfigConnection(): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    // Динамически импортируем Edge Config только на сервере
    const { createClient } = await import("@vercel/edge-config")

    // Создаем клиент для проверки
    const edgeConfigClient = process.env.EDGE_CONFIG
      ? createClient(process.env.EDGE_CONFIG)
      : createClient(
          "https://edge-config.vercel.com/ecfg_bvw2iqsegm1lyqtfgspv850ddlzl?token=0edb3e60-bbe1-4f84-ae20-f969bdd64345",
        )

    // Проверяем наличие необходимых методов
    const hasGetMethod = typeof edgeConfigClient.get === "function"
    const hasSetMethod = typeof edgeConfigClient.set === "function"
    const hasDeleteMethod = typeof edgeConfigClient.delete === "function"

    if (!hasGetMethod || !hasSetMethod || !hasDeleteMethod) {
      isEdgeConfigAvailable = false
      return {
        success: false,
        message: "Edge Config клиент не имеет необходимых методов",
        error: `get: ${hasGetMethod}, set: ${hasSetMethod}, delete: ${hasDeleteMethod}`,
      }
    }

    // Пробуем выполнить простую операцию
    const testKey = "test:connection"
    const testValue = "Connection test at " + new Date().toISOString()

    await edgeConfigClient.set(testKey, testValue)
    const retrievedValue = await edgeConfigClient.get(testKey)

    if (retrievedValue === testValue) {
      isEdgeConfigAvailable = true
      return { success: true, message: "Подключение к Edge Config успешно" }
    } else {
      isEdgeConfigAvailable = false
      return {
        success: false,
        message: `Ошибка проверки: записанное и прочитанное значения не совпадают. Ожидалось: ${testValue}, Получено: ${retrievedValue}`,
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    edgeConfigError = errorMessage
    isEdgeConfigAvailable = false
    console.log("Edge Config недоступен, будет использоваться локальное хранилище")
    return {
      success: false,
      message: `Ошибка при подключении к Edge Config: ${errorMessage}`,
      error: errorMessage,
    }
  }
}

// Инициализируем статус Edge Config как недоступный по умолчанию
// Это заставит систему использовать локальное хранилище до успешной проверки
isEdgeConfigAvailable = false

// Экспортируем информацию о состоянии Edge Config
export const edgeConfigStatus = {
  get isAvailable() {
    return isEdgeConfigAvailable
  },
  get error() {
    return edgeConfigError
  },
}
