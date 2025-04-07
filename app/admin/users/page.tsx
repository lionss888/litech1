"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/auth-context"

type User = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  image?: string
}

export default function UsersPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Проверяем, является ли пользователь администратором
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.push("/")
      return
    }

    // Загружаем список пользователей
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users")

        if (!response.ok) {
          throw new Error("Ошибка при загрузке пользователей")
        }

        const data = await response.json()
        setUsers(data)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Не удалось загрузить список пользователей")
      } finally {
        setIsLoading(false)
      }
    }

    if (user && user.role === "ADMIN") {
      fetchUsers()
    }
  }, [user, authLoading, router])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h1 className="text-xl font-bold mb-4 text-red-600">Ошибка</h1>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Вернуться на главную
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#2c3e50] text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-xl font-bold">ФинУчет</div>
          <Button variant="ghost" className="text-white" onClick={() => router.push("/")}>
            Вернуться на главную
          </Button>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">Управление пользователями</h1>

          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Имя
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Роль
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Дата регистрации
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.image ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.image || "/placeholder.svg"}
                                alt={user.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-[#3498db] flex items-center justify-center text-white">
                                {user.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "ADMIN" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="ghost"
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                          onClick={() => alert(`Редактирование пользователя ${user.name} будет добавлено позже`)}
                        >
                          Редактировать
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => alert(`Удаление пользователя ${user.name} будет добавлено позже`)}
                        >
                          Удалить
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      <footer className="bg-[#2c3e50] text-white py-3 text-center">
        <div className="container mx-auto px-4">&copy; 2023 ФинУчет. Все права защищены.</div>
      </footer>
    </div>
  )
}

