"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, ArrowLeft, User, Lock, Save, Check, Camera, Bell, CreditCard, Shield, Moon } from "lucide-react"
import Link from "next/link"
import { demoUser } from "@/lib/demo-data"
import { Switch } from "@/components/ui/switch"

export default function DemoProfilePage() {
  const [name, setName] = useState(demoUser.name)
  const [email, setEmail] = useState(demoUser.email)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // Имитация сохранения профиля
    setShowSaveSuccess(true)
    setTimeout(() => {
      setShowSaveSuccess(false)
    }, 3000)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("Новый пароль и подтверждение не совпадают")
      return
    }

    alert("В демо-режиме изменение пароля недоступно")
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      <header className="bg-[#1E293B]/50 backdrop-blur-md border-b border-white/10 py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Link href="/demo" className="flex items-center text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Назад к демо</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass border border-amber-500/20 text-amber-400 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-bold">Демонстрационный режим</p>
            </div>
            <p className="text-sm">
              Это демонстрация страницы профиля. В демо-режиме вы можете изменять данные, но они не будут сохранены. Для
              полного доступа к функциям приложения, пожалуйста, зарегистрируйтесь.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="/login?register=true">
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:opacity-90 transition-opacity border-0"
                >
                  Зарегистрироваться
                </Button>
              </Link>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-6">Профиль пользователя</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1">
              <Card className="glass border border-white/10 p-6 rounded-xl text-center">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8] flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold group">
                  {demoUser.name.charAt(0)}
                  <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1">{demoUser.name}</h2>
                <p className="text-white/60 mb-4">{demoUser.email}</p>
                <Button
                  variant="outline"
                  className="w-full rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Изменить фото
                </Button>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="text-sm font-medium mb-4 text-left">Настройки</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Moon className="h-4 w-4 mr-2 text-white/60" />
                        <span className="text-sm">Темная тема</span>
                      </div>
                      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-white/60" />
                        <span className="text-sm">Уведомления</span>
                      </div>
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-white/60" />
                        <span className="text-sm">Двухфакторная аутентификация</span>
                      </div>
                      <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="glass border border-white/10 p-6 rounded-xl mb-6">
                <h2 className="text-xl font-medium mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-[#38BDF8]" />
                  Личные данные
                </h2>
                {showSaveSuccess && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    <p>Изменения успешно сохранены</p>
                  </div>
                )}
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
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-white/80">
                      Язык
                    </Label>
                    <select
                      id="language"
                      className="w-full bg-white/5 border-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8] focus:ring-[#38BDF8]/10"
                    >
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white/80">
                        Телефон
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#38BDF8] focus:ring-[#38BDF8]/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-white/80">
                        Часовой пояс
                      </Label>
                      <select
                        id="timezone"
                        className="w-full bg-white/5 border-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#38BDF8] focus:ring-[#38BDF8]/10"
                      >
                        <option value="Europe/Moscow">Москва (GMT+3)</option>
                        <option value="Europe/London">Лондон (GMT+0)</option>
                        <option value="America/New_York">Нью-Йорк (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:opacity-90 transition-opacity border-0"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить изменения
                  </Button>
                </form>
              </Card>

              <Card className="glass border border-white/10 p-6 rounded-xl mb-6">
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
                    className="rounded-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8] hover:opacity-90 transition-opacity border-0"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Изменить пароль
                  </Button>
                </form>
              </Card>

              <Card className="glass border border-white/10 p-6 rounded-xl">
                <h2 className="text-xl font-medium mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-[#38BDF8]" />
                  Платежная информация
                </h2>
                <div className="p-4 rounded-lg bg-white/5 mb-4">
                  <p className="text-white/60 text-center">В демо-режиме платежная информация недоступна</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                  disabled
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Добавить способ оплаты
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
