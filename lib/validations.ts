/**
 * Zod validation schemas for API input validation
 */
import { z } from 'zod'

// Helper to validate URL, relative path, or empty string
// Accepts: empty string, null, relative paths (/path/to/file), or full URLs (http://...)
const urlOrEmpty = z.preprocess(
  (val) => {
    // Convert empty string, null, or undefined to null for consistency
    if (val === '' || val === null || val === undefined) return null
    // Trim whitespace from strings
    if (typeof val === 'string') {
      const trimmed = val.trim()
      return trimmed || null
    }
    return val
  },
  z.union([
    z.null(),
    // Custom validation: accept strings that are either relative paths or URLs
    z.string().refine(
      (val) => {
        // Must be a non-empty string
        if (!val || val.length === 0) return false
        // Check if it's a relative path (starts with /)
        if (val.startsWith('/')) return true
        // Check if it's a valid URL
        try {
          new URL(val)
          return true
        } catch {
          return false
        }
      },
      { message: 'Must be a relative path (starting with /) or a valid URL' }
    ),
  ]).optional().nullable()
)

// Product Schemas
export const productCreateSchema = z.object({
  code: z.string().min(1, 'Product code is required').max(100),
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().max(50000).optional().nullable(), // Increased from 5000 to 50000 for longer descriptions
  image: urlOrEmpty,
  brandLogo: urlOrEmpty,
  brandName: z.string().max(100).optional().nullable().or(z.literal('')),
  categoryId: z.string().min(1, 'Category is required'),
  featured: z.boolean().default(false),
})

export const productUpdateSchema = productCreateSchema.partial().extend({
  code: z.string().min(1).max(100).optional(),
  name: z.string().min(1).max(200).optional(),
  categoryId: z.string().min(1).optional(),
})

// Category Schemas
export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  description: z.string().max(2000).optional().nullable(),
  image: urlOrEmpty, // Accepts relative paths (/uploads/...), full URLs, or empty
  parentId: z.string().optional().nullable(),
})

export const categoryUpdateSchema = categoryCreateSchema.partial()

// Brand Schemas
export const brandCreateSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(100),
  logo: urlOrEmpty, // Accepts relative paths (/uploads/...), full URLs, or empty
  description: z.string().max(2000).optional().nullable(),
  website: z.union([
    z.literal(''),  // Empty string
    z.null(),  // Null
    z.undefined(),  // Undefined
    z.string().url(),  // Full URL (http:// or https://)
  ]).optional().nullable(), // Website must be a valid URL or empty
  featured: z.boolean().default(false),
})

export const brandUpdateSchema = brandCreateSchema.partial()

// News Schemas
export const newsCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500).optional().nullable().or(z.literal('')),
  image: urlOrEmpty,
  published: z.boolean().default(false),
})

export const newsUpdateSchema = newsCreateSchema.partial()

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20).optional(),
  message: z.string().min(1, 'Message is required').max(2000),
})

// ID Parameter Schema
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
})

// Pagination Schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export type ProductCreateInput = z.infer<typeof productCreateSchema>
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>
export type BrandCreateInput = z.infer<typeof brandCreateSchema>
export type BrandUpdateInput = z.infer<typeof brandUpdateSchema>
export type NewsCreateInput = z.infer<typeof newsCreateSchema>
export type NewsUpdateInput = z.infer<typeof newsUpdateSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type PaginationInput = z.infer<typeof paginationSchema>

