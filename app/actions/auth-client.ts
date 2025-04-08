"use client"

import { saveUserToBrowser, saveSessionToBrowser, removeSessionFromBrowser } from "@/lib/browser-storage"

// Функция для сохранения сессии в localStorage
const saveSessionToLocalStorage = (email: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userEmail", email)
  }
}

// Функция для удаления сессии из localStorage
const removeSessionFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userEmail")
  }
}

// Функция для входа пользователя
export async function loginUser(email: string, password: string) {
  try {
    // Сначала сохраняем данные в браузерное хранилище для обеспечения доступности
    if (typeof window !== "undefined") {
      saveUserToBrowser(email, {
        name: email.split("@")[0], // Временное имя на основе email
        email: email,
        password: password,
      })
    }

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    // Если вход успешен и мы находимся в браузере, сохраняем данные в браузерное хранилище
    if (data.success && typeof window !== "undefined") {
      // Сохраняем пользователя в браузерное хранилище с обновленными данными
      saveUserToBrowser(email, {
        name: data.user.name || email.split("@")[0],
        email: data.user.email,
        password: password, // Сохраняем пароль для возможности входа в офлайн-режиме
      })

      // Получаем sessionId из cookie
      const cookies = document.cookie.split(";")
      const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith("sessionId="))
      if (sessionCookie) {
        const sessionId = sessionCookie.split("=")[1]
        // Сохраняем сессию в браузерное хранилище с очень долгим сроком действия
        saveSessionToBrowser(sessionId, email)

        // Также сохраняем сессию в localStorage для дополнительной надежности
        saveSessionToLocalStorage(email)
      }
    }

    // Добавляем статус ответа для лучшей диагностики
    return {
      ...data,
      statusCode: response.status,
      statusText: response.statusText,
    }
  } catch (error) {
    console.error("Ошибка при входе:", error)
    return { success: false, error: "Ошибка при входе в систему", details: String(error) }
  }
}

// Функция для регистрации пользователя
export async function registerUser(name: string, email: string, password: string) {
  try {
    // Сначала сохраняем пользователя в браузерное хранилище для обеспечения доступности
    if (typeof window !== "undefined") {
      saveUserToBrowser(email, {
        name: name || email.split("@")[0],
        email: email,
        password: password,
      })
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    // Если регистрация успешна и мы находимся в браузере, сохраняем сессию
    if (data.success && typeof window !== "undefined") {
      // Получаем sessionId из cookie
      const cookies = document.cookie.split(";")
      const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith("sessionId="))
      if (sessionCookie) {
        const sessionId = sessionCookie.split("=")[1]
        // Сохраняем сессию в браузерное хранилище
        saveSessionToBrowser(sessionId, email)
      }
    }

    // Если статус 409, добавляем более понятное сообщение
    if (response.status === 409) {
      return {
        success: false,
        error: "Пользователь с таким email уже существует. Пожалуйста, используйте другой email или войдите в систему.",
        statusCode: 409,
      }
    }

    // Добавляем статус ответа для лучшей диагностики
    return {
      ...data,
      statusCode: response.status,
      statusText: response.statusText,
    }
  } catch (error) {
    console.error("Ошибка при регистрации:", error)
    return { success: false, error: "Ошибка при регистрации", details: String(error) }
  }
}

// Функция для выхода пользователя
export async function logoutUser() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    })

    const data = await response.json()

    // Если выход успешен и мы находимся в браузере, удаляем сессию из браузерного хранилища
    if (data.success && typeof window !== "undefined") {
      // Получаем sessionId из cookie
      const cookies = document.cookie.split(";")
      const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith("sessionId="))
      if (sessionCookie) {
        const sessionId = sessionCookie.split("=")[1]
        // Удаляем сессию из браузерного хранилища
        removeSessionFromBrowser(sessionId)
        // Удаляем cookie
        document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

        // Также удаляем сессию из localStorage
        removeSessionFromLocalStorage()
      }
    }

    return data
  } catch (error) {
    console.error("Ошибка при выходе:", error)
    return { success: false, error: "Ошибка при выходе из системы", details: String(error) }
  }
}
