"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
    id: string
    name: string
    subcategories?: Category[]
}

const categories: Category[] = [
    {
        id: "1",
        name: "Бүтээгдэхүүний төрөл",
        subcategories: [
            { id: "1-1", name: "Бол бүтээгдэхүүн" },
            { id: "1-2", name: "Шинжилгээний төхөөрөмж, Аналитик систем" },
            { id: "1-3", name: "Орчны хяналт, усны чанар" },
            { id: "1-4", name: "Орчны хяналт, цаг агаарын чанар" },
            { id: "1-5", name: "Аналитик систем" },
            { id: "1-6", name: "Молекул хүчилтөрөгч" },
        ],
    },
    {
        id: "2",
        name: "Эрэмбэ хүчний хэмжээ, хэмжилт төхөөрөмж",
        subcategories: [
            { id: "2-1", name: "Электрон жин" },
            { id: "2-2", name: "Механик жин" },
        ],
    },
    {
        id: "3",
        name: "Хүчил хүчилтөрөгч",
    },
    {
        id: "4",
        name: "Туршилт",
    },
    {
        id: "5",
        name: "Эрэмбэ хүчний төхөөрөмж, хэмжилт төхөөрөмж",
    },
    {
        id: "6",
        name: "Бүтээгдэхүүн, усны хэмжээ",
    },
    {
        id: "7",
        name: "Мөнгөний хэмжээ, хэмжилт төхөөрөмж",
    },
    {
        id: "8",
        name: "Молекул хүчилтөрөгч, хэмжилт төхөөрөмж",
    },
]

export function CategorySidebar() {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId)
        } else {
            newExpanded.add(categoryId)
        }
        setExpandedCategories(newExpanded)
    }

    return (
        <div className="p-2 lg:p-4">
            <h2 className="mb-3 lg:mb-4 text-sm font-semibold text-foreground hidden lg:block">Бүтээгдэхүүний төрөл</h2>
            <nav className="space-y-2">
                {categories.map((category) => (
                    <div key={category.id}>
                        <button
                            onClick={() => toggleCategory(category.id)}
                            className={cn(
                                "flex w-full items-center justify-between rounded-md px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm transition-colors",
                                expandedCategories.has(category.id) ? "bg-accent text-accent-foreground" : "text-foreground",
                                "hover:bg-[rgba(15,78,147,1)] hover:text-white"
                            )}
                        >
                            <span className="text-left flex-1">{category.name}</span>
                            {category.subcategories && (
                                <span className="flex-shrink-0 ml-2">
                                    {expandedCategories.has(category.id) ? (
                                        <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
                                    ) : (
                                        <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                                    )}
                                </span>
                            )}
                        </button>

                        {category.subcategories && expandedCategories.has(category.id) && (
                            <div className="ml-3 lg:ml-4 mt-1 space-y-1 border-l border-border pl-1 lg:pl-2">
                                {category.subcategories.map((subcategory) => (
                                    <button
                                        key={subcategory.id}
                                        className="flex w-full items-center justify-between rounded-md px-2 lg:px-3 py-1 lg:py-1.5 text-left text-xs lg:text-sm text-foreground transition-colors hover:bg-[rgba(15,78,147,1)] hover:text-white"
                                    >
                                        <span className="text-left flex-1">{subcategory.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    )
}