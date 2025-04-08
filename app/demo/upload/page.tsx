"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, Upload, FileText, Check, X, Info } from "lucide-react"
import Link from "next/link"

export default function DemoUploadPage() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [fileName, setFileName] = useState("")
  const [fileSize, setFileSize] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showValidation, setShowValidation] = useState(false)
  const [validationResults, setValidationResults] = useState<{ valid: boolean; errors: string[] }>({
    valid: true,
    errors: [],
  })

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

    // Имитация загрузки файла
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      simulateFileUpload(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      simulateFileUpload(file)
    }
  }

  const simulateFileUpload = (file: File) => {
    // Сохраняем информацию о файле
    setFileName(file.name)
    setFileSize(formatFileSize(file.size))

    // Имитируем процесс загрузки
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploaded(true)
          // Имитируем валидацию файла
          setTimeout(() => {
            setShowValidation(true)
            if (file.name.endsWith(".csv")) {
              setValidationResults({
                valid: true,
                errors: [],
              })
            } else {
              setValidationResults({
                valid: false,
                errors: ["Файл должен иметь расширение .csv"],
              })
            }
          }, 500)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const resetUpload = () => {
    setIsUploaded(false)
    setFileName("")
    setFileSize("")
    setUploadProgress(0)
    setShowValidation(false)
  }

  const proceedToAnalysis = () => {
    router.push("/demo/summary")
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
        <div className="max-w-3xl mx-auto">
          <div className="glass border border-amber-500/20 text-amber-400 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-bold">Демонстрационный режим</p>
            </div>
            <p className="text-sm">
              Это демонстрация процесса загрузки файлов. В демо-режиме вы можете загрузить файл, но данные не будут
              обработаны. Для полного доступа к функциям приложения, пожалуйста, зарегистрируйтесь.
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

          <h1 className="text-2xl font-bold mb-6">Загрузка данных</h1>

          <Card className="glass border border-white/10 p-6 rounded-xl mb-6">
            <h2 className="text-xl font-medium mb-4">Загрузить CSV файл</h2>
            <p className="text-white/60 mb-6">
              Загрузите CSV файл с вашими финансовыми данными. Файл должен содержать следующие колонки: дата, тип
              (доход/расход), категория, сумма, описание.
            </p>

            {!isUploaded ? (
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
            ) : (
              <div className="border rounded-xl p-6 bg-white/5">
                <div className="flex items-center mb-4">
                  <FileText className="h-10 w-10 text-[#38BDF8] mr-4" />
                  <div className="flex-1">
                    <p className="font-medium">{fileName}</p>
                    <p className="text-sm text-white/60">{fileSize}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={resetUpload}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mb-4">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-white/60 mt-1 text-right">{uploadProgress}%</p>
                </div>

                {showValidation && (
                  <div
                    className={`p-4 rounded-lg ${validationResults.valid ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"} mt-4`}
                  >
                    <div className="flex items-center">
                      {validationResults.valid ? (
                        <Check className="h-5 w-5 text-emerald-400 mr-2" />
                      ) : (
                        <X className="h-5 w-5 text-red-400 mr-2" />
                      )}
                      <p className={validationResults.valid ? "text-emerald-400" : "text-red-400"}>
                        {validationResults.valid ? "Файл успешно проверен" : "Ошибка проверки файла"}
                      </p>
                    </div>

                    {!validationResults.valid && validationResults.errors.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-red-400 mt-2">
                        {validationResults.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    )}

                    {validationResults.valid && (
                      <div className="mt-4">
                        <Button
                          className="rounded-full bg-gradient-to-r from-[#38BDF8] to-[#818CF8]"
                          onClick={proceedToAnalysis}
                        >
                          Перейти к анализу данных
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card className="glass border border-white/10 p-6 rounded-xl">
            <h2 className="text-xl font-medium mb-4">Формат CSV файла</h2>
            <p className="text-white/60 mb-4">
              Для корректной работы с приложением, ваш CSV файл должен содержать следующие колонки:
            </p>

            <div className="bg-white/5 rounded-lg p-4 mb-6 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-2 px-4 text-left text-white/80">Колонка</th>
                    <th className="py-2 px-4 text-left text-white/80">Описание</th>
                    <th className="py-2 px-4 text-left text-white/80">Пример</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="py-2 px-4 text-white/60">date</td>
                    <td className="py-2 px-4 text-white/60">Дата операции</td>
                    <td className="py-2 px-4 text-white/60">2023-01-15</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-white/60">type</td>
                    <td className="py-2 px-4 text-white/60">Тип операции</td>
                    <td className="py-2 px-4 text-white/60">income / expense</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-white/60">category</td>
                    <td className="py-2 px-4 text-white/60">Категория</td>
                    <td className="py-2 px-4 text-white/60">Зарплата / Продукты</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-white/60">amount</td>
                    <td className="py-2 px-4 text-white/60">Сумма</td>
                    <td className="py-2 px-4 text-white/60">15000</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-white/60">description</td>
                    <td className="py-2 px-4 text-white/60">Описание</td>
                    <td className="py-2 px-4 text-white/60">Ежемесячная зарплата</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[#38BDF8]/10 rounded-lg border border-[#38BDF8]/20">
              <Info className="h-5 w-5 text-[#38BDF8]" />
              <div>
                <p className="text-sm font-medium text-white">Пример CSV файла</p>
                <p className="text-xs text-white/60">
                  Вы можете скачать пример CSV файла, чтобы увидеть правильный формат данных
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto rounded-full bg-[#38BDF8]/10 border-[#38BDF8]/20 text-[#38BDF8] hover:bg-[#38BDF8]/20"
                onClick={() => proceedToAnalysis()}
              >
                Перейти к демо-данным
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
