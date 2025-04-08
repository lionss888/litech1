"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, ArrowLeft, User, Lock, Save } from "lucide-react"
import Link from "next/link"
import { checkAuth } from "@/app/actions/auth"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    async function checkUserAuth() {
      try {
        const { authenticated, user } = await checkAuth()

        if (!authenticated) {
          router.push("/login")
          return
        }

        setUser(user)
        setName(user?.name || "")
        setEmail(user?.email || "")
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserAuth()
  }, [router])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Функция обновления профиля находится в разработке")
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("Новый пароль и подтверждение не совпадают")
      return
    }

    alert("Функция изменения пароля находится в разработке")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-[#38BDF8] border-r-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      <header className="bg-[#1E293B]/50 backdrop-blur-sm border-b border-white/10 py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Link href="/dashboard" className="flex items-center text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Назад к дашборду</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-bold">Функция в разработке</p>
            </div>
            <p className="text-sm">
              Редактирование профиля находится в разработке. Скоро вы сможете изменять свои данные.
            </p>
          </div>

          <h1 className="text-2xl font-bold mb-6">Профиль пользователя</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1">
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8] flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "У"}
                </div>
                <h2 className="text-xl font-bold mb-1">{user?.name || "Пользователь"}</h2>
                <p className="text-white/60 mb-4">{user?.email}</p>
                <Button
                  variant="outline"
                  className="w-full rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10"
                  disabled
                >
                  Изменить фото
                </Button>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl mb-6">
                <h2 className="text-xl font-medium mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-[#38BDF8]" />
                  Личные данные
                </h2>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/80">
                      Имя
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#38BDF8] focus:ring-[#38BDF8]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/80">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#38BDF8] focus:ring-[#38BDF8]/10"
                      disabled
                    />
                    <p className="text-xs text-white/60">Email нельзя изменить</p>
                  </div>
                  <Button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:opacity-90 transition-opacity border-0"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить изменения
                  </Button>
                </form>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <h2 className="text-xl font-medium mb-4 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-[#38BDF8]" />
                  Изменить пароль
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-white/80">
                      Текущий пароль
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#38BDF8] focus:ring-[#38BDF8]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white/80">
                      Новый пароль
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#38BDF8] focus:ring-[#38BDF8]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white/80">
                      Подтвердите новый пароль
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#38BDF8] focus:ring-[#38BDF8]/10"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:opacity-90 transition-opacity border-0"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Изменить пароль
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
