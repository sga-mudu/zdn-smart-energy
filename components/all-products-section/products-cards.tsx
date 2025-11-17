import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface Product {
    id: string
    code: string
    name: string
    image: string | null
    brandLogo: string | null
    brandName: string | null
}

interface ProductCardProps {
    product: Product
    isSelected?: boolean
    onSelect?: () => void
}

export function ProductCard({ product, isSelected = false, onSelect }: ProductCardProps) {
    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onSelect?.()
    }

    return (
        <Link href={`/products/${product.id}`} className="block">
            <Card className={`group relative overflow-hidden transition-all hover:shadow-lg w-full mx-auto cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}>
                <CardContent className="p-3 lg:p-4">
                    <div className="mb-2 lg:mb-3 flex h-32 sm:h-40 lg:h-48 items-center justify-center bg-muted/30">
                        <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={192}
                            height={192}
                            className="object-contain transition-transform group-hover:scale-105"
                            sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
                            quality={85}
                            loading="lazy"
                        />
                    </div>
                    <h3 className="mb-1 text-xs sm:text-sm lg:text-base font-bold text-foreground">
                        {product.code}
                    </h3>
                    <p className="mb-2 text-xs text-muted-foreground line-clamp-2 sm:line-clamp-3">
                        {product.name}
                    </p>
                    <div className="flex items-center justify-between">
                        <Image
                            src={product.brandLogo || "/placeholder.svg"}
                            alt={product.brandName || "Brand"}
                            width={50}
                            height={25}
                            className="object-contain"
                            sizes="50px"
                            quality={90}
                            loading="lazy"
                        />
                        <div onClick={handleCheckboxClick}>
                            <Checkbox 
                                checked={isSelected} 
                                className="h-4 w-4 lg:h-5 lg:w-5 cursor-pointer" 
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}