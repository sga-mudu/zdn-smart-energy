"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function NewBrand() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const url = await handleImageUpload(file, "brand")
      setFormData((prev) => ({ ...prev, logo: url }))
    } catch (error) {
      // Error already handled
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Prepare data for submission - ensure empty strings are handled correctly
    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      // Preserve logo as-is if it's a valid path, otherwise null
      logo: formData.logo && formData.logo.trim() ? formData.logo.trim() : null,
      website: formData.website.trim() || null,
      featured: formData.featured,
    }

    console.log("Submitting brand data:", submitData)

    try {
      const response = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      const responseData = await response.json().catch(() => ({}))

      if (response.ok) {
        toast.success("Brand created successfully")
        router.push("/admin/dashboard")
      } else {
        console.error("Brand creation error:", responseData)
        console.error("Full response:", responseData)
        
        // Show detailed validation errors
        let errorMessage = "Failed to create brand"
        if (responseData.details && Array.isArray(responseData.details)) {
          errorMessage = responseData.details
            .map((d: any) => {
              const field = d.path || "unknown"
              const msg = d.message || "Invalid value"
              const received = d.received !== undefined ? ` (received: ${JSON.stringify(d.received)})` : ""
              return `${field}: ${msg}${received}`
            })
            .join("\n")
        } else if (responseData.error) {
          errorMessage = responseData.error
        }
        
        console.error("Error message:", errorMessage)
        toast.error(`Error: ${errorMessage}`)
        setLoading(false)
      }
    } catch (error) {
      console.error("Brand creation error:", error)
      alert("An error occurred. Please check the console for details.")
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
            <CardTitle>Create New Brand</CardTitle>
            <CardDescription>Add a new brand to your catalog</CardDescription>
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
                  {loading ? "Creating..." : "Create Brand"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

