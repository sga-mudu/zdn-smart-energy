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

export default function NewCategory() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [parentCategories, setParentCategories] = useState<Array<{ id: string; name: string }>>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    parentId: "",
  })

  useEffect(() => {
    // Fetch parent categories for nested structure
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setParentCategories(data))
      .catch(console.error)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || undefined
        }),
      })

      if (response.ok) {
        router.push("/admin/dashboard")
      } else {
        alert("Failed to create category")
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred")
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
            <CardTitle>Create New Category</CardTitle>
            <CardDescription>Add a new category to organize your products</CardDescription>
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
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="image">Category Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    disabled={loading}
                    placeholder="/category-image.jpg"
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
                  {loading ? "Creating..." : "Create Category"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

