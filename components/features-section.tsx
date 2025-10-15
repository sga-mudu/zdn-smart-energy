import { Award, Handshake, Scale } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "АЛБАН ЁСНЫ ТӨЛӨӨЛӨГЧ",
    description: "",
  },
  {
    icon: Handshake,
    title: "ХАМТЫН АЖИЛЛАГАА",
    description: "",
  },
  {
    icon: Scale,
    title: "ДЭВШИЛТЭТ ТЕХНОЛОГИ, ТОНОГ ТӨХӨӨРӨМЖ",
    description: "",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-8 sm:py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-3 sm:mb-4 md:mb-6">
                  <Icon
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-gray-400"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground px-2">{feature.title}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
