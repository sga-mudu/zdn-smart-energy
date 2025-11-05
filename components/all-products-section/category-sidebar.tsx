"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Category {
    id: string
    name: string
    description: string | null
    parentId: string | null
    parent: {
        id: string
        name: string
    } | null
    children: Category[]
}

export function CategorySidebar() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/categories")
            if (response.ok) {
                const data = await response.json()
                // Filter to only show parent categories (categories without a parent)
                const parentCategories = data.filter((cat: Category) => !cat.parentId)
                setCategories(parentCategories)
            } else {
                console.error("Failed to fetch categories")
            }
        } catch (error) {
            console.error("Error fetching categories:", error)
        } finally {
            setLoading(false)
        }
    }

    const toggleCategory = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId)
        } else {
            newExpanded.add(categoryId)
        }
        setExpandedCategories(newExpanded)
    }

    if (loading) {
        return (
            <div className="p-2 lg:p-4">
                <h2 className="mb-3 lg:mb-4 text-sm font-semibold text-foreground hidden lg:block">Бүтээгдэхүүний төрөл</h2>
                <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground">Ачаалж байна...</p>
                </div>
            </div>
        )
    }

    if (categories.length === 0) {
        return (
            <div className="p-2 lg:p-4">
                <h2 className="mb-3 lg:mb-4 text-sm font-semibold text-foreground hidden lg:block">Бүтээгдэхүүний төрөл</h2>
                <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground">Категори байхгүй байна</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-2 lg:p-4">
            <h2 className="mb-3 lg:mb-4 text-sm font-semibold text-foreground hidden lg:block">Бүтээгдэхүүний төрөл</h2>
            <nav className="space-y-2">
                {categories.map((category) => {
                    const hasChildren = category.children && category.children.length > 0
                    return (
                        <div key={category.id}>
                            <Link
                                href={`/all-products?category=${category.id}`}
                                onClick={(e) => {
                                    if (hasChildren) {
                                        e.preventDefault()
                                        toggleCategory(category.id)
                                    }
                                }}
                                className={cn(
                                    "flex w-full items-center justify-between rounded-md px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm transition-colors",
                                    expandedCategories.has(category.id) ? "bg-accent text-accent-foreground" : "text-foreground",
                                    "hover:bg-[rgba(15,78,147,1)] hover:text-white"
                                )}
                            >
                                <span className="text-left flex-1">{category.name}</span>
                                {hasChildren && (
                                    <span className="flex-shrink-0 ml-2">
                                        {expandedCategories.has(category.id) ? (
                                            <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
                                        ) : (
                                            <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
                                        )}
                                    </span>
                                )}
                            </Link>

                            {hasChildren && expandedCategories.has(category.id) && (
                                <div className="ml-3 lg:ml-4 mt-1 space-y-1 border-l border-border pl-1 lg:pl-2">
                                    {category.children.map((subcategory) => (
                                        <Link
                                            key={subcategory.id}
                                            href={`/all-products?category=${subcategory.id}`}
                                            className="flex w-full items-center justify-between rounded-md px-2 lg:px-3 py-1 lg:py-1.5 text-left text-xs lg:text-sm text-foreground transition-colors hover:bg-[rgba(15,78,147,1)] hover:text-white"
                                        >
                                            <span className="text-left flex-1">{subcategory.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                })}
            </nav>
        </div>
    )
}