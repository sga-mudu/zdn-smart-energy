import React, { JSX, useState } from "react";

interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    brand: string;
    category: string;
}

const products: Product[] = [
    {
        id: "TS33",
        name: "Түрсэн файлын үргдөсөн болон этелөл төөлүүр өүгүй түрсэн фааль бүрэө автомат түгээнэйн систем",
        description: "CALMET",
        image: "https://images.pexels.com/photos/5726794/pexels-photo-5726794.jpeg?auto=compress&cs=tinysrgb&w=200",
        brand: "CALMET",
        category: "Эрчим хүчний хэмжилт"
    },
    {
        id: "C300B",
        name: "Түрсэн файлын үргдөсөн калибратор болон эрчим хүчний инженерийн техәөрөмж шалгагч",
        description: "CALMET",
        image: "https://images.pexels.com/photos/8961153/pexels-photo-8961153.jpeg?auto=compress&cs=tinysrgb&w=200",
        brand: "CALMET",
        category: "Эрчим хүчний хэмжилт"
    },
    {
        id: "TE30",
        name: "Түрсэн файлын эөөврийн авчлын этаөний техәөрөмж",
        description: "CALMET",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=200",
        brand: "CALMET",
        category: "Эрчим хүчний хэмжилт"
    },
    {
        id: "TS41",
        name: "Түрсэн файлын үргдөсөн болон этаөний төөлүүр өүгүй түрсэн фааль бүрэө автомат түгээнэйн систем",
        description: "CALMET",
        image: "https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=200",
        brand: "CALMET",
        category: "Эрчим хүчний хэмжилт"
    },
    {
        id: "TB41",
        name: "Дөрвөн байрлалт, ухаалаг",
        description: "CALMET",
        image: "https://images.pexels.com/photos/5726794/pexels-photo-5726794.jpeg?auto=compress&cs=tinysrgb&w=200",
        brand: "CALMET",
        category: "Жин"
    },
    {
        id: "CP11B",
        name: "Калибратор болон",
        description: "CALMET",
        image: "https://images.pexels.com/photos/8961153/pexels-photo-8961153.jpeg?auto=compress&cs=tinysrgb&w=200",
        brand: "CALMET",
        category: "Эрчим хүчний хэмжилт"
    },
    {
        id: "C101",
        name: "Өлөн үйлдсэгч калибратор",
        description: "CALMET",
        image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=200",
        brand: "CALMET",
        category: "Эрчим хүчний хэмжилт"
    },
    {
        id: "Caltest 10",
        name: "Цахилгааны төөлүүрүүн тестөр",
        description: "CALMET",
        image: "https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=200",
        brand: "CALMET",
        category: "Эрчим хүчний хэмжилт"
    }
];

interface Category {
    name: string;
    subcategories?: string[];
}

const categories: Category[] = [
    {
        name: "Бүх бүтээгдэхүүн"
    },
    {
        name: "Цахилгааны тоолуур, АММ/АМР систем",
        subcategories: [
            "Олон тариф ухаалаг тоолуур",
            "Олон тариф электрон тоолуур",
            "АММ/АМР систем",
            "Дагалдах хэрэгсэл"
        ]
    },
    {
        name: "Эрчим хүчний хэмжилт, хяналтын техөөрөмж",
        subcategories: [
            "Үл аядах сорилын багаж",
            "Жин",
            "Электрон жин",
            "Лабораторийн жин",
            "Үйлдвэрийн жин",
            "Эмнэлгийн жин",
            "Түүхай",
            "Програм"
        ]
    },
    {
        name: "Эрчим хүчний тоног төхөөрөмж, хэрэгсэл тоноглол"
    },
    {
        name: "Хэмжих хэрэгсэл, хэмжлийн технологи",
        subcategories: [
            "Хүчний хэмжигч",
            "Уртын хэмжигч",
            "Уртын хэмжигч",
            "Өргүүлэх хүчний хэмжигч",
            "Бурвалтийн зуваан хэмжигч"
        ]
    },
    {
        name: "Материалын зуваан хэмжигч"
    }
];

interface Brand {
    name: string;
    country: string;
}

const brands: Brand[] = [
    { name: "ZPA Smart Energy", country: "БНЧУ-Урис" },
    { name: "CALMET", country: "ПОЛЬШ УЛСААС" },
    { name: "KERN", country: "ГЕРМАН УЛСААС" },
    { name: "SAUTER", country: "ГЕРМАН УЛСААС" },
    { name: "OKOndt GROUP", country: "УКРАИН УЛСААС" },
    { name: "KERN OPTICS", country: "ГЕРМАН УЛСААС" },
    { name: "Г.НОРИТ", country: "ДУНАРОДЗҮ ТЕХНОЛОГИ" }
];

export const Box = (): JSX.Element => {
    const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const toggleCategory = (categoryName: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryName)) {
                newSet.delete(categoryName);
            } else {
                newSet.add(categoryName);
            }
            return newSet;
        });
    };

    const getBrandProductCount = (brandName: string) => {
        return products.filter(p => p.brand === brandName).length;
    };

    const toggleProduct = (id: string) => {
        setSelectedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5]" id="all-products">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-700">ВРАЧЛИТА</h1>
                        <div className="flex items-center gap-6">
                            {brands.map((brand, idx) => (
                                <div key={idx} className="text-center relative">
                                    <div className="flex flex-col items-center">
                                        <div className="text-sm font-semibold text-gray-700">{brand.name}</div>
                                        <div className="text-xs text-gray-500">{brand.country}</div>
                                        <div className="absolute -bottom-2 right-0 bg-gray-300 text-gray-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {getBrandProductCount(brand.name)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    <aside className="w-72 bg-white rounded-lg shadow-sm h-fit border border-blue-500">
                        <div className="bg-gray-100 px-4 py-3 border-b">
                            <h2 className="font-bold text-gray-800">БҮТЭЭГДЭХҮҮНИЙ ТӨРӨЛ</h2>
                        </div>
                        <nav className="p-4">
                            <ul className="space-y-1">
                                {categories.map((category, idx) => (
                                    <li key={idx}>
                                        <div>
                                            <button
                                                onClick={() => {
                                                    if (category.subcategories) {
                                                        toggleCategory(category.name);
                                                    }
                                                    setSelectedCategory(category.name);
                                                }}
                                                className="text-left text-sm text-gray-700 hover:text-blue-600 transition-colors w-full py-1 font-medium"
                                            >
                                                {category.name}
                                            </button>
                                            {category.subcategories && expandedCategories.has(category.name) && (
                                                <ul className="ml-4 mt-1 space-y-1">
                                                    {category.subcategories.map((sub, subIdx) => (
                                                        <li key={subIdx}>
                                                            <button className="text-left text-sm text-gray-600 hover:text-blue-600 transition-colors w-full py-1">
                                                                {sub}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="border-t p-4 space-y-3">
                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm mb-1">Эрчим хүчний хэмжүүр, хяналтын техөөрөмж</h3>
                                <button className="text-xs text-blue-600 hover:underline">Үл аядах сорилын багаж</button>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm">Жин</h3>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm">Програм</h3>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm">Эрчим хүчний тоног төхөөрөмж, хэрэгсэл тоноглол</h3>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm">Хэмжих хэрэгсэл, хэмжлийн технологи</h3>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm">Материалын зуваан хэмжигч</h3>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="bg-gray-800 text-white px-6 py-3 rounded-lg mb-6">
                            <p className="text-sm">Бүтээгдэхүүний бааруул доод бүлэн дээр даран бүтээгдэхүүний танилцуулгыг татах боломжтой.</p>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">ЭРЧИМ ХҮЧНИЙ ХЭМЖИЛТ, ХЯНАЛТЫН ТЕХӨӨРӨМЖ</h2>

                        <div className="grid grid-cols-4 gap-4">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 text-sm mb-1">{product.id}</h3>
                                        <p className="text-xs text-gray-600 mb-2 line-clamp-3 min-h-[3rem]">{product.name}</p>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                                                <span className="text-xs font-semibold text-blue-600">{product.brand}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.has(product.id)}
                                                onChange={() => toggleProduct(product.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {selectedProducts.size > 0 && (
                            <div className="fixed bottom-8 right-8">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors font-medium">
                                    Танилцуулга татах ({selectedProducts.size})
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
