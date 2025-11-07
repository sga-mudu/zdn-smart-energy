import { Suspense } from "react"
import { AllTogether } from "@/components/all-products-section/allTogether"

export default function AllProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AllTogether />
    </Suspense>
  )
}
