"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { 
  Package, 
  Newspaper, 
  FolderTree, 
  Store, 
  LogOut,
  Plus,
  FileText,
  Edit,
  Trash2
} from "lucide-react"

interface Category {
  id: string
  name: string
  description: string | null
  image: string | null
  parentId: string | null
  parent: {
    id: string
    name: string
  } | null
  createdAt: string
}

interface Product {
  id: string
  code: string
  name: string
  description: string | null
  image: string | null
  brandLogo: string | null
  brandName: string | null
  categoryId: string
  category: Category
  featured: boolean
  createdAt: string
}

interface Brand {
  id: string
  name: string
  logo: string | null
  description: string | null
  website: string | null
  featured: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"products" | "news" | "categories" | "brands">("products")
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" })
  }

  useEffect(() => {
    if (activeTab === "categories") {
      fetchCategories()
    } else if (activeTab === "products") {
      fetchProducts()
    } else if (activeTab === "brands") {
      fetchBrands()
    }
  }, [activeTab])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    
    try {
      console.log("Deleting category:", id)
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      console.log("Delete response:", response.status, data)
      
      if (response.ok) {
        fetchCategories()
      } else {
        alert(data.error || "Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      alert("An error occurred while deleting the category")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    try {
      console.log("Deleting product:", id)
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      console.log("Delete response:", response.status, data)
      
      if (response.ok) {
        fetchProducts()
      } else {
        alert(data.error || "Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("An error occurred while deleting the product")
    }
  }

  const fetchBrands = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/brands")
      if (response.ok) {
        const data = await response.json()
        setBrands(data)
      }
    } catch (error) {
      console.error("Error fetching brands:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBrand = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return
    
    try {
      console.log("Deleting brand:", id)
      const response = await fetch(`/api/admin/brands/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      console.log("Delete response:", response.status, data)
      
      if (response.ok) {
        fetchBrands()
      } else {
        alert(data.error || "Failed to delete brand")
      }
    } catch (error) {
      console.error("Error deleting brand:", error)
      alert("An error occurred while deleting the brand")
    }
  }

  const tabs = [
    { id: "products" as const, label: "Products", icon: Package },
    { id: "news" as const, label: "News & Info", icon: Newspaper },
    { id: "categories" as const, label: "Categories", icon: FolderTree },
    { id: "brands" as const, label: "Brands", icon: Store },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activeTab === "products" && "Product Management"}
                {activeTab === "news" && "News & Information"}
                {activeTab === "categories" && "Category Management"}
                {activeTab === "brands" && "Brand Management"}
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your {activeTab} from here
              </p>
            </div>
            <Button onClick={() => router.push(`/admin/${activeTab}/new`)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </div>

          {/* Content based on active tab */}
          {activeTab === "categories" && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <FolderTree className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Categories</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first category</p>
                  <Button onClick={() => router.push("/admin/categories/new")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Category
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Separate parent and child categories
                        const parentCategories = categories.filter(cat => !cat.parentId)
                        const childCategories = categories.filter(cat => cat.parentId)
                        
                        // Create a map of parent ID to children
                        const childrenMap = new Map<string, Category[]>()
                        childCategories.forEach(child => {
                          if (child.parentId) {
                            if (!childrenMap.has(child.parentId)) {
                              childrenMap.set(child.parentId, [])
                            }
                            childrenMap.get(child.parentId)!.push(child)
                          }
                        })
                        
                        // Build ordered list: parent, then its children, then next parent, etc.
                        const orderedCategories: (Category & { isChild?: boolean })[] = []
                        parentCategories.forEach(parent => {
                          orderedCategories.push(parent)
                          const children = childrenMap.get(parent.id) || []
                          children.forEach(child => {
                            orderedCategories.push({ ...child, isChild: true })
                          })
                        })
                        
                        // Add any orphaned children (parent was deleted)
                        childCategories.forEach(child => {
                          if (!orderedCategories.find(cat => cat.id === child.id)) {
                            orderedCategories.push({ ...child, isChild: true })
                          }
                        })
                        
                        return orderedCategories.map((category) => (
                          <tr 
                            key={category.id} 
                            className={`border-b border-gray-100 hover:bg-gray-50 ${
                              category.isChild ? 'bg-gray-50/50' : 'bg-white'
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {category.isChild && (
                                  <>
                                    <span className="text-gray-400 w-6 flex-shrink-0">└─</span>
                                    <div className="w-px h-6 bg-gray-300 -ml-2 mr-2"></div>
                                  </>
                                )}
                                <span className={`font-medium ${
                                  category.isChild 
                                    ? 'text-gray-700 text-sm' 
                                    : 'text-gray-900 text-base'
                                }`}>
                                  {category.name}
                                </span>
                                {category.isChild && category.parent && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    (under {category.parent.name})
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-sm">
                              {category.description || "—"}
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-sm">
                              {new Date(category.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/admin/categories/${category.id}/edit`)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleDeleteCategory(category.id)
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Products</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first product</p>
                  <Button onClick={() => router.push("/admin/products/new")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Product
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Image</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Code</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Brand</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Featured</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={50}
                                height={50}
                                className="rounded object-cover"
                              />
                            ) : (
                              <div className="w-[50px] h-[50px] bg-gray-200 rounded flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900">{product.code}</td>
                          <td className="py-3 px-4 text-gray-900">{product.name}</td>
                          <td className="py-3 px-4 text-gray-600 text-sm">{product.category.name}</td>
                          <td className="py-3 px-4 text-gray-600 text-sm">{product.brandName || "—"}</td>
                          <td className="py-3 px-4">
                            {product.featured ? (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                Featured
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDeleteProduct(product.id)
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "brands" && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading brands...</p>
                </div>
              ) : brands.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Store className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Brands</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first brand</p>
                  <Button onClick={() => router.push("/admin/brands/new")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Brand
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Logo</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Website</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Featured</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brands.map((brand) => (
                        <tr key={brand.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            {brand.logo ? (
                              <Image
                                src={brand.logo}
                                alt={brand.name}
                                width={50}
                                height={50}
                                className="rounded object-cover"
                              />
                            ) : (
                              <div className="w-[50px] h-[50px] bg-gray-200 rounded flex items-center justify-center">
                                <Store className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900">{brand.name}</td>
                          <td className="py-3 px-4 text-gray-600 text-sm">
                            {brand.description || "—"}
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-sm">
                            {brand.website ? (
                              <a 
                                href={brand.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {brand.website}
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {brand.featured ? (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                Featured
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-sm">
                            {new Date(brand.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/admin/brands/${brand.id}/edit`)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDeleteBrand(brand.id)
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "news" && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                News Management Coming Soon
              </h3>
              <p className="text-gray-500">
                Add, edit, and delete news from this interface
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

