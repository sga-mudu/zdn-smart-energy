import { Footer } from "react-day-picker";
import FeaturesSection from "../features-section";
import Header from "../header";
import { BrandSection } from "./brands-amount";
import { CategorySidebar } from "./category-sidebar";
import { ProductGrid } from "./products-grids";

export function AllTogether() {
    return (<>
        <section className="bg-background min-h-screen" id="all-products">
            <Header />
            <div className="flex min-h-screen bg-background">
                {/* Left Sidebar - Categories */}
                <aside className="w-64 border-r border-border bg-card">
                    <CategorySidebar />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6">
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