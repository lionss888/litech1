"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    alert("Функция загрузки файлов находится в разработке")
  }

  const handleFileChange = () => {
    alert("Функция загрузки файлов находится в разработке")
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
              Загрузка файлов находится в разработке. Скоро вы сможете загружать свои CSV-файлы.
            </p>
          </div>

          <h1 className="text-2xl font-bold mb-6">Загрузка данных</h1>

          <Card className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl mb-6">
            <h2 className="text-xl font-medium mb-4">Загрузить CSV файл</h2>
            <p className="text-white/60 mb-6">
              Загрузите CSV файл с вашими финансовыми данными. Файл должен содержать следующие колонки: дата, тип
              (доход/расход), категория, сумма, описание.
            </p>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center ${
                isDragging ? "border-[#38BDF8] bg-[#38BDF8]/5" : "border-white/20 hover:border-white/40"
              } transition-colors cursor-pointer`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-white/40 mb-4" />
                <p className="text-lg font-medium mb-2">
                  Перетащите файл сюда или{" "}
                  <span className="text-[#38BDF8] hover:text-[#38BDF8]/80 transition-colors">выберите файл</span>
                </p>
                <p className="text-white/60 text-sm">Поддерживаются только CSV файлы</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
