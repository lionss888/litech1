// Проверка доступности localStorage
const isLocalStorageAvailable = () => {
  try {
    const testKey = "__test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

// Проверка доступности IndexedDB
const isIndexedDBAvailable = () => {
  return typeof window !== "undefined" && "indexedDB" in window
}

// Префиксы для ключей
const STORAGE_PREFIX = "finuchet:"
const USER_PREFIX = `${STORAGE_PREFIX}user:`
const SESSION_PREFIX = `${STORAGE_PREFIX}session:`
const CSV_PREFIX = `${STORAGE_PREFIX}csv:`

// Предустановленные тестовые пользователи
const TEST_USERS = {
  "admin@example.com": {
    name: "Администратор",
    email: "admin@example.com",
    password: "admin123",
  },
  "test@example.com": {
    name: "Тестовый пользователь",
    email: "test@example.com",
    password: "test123",
  },
}

// Функция для инициализации тестовых пользователей
const initTestUsers = () => {
  if (!isLocalStorageAvailable()) return

  try {
    // Проверяем, есть ли уже тестовые пользователи в хранилище
    Object.entries(TEST_USERS).forEach(([email, userData]) => {
      const key = `${USER_PREFIX}${email}`
      const existingUser = localStorage.getItem(key)

      // Если пользователя нет, добавляем его
      if (!existingUser) {
        localStorage.setItem(key, JSON.stringify(userData))
        console.log(`Инициализирован тестовый пользователь: ${email}`)
      }
    })
  } catch (e) {
    console.error("Ошибка при инициализации тестовых пользователей:", e)
  }
}

// Функция для сохранения данных в localStorage
const saveToLocalStorage = (key: string, value: any): boolean => {
  if (!isLocalStorageAvailable()) return false

  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    console.error("Ошибка при сохранении в localStorage:", e)
    return false
  }
}

// Функция для получения данных из localStorage
const getFromLocalStorage = (key: string): any => {
  if (!isLocalStorageAvailable()) return null

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (e) {
    console.error("Ошибка при получении из localStorage:", e)
    return null
  }
}

// Функция для удаления данных из localStorage
const removeFromLocalStorage = (key: string): boolean => {
  if (!isLocalStorageAvailable()) return false

  try {
    localStorage.removeItem(key)
    return true
  } catch (e) {
    console.error("Ошибка при удалении из localStorage:", e)
    return false
  }
}

// Функция для сохранения пользователя в браузерное хранилище
export const saveUserToBrowser = (email: string, userData: any): boolean => {
  const key = `${USER_PREFIX}${email}`
  return saveToLocalStorage(key, userData)
}

// Функция для получения пользователя из браузерного хранилища
export const getUserFromBrowser = (email: string): any => {
  // Сначала проверяем, есть ли пользователь в localStorage
  const key = `${USER_PREFIX}${email}`
  const user = getFromLocalStorage(key)

  // Если пользователь найден, возвращаем его
  if (user) {
    return user
  }

  // Если пользователь не найден, проверяем, есть ли он в тестовых пользователях
  if (TEST_USERS[email]) {
    // Если есть, сохраняем его в localStorage и возвращаем
    saveToLocalStorage(key, TEST_USERS[email])
    return TEST_USERS[email]
  }

  return null
}

// Функция для сохранения сессии в браузерное хранилище с очень долгим сроком действия
export const saveSessionToBrowser = (sessionId: string, userId: string): boolean => {
  const key = `${SESSION_PREFIX}${sessionId}`
  const expiresAt = Date.now() + 86400 * 1000 * 365 // 1 год
  return saveToLocalStorage(key, { userId, expiresAt })
}

// Функция для получения сессии из браузерного хранилища
export const getSessionFromBrowser = (sessionId: string): { userId: string; expiresAt: number } | null => {
  const key = `${SESSION_PREFIX}${sessionId}`
  return getFromLocalStorage(key)
}

// Функция для удаления сессии из браузерного хранилища
export const removeSessionFromBrowser = (sessionId: string): boolean => {
  const key = `${SESSION_PREFIX}${sessionId}`
  return removeFromLocalStorage(key)
}

// Функция для сохранения CSV данных в браузерное хранилище
export const saveCSVToBrowser = (userId: string, data: any[]): boolean => {
  const key = `${CSV_PREFIX}${userId}`
  return saveToLocalStorage(key, data)
}

// Функция для получения CSV данных из браузерного хранилища
export const getCSVFromBrowser = (userId: string): any[] | null => {
  const key = `${CSV_PREFIX}${userId}`
  return getFromLocalStorage(key)
}

// Функция для получения всех пользователей из браузерного хранилища
export const getAllUsersFromBrowser = (): string[] => {
  if (!isLocalStorageAvailable()) return Object.keys(TEST_USERS)

  try {
    const users: string[] = []

    // Получаем пользователей из localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(USER_PREFIX)) {
        users.push(key.replace(USER_PREFIX, ""))
      }
    }

    // Добавляем тестовых пользователей, если их нет в списке
    Object.keys(TEST_USERS).forEach((email) => {
      if (!users.includes(email)) {
        users.push(email)
      }
    })

    return users
  } catch (e) {
    console.error("Ошибка при получении всех пользователей из localStorage:", e)
    return Object.keys(TEST_USERS)
  }
}

// Функция для проверки доступности браузерного хранилища
export const isBrowserStorageAvailable = (): boolean => {
  return isLocalStorageAvailable() || isIndexedDBAvailable()
}

// Функция для очистки всех данных из браузерного хранилища
export const clearBrowserStorage = (): boolean => {
  if (!isLocalStorageAvailable()) return false

  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    }

    // Повторно инициализируем тестовых пользователей
    initTestUsers()

    return true
  } catch (e) {
    console.error("Ошибка при очистке браузерного хранилища:", e)
    return false
  }
}

// Функция для сохранения сессии в localStorage
export const saveSessionToLocalStorage = (userId: string): boolean => {
  if (!isLocalStorageAvailable()) return false

  try {
    localStorage.setItem(`${STORAGE_PREFIX}session`, userId)
    return true
  } catch (e) {
    console.error("Ошибка при сохранении сессии в localStorage:", e)
    return false
  }
}

// Функция для получения сессии из localStorage
export const getSessionFromLocalStorage = (): string | null => {
  if (!isLocalStorageAvailable()) return null

  try {
    return localStorage.getItem(`${STORAGE_PREFIX}session`)
  } catch (e) {
    console.error("Ошибка при получении сессии из localStorage:", e)
    return null
  }
}

// Функция для удаления сессии из localStorage
export const removeSessionFromLocalStorage = (): boolean => {
  if (!isLocalStorageAvailable()) return false

  try {
    localStorage.removeItem(`${STORAGE_PREFIX}session`)
    return true
  } catch (e) {
    console.error("Ошибка при удалении сессии из localStorage:", e)
    return false
  }
}

// Экспортируем информацию о состоянии браузерного хранилища
export const browserStorageStatus = {
  get isAvailable() {
    return isBrowserStorageAvailable()
  },
  get storageType() {
    if (isLocalStorageAvailable()) return "localStorage"
    if (isIndexedDBAvailable()) return "indexedDB"
    return "unavailable"
  },
}

// Инициализируем тестовых пользователей при загрузке модуля
if (typeof window !== "undefined") {
  initTestUsers()
}
