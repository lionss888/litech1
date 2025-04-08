"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, PieChart, Shield, Clock, ChevronRight } from "lucide-react"
import { useEffect, useState, useRef } from "react"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  // Эффект для отслеживания скролла и движения мыши
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Функция для расчета смещения элемента в зависимости от положения мыши
  const calculateMouseOffset = (factor = 0.02) => {
    if (typeof window === "undefined") return { x: 0, y: 0 }

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    const offsetX = (mousePosition.x - centerX) * factor
    const offsetY = (mousePosition.y - centerY) * factor

    return { x: offsetX, y: offsetY }
  }

  const mouseOffset = calculateMouseOffset()

  return (
    <div className="min-h-screen apple-bg flex flex-col">
      {/* Навигация в стиле Apple */}
      <header className="glass-effect sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold gradient-text">ФинУчет</div>
          <nav className="flex space-x-4 items-center">
            <Link
              href="/demo"
              className="px-4 py-2 rounded-full text-[#1d1d1f] hover:bg-black/5 transition-colors text-sm"
            >
              Демо
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-[#1d1d1f] hover:bg-black/5 transition-colors text-sm"
            >
              Войти
            </Link>
            <Link href="/login?register=true" className="apple-button text-sm py-2 px-4">
              Регистрация
            </Link>
          </nav>
        </div>
      </header>

      {/* Главный баннер */}
      <section className="py-20 md:py-32 relative overflow-hidden" ref={heroRef}>
        {/* Абстрактные элементы фона */}
        <div
          className="abstract-blob bg-blue-400/30 w-80 h-80 top-0 right-0 floating"
          style={{ transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px)` }}
        ></div>
        <div
          className="abstract-blob bg-purple-400/30 w-72 h-72 bottom-0 left-0 floating-delay"
          style={{ transform: `translate(${-mouseOffset.x * 0.3}px, ${-mouseOffset.y * 0.3}px)` }}
        ></div>
        <div className="abstract-circle w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-slow"></div>
        <div className="abstract-circle w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-reverse"></div>
        <div className="abstract-dots w-full h-full opacity-50"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 apple-heading leading-tight tracking-tight">
              Управляйте финансами
              <br />
              <span className="gradient-text">просто и эффективно</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-[#86868b] max-w-2xl mx-auto">
              ФинУчет — современный инструмент для отслеживания доходов и расходов, который поможет вам достичь
              финансовой свободы
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login?register=true"
                className="apple-button text-base py-3 px-6 flex items-center justify-center glow"
              >
                Начать бесплатно
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/demo" className="apple-button-secondary text-base py-3 px-6">
                Попробовать демо
              </Link>
            </div>
          </div>

          {/* Демонстрационное изображение */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="apple-card p-1 md:p-2 shadow-xl gradient-border">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                {/* Абстрактное изображение дашборда */}
                <img
                  src="/placeholder.svg?height=900&width=1600"
                  alt="Интерфейс ФинУчет"
                  className="w-full h-full object-cover"
                />

                {/* Наложение градиента для эффекта */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-purple-500/5"></div>

                {/* Плавающие элементы на изображении */}
                <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl floating"></div>
                <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-purple-500/10 rounded-full blur-xl floating-delay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-20 bg-[#f5f5f7] relative overflow-hidden">
        {/* Абстрактные элементы фона */}
        <div className="abstract-line w-full top-0 opacity-70"></div>
        <div className="abstract-line w-full bottom-0 opacity-70"></div>
        <div className="abstract-dots w-full h-full opacity-30"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4 apple-heading">Почему ФинУчет?</h2>
            <p className="text-[#86868b] max-w-2xl mx-auto">
              Мы создали приложение, которое сочетает в себе мощную аналитику и современный дизайн
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="apple-card p-8 flex flex-col items-center text-center apple-card-hover gradient-border">
              <div className="w-16 h-16 rounded-full bg-[#0071e3]/10 flex items-center justify-center mb-6 glow">
                <BarChart3 className="h-8 w-8 text-[#0071e3]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 apple-heading">Простой анализ</h3>
              <p className="text-[#86868b]">
                Интерактивные графики и диаграммы помогут вам визуализировать ваши финансовые потоки
              </p>
            </div>

            <div className="apple-card p-8 flex flex-col items-center text-center apple-card-hover gradient-border">
              <div className="w-16 h-16 rounded-full bg-[#0071e3]/10 flex items-center justify-center mb-6 glow">
                <PieChart className="h-8 w-8 text-[#0071e3]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 apple-heading">Умная категоризация</h3>
              <p className="text-[#86868b]">
                Автоматическое распределение расходов по категориям с возможностью персонализации
              </p>
            </div>

            <div className="apple-card p-8 flex flex-col items-center text-center apple-card-hover gradient-border">
              <div className="w-16 h-16 rounded-full bg-[#0071e3]/10 flex items-center justify-center mb-6 glow">
                <Shield className="h-8 w-8 text-[#0071e3]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 apple-heading">Безопасность данных</h3>
              <p className="text-[#86868b]">Ваши финансовые данные надежно защищены и доступны только вам</p>
            </div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="py-20 relative overflow-hidden">
        {/* Абстрактные элементы фона */}
        <div className="abstract-circle w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-slow opacity-30"></div>
        <div
          className="abstract-blob bg-blue-400/5 w-56 h-56 top-1/4 right-1/4 floating-slow"
          style={{ transform: `translate(${mouseOffset.x * 0.2}px, ${mouseOffset.y * 0.2}px)` }}
        ></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4 apple-heading">Как это работает</h2>
            <p className="text-[#86868b] max-w-2xl mx-auto">Всего три простых шага для начала работы с ФинУчет</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#0071e3] text-white flex items-center justify-center mb-6 text-xl font-semibold glow">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 apple-heading">Регистрация</h3>
              <p className="text-[#86868b]">Создайте бесплатный аккаунт за несколько секунд</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#0071e3] text-white flex items-center justify-center mb-6 text-xl font-semibold glow">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 apple-heading">Загрузка данных</h3>
              <p className="text-[#86868b]">Загрузите CSV-файл с вашими финансовыми данными</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#0071e3] text-white flex items-center justify-center mb-6 text-xl font-semibold glow">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 apple-heading">Анализ</h3>
              <p className="text-[#86868b]">Получите подробную аналитику и визуализацию ваших финансов</p>
            </div>
          </div>
        </div>
      </section>

      {/* Функциональность */}
      <section className="py-20 bg-[#f5f5f7] relative overflow-hidden">
        {/* Абстрактные элементы фона */}
        <div className="abstract-dots w-full h-full opacity-30"></div>
        <div
          className="abstract-blob bg-purple-400/5 w-64 h-64 bottom-1/4 left-1/4 floating"
          style={{ transform: `translate(${-mouseOffset.x * 0.2}px, ${-mouseOffset.y * 0.2}px)` }}
        ></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-6 apple-heading">Основные функции</h2>
              <p className="text-[#86868b] mb-8">Всё, что нужно для эффективного управления личными финансами</p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center shrink-0 mt-1 glow">
                    <BarChart3 className="h-5 w-5 text-[#0071e3]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 apple-heading">Финансовая аналитика</h3>
                    <p className="text-[#86868b]">Подробные отчеты и графики для анализа ваших доходов и расходов</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center shrink-0 mt-1 glow">
                    <PieChart className="h-5 w-5 text-[#0071e3]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 apple-heading">Категоризация расходов</h3>
                    <p className="text-[#86868b]">
                      Автоматическое распределение расходов по категориям для лучшего понимания
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0071e3]/10 flex items-center justify-center shrink-0 mt-1 glow">
                    <Clock className="h-5 w-5 text-[#0071e3]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 apple-heading">Экономия времени</h3>
                    <p className="text-[#86868b]">
                      Загрузите CSV-файл и получите готовую аналитику за считанные секунды
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/demo"
                  className="text-[#0071e3] hover:text-[#42a6f5] transition-colors flex items-center text-sm font-medium"
                >
                  Узнать больше о функциях
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="apple-card p-1 md:p-2 shadow-xl gradient-border">
              <div className="relative aspect-square rounded-xl overflow-hidden">
                {/* Абстрактное изображение функций */}
                <img
                  src="/placeholder.svg?height=800&width=800"
                  alt="Функции ФинУчет"
                  className="w-full h-full object-cover"
                />

                {/* Наложение градиента для эффекта */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>

                {/* Плавающие элементы на изображении */}
                <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-blue-500/10 rounded-full blur-xl floating"></div>
                <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl floating-delay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="py-20 relative overflow-hidden">
        {/* Абстрактные элементы фона */}
        <div className="abstract-circle w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-slow opacity-30"></div>
        <div
          className="abstract-blob bg-blue-400/10 w-80 h-80 top-1/3 right-1/3 floating-slow"
          style={{ transform: `translate(${mouseOffset.x * 0.1}px, ${mouseOffset.y * 0.1}px)` }}
        ></div>
        <div
          className="abstract-blob bg-purple-400/10 w-80 h-80 bottom-1/3 left-1/3 floating-delay"
          style={{ transform: `translate(${-mouseOffset.x * 0.1}px, ${-mouseOffset.y * 0.1}px)` }}
        ></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="apple-card p-12 text-center gradient-border glass-effect">
            <h2 className="text-3xl font-semibold mb-6 apple-heading">Готовы начать контролировать свои финансы?</h2>
            <p className="text-lg text-[#86868b] mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам пользователей, которые уже оптимизировали свои финансы с помощью ФинУчет
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login?register=true"
                className="apple-button text-base py-3 px-6 flex items-center justify-center glow"
              >
                Начать бесплатно
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/demo" className="apple-button-secondary text-base py-3 px-6">
                Попробовать демо
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Подвал */}
      <footer className="py-12 bg-[#f5f5f7] relative">
        <div className="abstract-line w-full top-0 opacity-70"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-semibold gradient-text mb-6 md:mb-0">ФинУчет</div>
            <div className="text-[#86868b] text-sm">&copy; {new Date().getFullYear()} ФинУчет. Все права защищены.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
