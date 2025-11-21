"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function NewProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [categories, setCategories] = useState<Array<{ 
    id: string
    name: string
    parentId: string | null
    parent: { id: string; name: string } | null
  }>>([])
  const [brands, setBrands] = useState<Array<{ id: string; name: string; logo: string | null }>>([])
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    image: "",
    brandLogo: "",
    brandName: "",
    categoryId: "",
    featured: false,
  })

  const handleImageUpload = async (file: File, type: "product" | "brand") => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || "Upload failed"
        throw new Error(errorMessage)
      }

      const data = await response.json()
      if (!data.url) {
        throw new Error("No URL returned from upload")
      }
      return data.url
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload image"
      toast.error(`Upload error: ${message}`)
      throw error
    }
  }

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const url = await handleImageUpload(file, "product")
      setFormData((prev) => ({ ...prev, image: url }))
    } catch (error) {
      // Error already handled
    } finally {
      setUploadingImage(false)
    }
  }

  useEffect(() => {
    // Fetch categories
    fetch("/api/admin/categories", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          // Try to get error message from response
          let errorData
          try {
            const text = await res.text()
            errorData = text ? JSON.parse(text) : { error: `HTTP ${res.status}: ${res.statusText}` }
          } catch {
            errorData = { error: `HTTP ${res.status}: ${res.statusText}` }
          }
          
          console.error("Failed to fetch categories:", {
            status: res.status,
            statusText: res.statusText,
            error: errorData
          })
          
          // If unauthorized, redirect to login
          if (res.status === 401) {
            router.push("/admin/login")
            return null
          }
          
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data === null) {
          // Error was handled above
          return
        }
        if (Array.isArray(data)) {
          setCategories(data)
        } else {
          console.error("Invalid categories data:", data)
          setCategories([])
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error)
        setCategories([])
      })
    
    // Fetch brands
    fetch("/api/admin/brands", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          // Try to get error message from response
          let errorData
          let responseText = ""
          try {
            responseText = await res.text()
            if (responseText) {
              try {
                errorData = JSON.parse(responseText)
              } catch (parseError) {
                errorData = { error: responseText, parseError: "Failed to parse JSON" }
              }
            } else {
              errorData = { error: `HTTP ${res.status}: ${res.statusText}`, message: "Empty response body" }
            }
          } catch (textError) {
            errorData = { error: `HTTP ${res.status}: ${res.statusText}`, message: "Failed to read response", textError: String(textError) }
          }
          
          console.error("Failed to fetch brands:", {
            status: res.status,
            statusText: res.statusText,
            url: res.url,
            headers: Object.fromEntries(res.headers.entries()),
            responseText: responseText || "(empty)",
            error: errorData
          })
          
          // If unauthorized, redirect to login
          if (res.status === 401) {
            console.warn("Unauthorized access detected, redirecting to login")
            router.push("/admin/login")
            return null
          }
          
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data === null) {
          // Error was handled above
          return
        }
        // Handle both array and paginated response formats
        if (Array.isArray(data)) {
          setBrands(data)
        } else if (data && Array.isArray(data.brands)) {
          setBrands(data.brands)
        } else {
          console.error("Invalid brands data:", data)
          setBrands([])
        }
      })
      .catch((error) => {
        console.error("Error fetching brands:", error)
        setBrands([])
      })
  }, [router])
  
  const handleBrandChange = (brandId: string) => {
    if (brandId === "none") {
      setFormData({
        ...formData,
        brandName: "",
        brandLogo: "",
      })
    } else {
      const selectedBrand = brands.find(b => b.id === brandId)
      if (selectedBrand) {
        setFormData({
          ...formData,
          brandName: selectedBrand.name,
          brandLogo: selectedBrand.logo || "",
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Product created successfully!")
        router.push("/admin/dashboard")
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.message || "Failed to create product"
        toast.error(`Error: ${errorMessage}`)
        setLoading(false)
      }
    } catch (error) {
      toast.error("An error occurred: " + (error instanceof Error ? error.message : "Unknown error"))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
            <CardDescription>Add a new product to your catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="code">Product Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    required
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {(() => {
                        // Ensure categories is an array
                        if (!Array.isArray(categories) || categories.length === 0) {
                          return (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              No categories available
                            </div>
                          )
                        }
                        
                        // Separate parent and child categories
                        const parentCategories = categories.filter(cat => !cat.parentId)
                        const childCategories = categories.filter(cat => cat.parentId)
                        
                        // Create a map of parent ID to children
                        const childrenMap = new Map<string, typeof childCategories>()
                        childCategories.forEach(child => {
                          if (child.parentId) {
                            if (!childrenMap.has(child.parentId)) {
                              childrenMap.set(child.parentId, [])
                            }
                            childrenMap.get(child.parentId)!.push(child)
                          }
                        })
                        
                        // Build ordered list: parent, then its children
                        const orderedCategories: (typeof categories[0] & { isChild?: boolean })[] = []
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
                          <SelectItem key={category.id} value={category.id}>
                            <span className={category.isChild ? "pl-4 text-sm" : "font-medium"}>
                              {category.isChild && "└─ "}
                              {category.name}
                              {category.isChild && category.parent && (
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({category.parent.name})
                                </span>
                              )}
                            </span>
                          </SelectItem>
                        ))
                      })()}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="space-y-2">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      disabled={loading || uploadingImage}
                      className="cursor-pointer"
                    />
                    {uploadingImage && <p className="text-xs text-muted-foreground">Uploading...</p>}
                    {formData.image && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Current image:</p>
                        <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded" />
                      </div>
                    )}
                    <Input
                      id="image"
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      disabled={loading}
                      placeholder="Or enter image URL"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandId">Brand</Label>
                  <Select
                    value={formData.brandName ? brands.find(b => b.name === formData.brandName)?.id || "none" : "none"}
                    onValueChange={handleBrandChange}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a brand (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.brandLogo && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Selected brand logo:</p>
                      <img src={formData.brandLogo} alt={formData.brandName} className="w-20 h-20 object-contain rounded" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: !!checked })
                  }
                  disabled={loading}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Product
                </Label>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

