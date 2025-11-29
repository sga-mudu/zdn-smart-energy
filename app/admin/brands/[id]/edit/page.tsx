"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function EditBrand() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    website: "",
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const url = await handleImageUpload(file, "brand")
      setFormData((prev) => ({ ...prev, logo: url }))
      toast.success("Logo uploaded successfully")
    } catch (error) {
      // Error already handled in handleImageUpload
    } finally {
      setUploadingLogo(false)
    }
  }

  useEffect(() => {
    // Fetch brand data
    fetch(`/api/admin/brands/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Brand not found")
          router.push("/admin/dashboard")
          return
        }
        setFormData({
          name: data.name || "",
          description: data.description || "",
          logo: data.logo || "",
          website: data.website || "",
          featured: data.featured || false,
        })
        setFetching(false)
      })
      .catch((error) => {
        console.error("Error fetching brand:", error)
        alert("Failed to load brand")
        router.push("/admin/dashboard")
      })
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/admin/brands/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/dashboard")
      } else {
        alert("Failed to update brand")
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
            <p className="text-gray-500">Loading brand...</p>
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
            <CardTitle>Edit Brand</CardTitle>
            <CardDescription>Update brand information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name *</Label>
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
                  placeholder="Brand description and information..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="logo">Brand Logo</Label>
                  <div className="space-y-2">
                    <Input
                      id="logoFile"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={loading || uploadingLogo}
                      className="cursor-pointer"
                    />
                    {uploadingLogo && <p className="text-xs text-muted-foreground">Uploading...</p>}
                    {formData.logo && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Current logo:</p>
                        <img src={formData.logo} alt="Preview" className="w-20 h-20 object-cover rounded" />
                      </div>
                    )}
                    <Input
                      id="logo"
                      type="text"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      disabled={loading}
                      placeholder="Or enter logo URL"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL (Optional)</Label>
                  <Input
                    id="website"
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    disabled={loading}
                    placeholder="https://brand-website.com"
                  />
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
                  Featured Brand
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
                  {loading ? "Updating..." : "Update Brand"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

