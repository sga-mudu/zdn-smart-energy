import { ProductCard } from "./products-cards"

interface Product {
    id: string
    code: string
    name: string
    image: string
    brandLogo: string
    brandName: string
}

const products: Product[] = [
    {
        id: "1",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "/analytical-balance-scale.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
    {
        id: "2",
        code: "CP118",
        name: "Аналитик жин, хэмжих хүчин 110г, нарийвчлал 0.0001г",
        image: "/precision-scale.jpg",
        brandLogo: "/ohaus-logo.jpg",
        brandName: "OHAUS",
    },
    {
        id: "3",
        code: "ABS-N",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.0001г",
        image: "/laboratory-balance.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
    {
        id: "4",
        code: "TX31",
        name: "Аналитик жин, хэмжих хүчин 310г, нарийвчлал 0.001г",
        image: "/digital-scale.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
    {
        id: "5",
        code: "TX31",
        name: "Аналитик жин, хэмжих хүчин 310г, нарийвчлал 0.001г",
        image: "/analytical-balance-scale.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
    {
        id: "6",
        code: "CP118",
        name: "Аналитик жин, хэмжих хүчин 110г, нарийвчлал 0.0001г",
        image: "/precision-scale.jpg",
        brandLogo: "/ohaus-logo.jpg",
        brandName: "OHAUS",
    },
    {
        id: "7",
        code: "E-147",
        name: "Аналитик жин, хэмжих хүчин 220g, нарийвчлал 0.0001г",
        image: "/laboratory-balance.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
    {
        id: "8",
        code: "Caliber 12",
        name: "Аналитик жин, хэмжих хүчин 120г, нарийвчлал 0.0001г",
        image: "/digital-scale.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
    {
        id: "9",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "/analytical-balance-scale.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
    {
        id: "10",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "/precision-scale.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
    {
        id: "11",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "/laboratory-balance.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
    {
        id: "12",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "/digital-scale.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
    {
        id: "13",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "/analytical-balance-scale.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
    {
        id: "14",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "/precision-scale.jpg",
        brandLogo: "/kern-logo.jpg",
        brandName: "KERN",
    },
]

export function ProductGrid() {
    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Эрэмбэ хүчний хэмжээ, хэмжилт төхөөрөмж</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
