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

export default function EditCategory() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [parentCategories, setParentCategories] = useState<Array<{ id: string; name: string }>>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "",
  })

  useEffect(() => {
    // Fetch category data
    fetch(`/api/admin/categories/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Category not found")
          router.push("/admin/dashboard")
          return
        }
        setFormData({
          name: data.name || "",
          description: data.description || "",
          parentId: data.parentId || "",
        })
        setFetching(false)
      })
      .catch((error) => {
        console.error("Error fetching category:", error)
        alert("Failed to load category")
        router.push("/admin/dashboard")
      })

    // Fetch parent categories
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        // Filter out current category to prevent circular reference
        const filtered = data.filter((cat: any) => cat.id !== id)
        setParentCategories(filtered)
      })
      .catch(console.error)
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || undefined
        }),
      })

      if (response.ok) {
        router.push("/admin/dashboard")
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || "Failed to update category"
        alert(`Error: ${errorMessage}`)
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading category...</p>
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
            <CardTitle>Edit Category</CardTitle>
            <CardDescription>Update category information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
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
                  placeholder="Category description..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId">Parent Category (Optional)</Label>
                <Select
                  value={formData.parentId || undefined}
                  onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None - Top level category" />
                  </SelectTrigger>
                  <SelectContent>
                    {parentCategories.length > 0 ? (
                      parentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No categories available
                      </div>
                    )}
                  </SelectContent>
                </Select>
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
                  {loading ? "Updating..." : "Update Category"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

