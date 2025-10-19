"use client"

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
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
    {
        id: "2",
        code: "CP118",
        name: "Аналитик жин, хэмжих хүчин 110г, нарийвчлал 0.0001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "OHAUS",
    },
    {
        id: "3",
        code: "ABS-N",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.0001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
    {
        id: "4",
        code: "TX31",
        name: "Аналитик жин, хэмжих хүчин 310г, нарийвчлал 0.001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
    {
        id: "5",
        code: "TX31",
        name: "Аналитик жин, хэмжих хүчин 310г, нарийвчлал 0.001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
    {
        id: "6",
        code: "CP118",
        name: "Аналитик жин, хэмжих хүчин 110г, нарийвчлал 0.0001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "OHAUS",
    },
    {
        id: "7",
        code: "E-147",
        name: "Аналитик жин, хэмжих хүчин 220g, нарийвчлал 0.0001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
    {
        id: "8",
        code: "Caliber 12",
        name: "Аналитик жин, хэмжих хүчин 120г, нарийвчлал 0.0001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
    {
        id: "9",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
    {
        id: "10",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
    {
        id: "11",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
    {
        id: "12",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
    {
        id: "13",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
    {
        id: "14",
        code: "TX3",
        name: "Аналитик жин, хэмжих хүчин 220г, нарийвчлал 0.001г",
        image: "./black-laboratory-testing-device-food-analysis.jpg",
        brandLogo: "../brands/brand1.png",
        brandName: "KERN",
    },
]

export function ProductGrid() {
    const handleDownload = () => {
        // Create a text file with all product descriptions
        const productDescriptions = products
            .map((product) => `${product.code}\n${product.name}\nБрэнд: ${product.brandName}\n\n`)
            .join("---\n\n")

        const blob = new Blob([productDescriptions], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "product-descriptions.txt"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="border p-4 lg:p-5 rounded-lg border-border bg-card" id="products">
            <div className="text-center mb-4 lg:mb-6 rounded-lg bg-gray-700 py-3 px-4 lg:pl-6 text-sm lg:text-md text-white">
                <h3>Бүтээгдэхүүний баруун доод булан дээр даран бүтээгдэхүүний танилцуулгыг татах боломжтой.</h3>
            </div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg lg:text-2xl font-semibold text-gray-600">
                    Эрэмбэ хүчний хэмжээ, хэмжилт төхөөрөмж
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="mt-6 lg:mt-8 flex justify-center lg:justify-end">
                <button
                    onClick={handleDownload}
                    className="w-full lg:w-auto rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Танилцуулга татах
                </button>
            </div>
        </div>
    )
}