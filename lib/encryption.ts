import crypto from "crypto"

// Секретный ключ для шифрования (в реальном приложении должен храниться в переменных окружения)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-secret-encryption-key-min-32-chars"
const IV_LENGTH = 16 // Для AES, длина IV должна быть 16 байт

// Функция для шифрования данных
export function encryptData(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return `${iv.toString("hex")}:${encrypted}`
}

// Функция для расшифровки данных
export function decryptData(text: string): string {
  const [ivHex, encryptedHex] = text.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encryptedHex, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

