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
        <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-4">
                {/* Product Image */}
                <div className="mb-3 flex h-48 items-center justify-center bg-muted/30">
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={180}
                        height={180}
                        className="object-contain transition-transform group-hover:scale-105"
                    />
                </div>

                {/* Product Code */}
                <h3 className="mb-2 text-sm font-bold text-foreground">{product.code}</h3>

                {/* Product Description */}
                <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">{product.name}</p>

                {/* Brand Logo and Checkbox */}
                <div className="flex items-center justify-between">
                    <div className="flex h-8 items-center">
                        <Image
                            src={product.brandLogo || "/placeholder.svg"}
                            alt={product.brandName}
                            width={60}
                            height={30}
                            className="object-contain"
                        />
                    </div>
                    <Checkbox className="h-5 w-5" />
                </div>
            </CardContent>
        </Card>
    )
}
