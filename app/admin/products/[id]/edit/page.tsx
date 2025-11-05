"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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

export default function EditProduct() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingBrandLogo, setUploadingBrandLogo] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
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
      console.error("Upload error:", error)
      const message = error instanceof Error ? error.message : "Failed to upload image"
      alert(`Upload error: ${message}`)
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

  const handleBrandLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingBrandLogo(true)
    try {
      const url = await handleImageUpload(file, "brand")
      setFormData((prev) => ({ ...prev, brandLogo: url }))
    } catch (error) {
      // Error already handled
    } finally {
      setUploadingBrandLogo(false)
    }
  }

  useEffect(() => {
    // Fetch product data
    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Product not found")
          router.push("/admin/dashboard")
          return
        }
        setFormData({
          code: data.code || "",
          name: data.name || "",
          description: data.description || "",
          image: data.image || "",
          brandLogo: data.brandLogo || "",
          brandName: data.brandName || "",
          categoryId: data.categoryId || "",
          featured: data.featured || false,
        })
        setFetching(false)
      })
      .catch((error) => {
        console.error("Error fetching product:", error)
        alert("Failed to load product")
        router.push("/admin/dashboard")
      })

    // Fetch categories
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error)
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/dashboard")
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.message || "Failed to update product"
        alert(`Error: ${errorMessage}`)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred: " + (error instanceof Error ? error.message : "Unknown error"))
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading product...</p>
          </div>
        </div>
      </div>
    )
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
            <CardTitle>Edit Product</CardTitle>
            <CardDescription>Update product information</CardDescription>
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
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandLogo">Brand Logo</Label>
                  <div className="space-y-2">
                    <Input
                      id="brandLogoFile"
                      type="file"
                      accept="image/*"
                      onChange={handleBrandLogoUpload}
                      disabled={loading || uploadingBrandLogo}
                      className="cursor-pointer"
                    />
                    {uploadingBrandLogo && <p className="text-xs text-muted-foreground">Uploading...</p>}
                    {formData.brandLogo && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Current logo:</p>
                        <img src={formData.brandLogo} alt="Preview" className="w-20 h-20 object-cover rounded" />
                      </div>
                    )}
                    <Input
                      id="brandLogo"
                      type="text"
                      value={formData.brandLogo}
                      onChange={(e) => setFormData({ ...formData, brandLogo: e.target.value })}
                      disabled={loading}
                      placeholder="Or enter logo URL"
                      className="mt-2"
                    />
                  </div>
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
                  {loading ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

