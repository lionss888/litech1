// Локальное хранилище для использования, когда Edge Config недоступен
const localStore: Record<string, any> = {
  // Предустановленные пользователи для тестирования
  "user:admin@example.com": {
    name: "Администратор",
    email: "admin@example.com",
    password: "admin123",
  },
  "user:test@example.com": {
    name: "Тестовый пользователь",
    email: "test@example.com",
    password: "test123",
  },
}

// Функция для сохранения данных в локальное хранилище
export function saveToLocalStore(key: string, value: any): void {
  localStore[key] = value
  console.log(`Сохранено в локальное хранилище: ${key}`, value)
}

// Функция для получения данных из локального хранилища
export function getFromLocalStore(key: string): any {
  console.log(`Получено из локального хранилища: ${key}`, localStore[key])
  return localStore[key] || null
}

// Функция для удаления данных из локального хранилища
export function deleteFromLocalStore(key: string): void {
  console.log(`Удалено из локального хранилища: ${key}`)
  delete localStore[key]
}

// Экспортируем локальное хранилище для отладки
export { localStore }
