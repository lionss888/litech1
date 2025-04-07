"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/app/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, LinkIcon, Plus, Edit, Trash2, RefreshCw, CheckCircle, XCircle } from "lucide-react"

type ApiConnection = {
  id: string
  name: string
  provider: string
  isActive: boolean
  lastSyncAt: string | null
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [apiConnections, setApiConnections] = useState<ApiConnection[]>([])

  // Состояния для диалогов
  const [isAddConnectionDialogOpen, setIsAddConnectionDialogOpen] = useState(false)
  const [isEditConnectionDialogOpen, setIsEditConnectionDialogOpen] = useState(false)
  const [connectionToEdit, setConnectionToEdit] = useState<ApiConnection | null>(null)
  const [connectionToDelete, setConnectionToDelete] = useState<ApiConnection | null>(null)

  // Состояния для форм
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [newConnection, setNewConnection] = useState({
    name: "",
    provider: "custom",
    apiKey: "",
    apiSecret: "",
    baseUrl: "",
  })

  // Загрузка данных профиля и API-подключений
  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    if (!authLoading && !user) {
      router.push("/")
      return
    }

    if (user) {
      // Заполняем данные профиля
      setProfileData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))

      // Загружаем API-подключения
      fetchApiConnections()
    }
  }, [user, authLoading, router])

  // Загрузка API-подключений
  const fetchApiConnections = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/connections")

      if (!response.ok) {
        throw new Error("Ошибка при загрузке API-подключений")
      }

      const data = await response.json()
      setApiConnections(data)
    } catch (err) {
      console.error("Error fetching API connections:", err)
      setError("Не удалось загрузить API-подключения")
    } finally {
      setIsLoading(false)
    }
  }

  // Обработчик изменения вкладки
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Обработчики для профиля
  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileData.name,
        }),
      })

      if (!response.ok) {
        throw new Error("Ошибка при обновлении профиля")
      }

      setSuccessMessage("Профиль успешно обновлен")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Ошибка при обновлении профиля")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleChangePassword = async () => {
    // Проверка паролей
    if (profileData.newPassword !== profileData.confirmPassword) {
      setError("Пароли не совпадают")
      setTimeout(() => setError(""), 3000)
      return
    }

    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Ошибка при изменении пароля")
      }

      // Сбрасываем поля пароля
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      setSuccessMessage("Пароль успешно изменен")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      console.error("Error changing password:", err)
      setError(err.message || "Ошибка при изменении пароля")
      setTimeout(() => setError(""), 3000)
    }
  }

  // Обработчики для API-подключений
  const handleNewConnectionChange = (field: string, value: string) => {
    setNewConnection((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddConnection = async () => {
    try {
      const response = await fetch("/api/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newConnection),
      })

      if (!response.ok) {
        throw new Error("Ошибка при добавлении API-подключения")
      }

      // Обновляем список подключений
      fetchApiConnections()

      // Сбрасываем форму
      setNewConnection({
        name: "",
        provider: "custom",
        apiKey: "",
        apiSecret: "",
        baseUrl: "",
      })

      // Закрываем диалог
      setIsAddConnectionDialogOpen(false)

      setSuccessMessage("API-подключение успешно добавлено")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error adding API connection:", err)
      setError("Ошибка при добавлении API-подключения")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleEditConnectionClick = (connection: ApiConnection) => {
    setConnectionToEdit(connection)
    setIsEditConnectionDialogOpen(true)
  }

  const handleEditConnectionChange = (field: string, value: string) => {
    if (connectionToEdit) {
      setConnectionToEdit({
        ...connectionToEdit,
        [field]: value,
      } as ApiConnection)
    }
  }

  const handleSaveConnection = async () => {
    if (!connectionToEdit) return

    try {
      const response = await fetch(`/api/connections/${connectionToEdit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: connectionToEdit.name,
          isActive: connectionToEdit.isActive,
        }),
      })

      if (!response.ok) {
        throw new Error("Ошибка при обновлении API-подключения")
      }

      // Обновляем список подключений
      fetchApiConnections()

      // Закрываем диалог
      setIsEditConnectionDialogOpen(false)
      setConnectionToEdit(null)

      setSuccessMessage("API-подключение успешно обновлено")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error updating API connection:", err)
      setError("Ошибка при обновлении API-подключения")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleDeleteConnectionClick = (connection: ApiConnection) => {
    setConnectionToDelete(connection)
  }

  const confirmDeleteConnection = async () => {
    if (!connectionToDelete) return

    try {
      const response = await fetch(`/api/connections/${connectionToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Ошибка при удалении API-подключения")
      }

      // Обновляем список подключений
      fetchApiConnections()

      // Сбрасываем состояние
      setConnectionToDelete(null)

      setSuccessMessage("API-подключение успешно удалено")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error deleting API connection:", err)
      setError("Ошибка при удалении API-подключения")
      setTimeout(() => setError(""), 3000)
    }
  }

  const handleSyncConnection = async (connectionId: string) => {
    try {
      const response = await fetch(`/api/connections/${connectionId}/sync`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Ошибка при синхронизации данных")
      }

      // Обновляем список подключений
      fetchApiConnections()

      setSuccessMessage("Данные успешно синхронизированы")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("Error syncing data:", err)
      setError("Ошибка при синхронизации данных")
      setTimeout(() => setError(""), 3000)
    }
  }

  // Форматирование даты
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Никогда"

    const date = new Date(dateString)
    return date.toLocaleString("ru-RU")
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
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
          <h1 className="text-2xl font-bold mb-6">Настройки профиля</h1>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{successMessage}</div>}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="connections">API-подключения</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Личные данные
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Имя</label>
                      <Input value={profileData.name} onChange={(e) => handleProfileChange("name", e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input value={profileData.email} disabled />
                      <p className="text-xs text-gray-500 mt-1">Email нельзя изменить</p>
                    </div>

                    <Button className="bg-[#3498db] hover:bg-[#2980b9]" onClick={handleSaveProfile}>
                      Сохранить изменения
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Безопасность
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Текущий пароль</label>
                      <Input
                        type="password"
                        value={profileData.currentPassword}
                        onChange={(e) => handleProfileChange("currentPassword", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Новый пароль</label>
                      <Input
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => handleProfileChange("newPassword", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Подтверждение пароля</label>
                      <Input
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => handleProfileChange("confirmPassword", e.target.value)}
                      />
                    </div>

                    <Button
                      className="bg-[#3498db] hover:bg-[#2980b9]"
                      onClick={handleChangePassword}
                      disabled={
                        !profileData.currentPassword || !profileData.newPassword || !profileData.confirmPassword
                      }
                    >
                      Изменить пароль
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="connections">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2" />
                    API-подключения
                  </h2>
                  <Button
                    className="bg-[#3498db] hover:bg-[#2980b9]"
                    onClick={() => setIsAddConnectionDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить подключение
                  </Button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                  </div>
                ) : apiConnections.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Название
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Провайдер
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Статус
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Последняя синхронизация
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {apiConnections.map((connection) => (
                          <tr key={connection.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{connection.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {connection.provider === "sberbank" && "Сбербанк"}
                              {connection.provider === "tinkoff" && "Тинькофф"}
                              {connection.provider === "alfabank" && "Альфа-Банк"}
                              {connection.provider === "vtb" && "ВТБ"}
                              {connection.provider === "custom" && "Пользовательский API"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {connection.isActive ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Активно
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Неактивно
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(connection.lastSyncAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSyncConnection(connection.id)}
                                  title="Синхронизировать"
                                >
                                  <RefreshCw className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditConnectionClick(connection)}
                                  title="Редактировать"
                                >
                                  <Edit className="h-4 w-4 text-gray-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteConnectionClick(connection)}
                                  title="Удалить"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">У вас пока нет API-подключений</div>
                    <Button
                      className="bg-[#3498db] hover:bg-[#2980b9]"
                      onClick={() => setIsAddConnectionDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить подключение
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-[#2c3e50] text-white py-3 text-center">
        <div className="container mx-auto px-4">&copy; 2023 ФинУчет. Все права защищены.</div>
      </footer>

      {/* Диалог добавления API-подключения */}
      <Dialog open={isAddConnectionDialogOpen} onOpenChange={setIsAddConnectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить API-подключение</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Название</label>
              <Input
                placeholder="Например: Мой Сбербанк"
                value={newConnection.name}
                onChange={(e) => handleNewConnectionChange("name", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Провайдер</label>
              <Select
                value={newConnection.provider}
                onValueChange={(value) => handleNewConnectionChange("provider", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите провайдера" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sberbank">Сбербанк</SelectItem>
                  <SelectItem value="tinkoff">Тинькофф</SelectItem>
                  <SelectItem value="alfabank">Альфа-Банк</SelectItem>
                  <SelectItem value="vtb">ВТБ</SelectItem>
                  <SelectItem value="custom">Пользовательский API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newConnection.provider === "custom" && (
              <div>
                <label className="block text-sm font-medium mb-1">Базовый URL</label>
                <Input
                  placeholder="https://api.example.com"
                  value={newConnection.baseUrl}
                  onChange={(e) => handleNewConnectionChange("baseUrl", e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">API ключ</label>
              <Input
                placeholder="Ваш API ключ"
                value={newConnection.apiKey}
                onChange={(e) => handleNewConnectionChange("apiKey", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">API секрет</label>
              <Input
                type="password"
                placeholder="Ваш API секрет"
                value={newConnection.apiSecret}
                onChange={(e) => handleNewConnectionChange("apiSecret", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddConnectionDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              className="bg-[#3498db] hover:bg-[#2980b9]"
              onClick={handleAddConnection}
              disabled={!newConnection.name || !newConnection.apiKey}
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования API-подключения */}
      <Dialog open={isEditConnectionDialogOpen} onOpenChange={setIsEditConnectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать API-подключение</DialogTitle>
          </DialogHeader>

          {connectionToEdit && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Название</label>
                <Input
                  value={connectionToEdit.name}
                  onChange={(e) => handleEditConnectionChange("name", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Провайдер</label>
                <Input
                  value={
                    connectionToEdit.provider === "sberbank"
                      ? "Сбербанк"
                      : connectionToEdit.provider === "tinkoff"
                        ? "Тинькофф"
                        : connectionToEdit.provider === "alfabank"
                          ? "Альфа-Банк"
                          : connectionToEdit.provider === "vtb"
                            ? "ВТБ"
                            : "Пользовательский API"
                  }
                  disabled
                />
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Статус:</label>
                <Button
                  variant={connectionToEdit.isActive ? "default" : "outline"}
                  size="sm"
                  className={connectionToEdit.isActive ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => handleEditConnectionChange("isActive", "true")}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Активно
                </Button>
                <Button
                  variant={!connectionToEdit.isActive ? "default" : "outline"}
                  size="sm"
                  className={!connectionToEdit.isActive ? "bg-red-600 hover:bg-red-700" : ""}
                  onClick={() => handleEditConnectionChange("isActive", "false")}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Неактивно
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditConnectionDialogOpen(false)}>
              Отмена
            </Button>
            <Button className="bg-[#3498db] hover:bg-[#2980b9]" onClick={handleSaveConnection}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления API-подключения */}
      <AlertDialog open={!!connectionToDelete} onOpenChange={() => setConnectionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить API-подключение "{connectionToDelete?.name}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteConnection} className="bg-red-600 hover:bg-red-700">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

