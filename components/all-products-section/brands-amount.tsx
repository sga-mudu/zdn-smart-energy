import Image from "next/image"
import { Card } from "@/components/ui/card"

interface Brand {
    id: string
    name: string
    subtitle: string
    logo: string
    productCount: number
}

const brands: Brand[] = [
    {
        id: "1",
        name: "ZPA Smart Energy",
        subtitle: "Европ чанар",
        logo: "../brands/brand1.png",
        productCount: 4,
    },
    {
        id: "2",
        name: "CALMET",
        subtitle: "Европ чанар",
        logo: "../brands/brand2.png",
        productCount: 8,
    },
    {
        id: "3",
        name: "KERN",
        subtitle: "Европ чанар",
        logo: "../brands/brand3.png",
        productCount: 12,
    },
    {
        id: "4",
        name: "SAUTER",
        subtitle: "Европ чанар",
        logo: "../brands/brand4.png",
        productCount: 6,
    },
    {
        id: "5",
        name: "OKOndt GROUP",
        subtitle: "Европ чанар",
        logo: "../brands/brand5.png",
        productCount: 3,
    },
    {
        id: "6",
        name: "KERN OPTICS",
        subtitle: "Европ чанар",
        logo: "../brands/brand1.png",
        productCount: 5,
    },
    {
        id: "7",
        name: "G HORIT",
        subtitle: "Дэвшилтэт технологи",
        logo: "../brands/brand1.png",
        productCount: 7,
    },
]

export function BrandSection() {
    return (
        <div className="mb-6 lg:mb-8 rounded-lg border p-4 lg:p-5 border-border bg-card">
            <h2 className="mb-4 lg:mb-6 text-xl lg:text-2xl font-bold uppercase tracking-wide text-muted-foreground text-center lg:text-left">
                БРЭНДҮҮД
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-0">
                {brands.map((brand) => (
                    <Card
                        key={brand.id}
                        className="flex flex-row m-1 lg:m-2 cursor-pointer items-center gap-3 lg:gap-4 rounded-lg p-3 transition-all hover:bg-accent/50"
                    >
                        <div className="flex h-10 w-20 lg:h-12 lg:w-30 flex-shrink-0 items-center justify-center">
                            <Image
                                src={brand.logo || "/placeholder.svg"}
                                alt={brand.name}
                                width={80}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                        <div className="grid gap-2 lg:gap-3 items-center flex-1">
                            <div className="text-left">
                                <h3 className="text-xs lg:text-sm font-bold text-foreground">{brand.name}</h3>
                                <p className="text-xs text-muted-foreground">{brand.subtitle}</p>
                            </div>
                            <div className="flex h-6 w-6 lg:h-8 lg:w-8 items-center justify-center rounded-full bg-muted">
                                <span className="text-xs lg:text-sm font-semibold text-muted-foreground">{brand.productCount}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}