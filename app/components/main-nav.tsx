"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, BarChart, PieChart, List, Target, Users, User } from "lucide-react"

interface MainNavProps {
  className?: string
  userRole?: string
}

export function MainNav({ className, userRole }: MainNavProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Главная",
      active: pathname === "/",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      href: "/transactions",
      label: "Транзакции",
      active: pathname === "/transactions",
      icon: <List className="h-4 w-4 mr-2" />,
    },
    {
      href: "/categories",
      label: "Категории",
      active: pathname === "/categories",
      icon: <PieChart className="h-4 w-4 mr-2" />,
    },
    {
      href: "/budget",
      label: "Бюджет",
      active: pathname === "/budget",
      icon: <Target className="h-4 w-4 mr-2" />,
    },
    {
      href: "/reports",
      label: "Отчеты",
      active: pathname === "/reports",
      icon: <BarChart className="h-4 w-4 mr-2" />,
    },
    {
      href: "/profile",
      label: "Профиль",
      active: pathname === "/profile",
      icon: <User className="h-4 w-4 mr-2" />,
    },
  ]

  // Добавляем ссылку на управление пользователями только для администраторов
  if (userRole === "ADMIN") {
    routes.push({
      href: "/admin/users",
      label: "Пользователи",
      active: pathname === "/admin/users",
      icon: <Users className="h-4 w-4 mr-2" />,
    })
  }

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground",
          )}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

