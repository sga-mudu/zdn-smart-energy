"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import Image from "next/image"

export default function EditNews() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    excerpt: "",
    published: false,
  })

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", "news")

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `Upload failed with status ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // Handle different response structures
      const url = data.url || data.data?.url
      if (!url) {
        console.error("Upload response:", data)
        throw new Error("No URL returned from upload. Invalid response format.")
      }
      
      return url
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload image"
      toast.error(`Upload error: ${message}`)
      throw error
    }
  }

  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const url = await handleImageUpload(file)
      setFormData((prev) => ({ ...prev, image: url }))
      toast.success("Image uploaded successfully")
    } catch (error) {
      // Error already handled
    } finally {
      setUploadingImage(false)
    }
  }

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/admin/news/${id}`)
        if (response.ok) {
          const data = await response.json()
          // Handle both direct data and response.data formats
          const news = data.news || data
          setFormData({
            title: news.title || "",
            content: news.content || "",
            image: news.image || "",
            excerpt: news.excerpt || "",
            published: news.published || false,
          })
        } else {
          toast.error("Failed to load news article")
          router.push("/admin/dashboard")
        }
      } catch (error) {
        console.error(error)
        toast.error("An error occurred while loading the news article")
        router.push("/admin/dashboard")
      } finally {
        setFetching(false)
      }
    }

    if (id) {
      fetchNews()
    }
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("News article updated successfully")
        router.push("/admin/dashboard")
      } else {
        toast.error(data.error || "Failed to update news article")
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while updating the news article")
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading news article...</p>
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
            <CardTitle>Edit News Article</CardTitle>
            <CardDescription>Update the news article information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt / Summary</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  disabled={loading}
                  placeholder="Brief summary of the article..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  required
                  disabled={loading}
                  placeholder="Full article content..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleNewsImageUpload}
                      disabled={loading || uploadingImage}
                      className="cursor-pointer"
                    />
                    {uploadingImage && <p className="text-xs text-muted-foreground">Uploading...</p>}
                  </div>
                  {formData.image && (
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="News preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Or enter image URL manually:
                  </div>
                  <Input
                    id="image"
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    disabled={loading || uploadingImage}
                    placeholder="/uploads/news/image.jpg or https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: !!checked })
                  }
                  disabled={loading}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publish immediately
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
                  {loading ? "Updating..." : "Update Article"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

