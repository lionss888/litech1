import { getEdgeConfigValue, setEdgeConfigValue, deleteEdgeConfigValue, edgeConfigStatus } from "./edge-config"
import { saveToLocalStore, getFromLocalStore, deleteFromLocalStore } from "./local-storage"
import {
  saveUserToBrowser,
  getUserFromBrowser,
  saveSessionToBrowser,
  getSessionFromBrowser,
  removeSessionFromBrowser,
  saveCSVToBrowser,
  getCSVFromBrowser,
  browserStorageStatus,
} from "./browser-storage"

// Тип для хранения данных пользователя
export type UserData = {
  name?: string
  email: string
  password: string
}

// Тип для хранения данных CSV
export type CSVData = {
  userId: string
  data: any[]
}

// Префиксы ключей для хранилища
const USER_PREFIX = "user:"
const SESSION_PREFIX = "session:"
const CSV_PREFIX = "csv:"

// Функция для сохранения данных пользователя
export async function saveUser(userData: UserData): Promise<boolean> {
  const userKey = `${USER_PREFIX}${userData.email}`
  let savedSuccessfully = false

  // Если Edge Config доступен, пробуем сохранить там
  if (edgeConfigStatus.isAvailable) {
    const edgeConfigResult = await setEdgeConfigValue(userKey, userData)
    if (edgeConfigResult) {
      savedSuccessfully = true
    }
  }

  // Всегда сохраняем в локальное хранилище для резервного копирования
  saveToLocalStore(userKey, userData)
  savedSuccessfully = true

  // Если код выполняется в браузере, сохраняем также в браузерное хранилище
  if (typeof window !== "undefined" && browserStorageStatus.isAvailable) {
    saveUserToBrowser(userData.email, userData)
  }

  return savedSuccessfully
}

// Функция для получения данных пользователя
export async function getUser(email: string): Promise<UserData | null> {
  const userKey = `${USER_PREFIX}${email}`

  console.log(`Получение пользователя: ${email}, ключ: ${userKey}`)

  // Если Edge Config доступен, пробуем получить оттуда
  if (edgeConfigStatus.isAvailable) {
    const userData = await getEdgeConfigValue<UserData | null>(userKey, null)
    if (userData !== null) {
      return userData
    }
  }

  // Если Edge Config недоступен или данные не найдены, проверяем локальное хранилище
  const localUser = getFromLocalStore(userKey)
  if (localUser) {
    console.log(`Пользователь найден в локальном хранилище: ${email}`)
    return localUser
  }

  // Если код выполняется в браузере, проверяем браузерное хранилище
  if (typeof window !== "undefined" && browserStorageStatus.isAvailable) {
    const browserUser = getUserFromBrowser(email)
    if (browserUser) {
      console.log(`Пользователь найден в браузерном хранилище: ${email}`)
      // Сохраняем пользователя в локальное хранилище для будущих запросов
      saveToLocalStore(userKey, browserUser)
      return browserUser
    }
  }

  return null
}

// Функция для сохранения сессии
export async function saveSession(sessionId: string, userId: string): Promise<boolean> {
  const sessionKey = `${SESSION_PREFIX}${sessionId}`
  // Увеличиваем срок жизни сессии с 1 дня до 7 дней
  const expiresAt = Date.now() + 86400 * 1000 * 7 // 7 дней
  let savedSuccessfully = false

  // Если Edge Config доступен, пробуем сохранить там
  if (edgeConfigStatus.isAvailable) {
    const edgeConfigResult = await setEdgeConfigValue(sessionKey, { userId, expiresAt })
    if (edgeConfigResult) {
      savedSuccessfully = true
    }
  }

  // Всегда сохраняем в локальное хранилище для резервного копирования
  saveToLocalStore(sessionKey, { userId, expiresAt })
  savedSuccessfully = true

  // Если код выполняется в браузере, сохраняем также в браузерное хранилище
  if (typeof window !== "undefined" && browserStorageStatus.isAvailable) {
    saveSessionToBrowser(sessionId, userId)
  }

  return savedSuccessfully
}

// Изменяем функцию getSession, чтобы она не проверяла срок действия сессии
export async function getSession(sessionId: string): Promise<string | null> {
  const sessionKey = `${SESSION_PREFIX}${sessionId}`

  // Пробуем получить сессию из разных хранилищ
  let session = null

  // Если Edge Config доступен, пробуем получить оттуда
  if (edgeConfigStatus.isAvailable) {
    session = await getEdgeConfigValue<{ userId: string; expiresAt: number } | null>(sessionKey, null)
  }

  // Если сессия не найдена в Edge Config, проверяем локальное хранилище
  if (session === null) {
    session = getFromLocalStore(sessionKey)
  }

  // Если сессия не найдена в локальном хранилище и код выполняется в браузере, проверяем браузерное хранилище
  if (session === null && typeof window !== "undefined" && browserStorageStatus.isAvailable) {
    session = getSessionFromBrowser(sessionId)
    // Если сессия найдена в браузерном хранилище, сохраняем её в локальное хранилище
    if (session) {
      saveToLocalStore(sessionKey, session)
    }
  }

  // Если сессия найдена, возвращаем userId независимо от срока действия
  if (session) {
    return session.userId
  }

  return null
}

// Функция для удаления сессии
export async function deleteSession(sessionId: string): Promise<boolean> {
  const sessionKey = `${SESSION_PREFIX}${sessionId}`

  // Если Edge Config доступен, пробуем удалить оттуда
  if (edgeConfigStatus.isAvailable) {
    await deleteEdgeConfigValue(sessionKey)
  }

  // Удаляем из локального хранилища
  deleteFromLocalStore(sessionKey)

  // Если код выполняется в браузере, удаляем также из браузерного хранилища
  if (typeof window !== "undefined" && browserStorageStatus.isAvailable) {
    removeSessionFromBrowser(sessionId)
  }

  return true
}

// Функция для сохранения данных CSV
export async function saveCSVData(userId: string, data: any[]): Promise<boolean> {
  const csvKey = `${CSV_PREFIX}${userId}`
  let savedSuccessfully = false

  // Если Edge Config доступен, пробуем сохранить там
  if (edgeConfigStatus.isAvailable) {
    const edgeConfigResult = await setEdgeConfigValue(csvKey, data)
    if (edgeConfigResult) {
      savedSuccessfully = true
    }
  }

  // Всегда сохраняем в локальное хранилище для резервного копирования
  saveToLocalStore(csvKey, data)
  savedSuccessfully = true

  // Если код выполняется в браузере, сохраняем также в браузерное хранилище
  if (typeof window !== "undefined" && browserStorageStatus.isAvailable) {
    saveCSVToBrowser(userId, data)
  }

  return savedSuccessfully
}

// Функция для получения данных CSV
export async function getCSVData(userId: string): Promise<any[] | null> {
  const csvKey = `${CSV_PREFIX}${userId}`

  // Если Edge Config доступен, пробуем получить оттуда
  if (edgeConfigStatus.isAvailable) {
    const csvData = await getEdgeConfigValue<any[] | null>(csvKey, null)
    if (csvData !== null) {
      return csvData
    }
  }

  // Если Edge Config недоступен или данные не найдены, проверяем локальное хранилище
  const localData = getFromLocalStore(csvKey)
  if (localData) {
    return localData
  }

  // Если код выполняется в браузере, проверяем браузерное хранилище
  if (typeof window !== "undefined" && browserStorageStatus.isAvailable) {
    const browserData = getCSVFromBrowser(userId)
    if (browserData) {
      // Сохраняем данные в локальное хранилище для будущих запросов
      saveToLocalStore(csvKey, browserData)
      return browserData
    }
  }

  return null
}

// Экспортируем информацию о состоянии хранилища
export const storageStatus = {
  get edgeConfig() {
    return edgeConfigStatus
  },
  get browserStorage() {
    return browserStorageStatus
  },
  get currentMode() {
    if (edgeConfigStatus.isAvailable) return "edge-config"
    if (typeof window !== "undefined" && browserStorageStatus.isAvailable) return "browser"
    return "local"
  },
}
