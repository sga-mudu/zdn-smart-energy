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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="flex h-full flex-col items-center rounded-xl border border-gray-200 bg-white/80 px-4 py-6 text-center shadow-sm transition-shadow hover:shadow-md sm:px-6 sm:py-7"
              >
                <div className="mb-3 flex items-center justify-center rounded-full bg-gray-100 p-3 sm:p-4">
                  <Icon
                    className="h-10 w-10 text-gray-500 sm:h-12 sm:w-12 md:h-14 md:w-14"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-sm font-semibold text-foreground sm:text-base md:text-lg">
                  {feature.title}
                </h3>
                {feature.description ? (
                  <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                    {feature.description}
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
