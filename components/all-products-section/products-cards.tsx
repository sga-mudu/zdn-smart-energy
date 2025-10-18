import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface Product {
    id: string
    code: string
    name: string
    image: string
    brandLogo: string
    brandName: string
}

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-lg w-full mx-auto">
            <CardContent className="p-3 lg:p-4">
                <div className="mb-2 lg:mb-3 flex h-32 sm:h-40 lg:h-48 items-center justify-center bg-muted/30">
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="object-contain transition-transform group-hover:scale-105"
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
                        alt={product.brandName}
                        width={50}
                        height={25}
                        className="object-contain"
                    />
                    <Checkbox className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
            </CardContent>
        </Card>
    )
}