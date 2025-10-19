
import Footer from "../footer";
import FeaturesSection from "../features-section";
import Header from "../header";
import { BrandSection } from "./brands-amount";
import { CategorySidebar } from "./category-sidebar";
import { ProductGrid } from "./products-grids";

export function AllTogether() {
    return (<>
        <section className="bg-background min-h-screen" id="all-products">
            <Header />
            <div className="flex flex-col lg:flex-row min-h-screen bg-background">
                {/* Mobile Category Toggle - Hidden on desktop */}
                <div className="lg:hidden m-4">
                    <details className="border rounded-lg border-border bg-card">
                        <summary className="p-4 text-sm font-semibold cursor-pointer">
                            Бүтээгдэхүүний төрөл
                        </summary>
                        <div className="px-4 pb-4">
                            <CategorySidebar />
                        </div>
                    </details>
                </div>

                {/* Left Sidebar - Categories - Hidden on mobile */}
                <div className="hidden lg:block w-64 border ml-5 mt-5 rounded-lg border-border bg-card sticky top-16 h-fit self-start">
                    <CategorySidebar />
                </div>

                {/* Main Content Area */}
                <main className="flex-1 p-4 lg:p-6">
                    {/* Brand Section */}
                    <BrandSection />

                    {/* Product Grid */}
                    <ProductGrid />
                </main>
            </div>
            <FeaturesSection />
            <Footer />
        </section>
    </>)
}