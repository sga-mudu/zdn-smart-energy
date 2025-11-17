import { Award, Handshake, Scale } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "АЛБАН ЁСНЫ ТӨЛӨӨЛӨГЧ",
    description: "Дэлхийн тэргүүн үйлдвэрлэгч компаниудын албан ёсны төлөөлөгчөөр ажиллаж, найдвартай бүтээгдэхүүн нийлүүлж байна.",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-blue-100",
  },
  {
    icon: Handshake,
    title: "ХАМТЫН АЖИЛЛАГАА",
    description: "Бид хамтрагч компаниудтай урт хугацааны харилцаа тогтоож, харилцан ашигтай хамтран ажилладаг.",
    color: "from-cyan-500 to-cyan-600",
    bgColor: "from-cyan-50 to-cyan-100",
  },
  {
    icon: Scale,
    title: "ДЭВШИЛТЭТ ТЕХНОЛОГИ, ТОНОГ ТӨХӨӨРӨМЖ",
    description: "Хамгийн сүүлийн үеийн технологиуд ашиглан, чанартай тоног төхөөрөмж санал болгож байна.",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-50 to-purple-100",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-4">
            ЯАГААД БИДНИЙГ СОНГОХ ВЭ?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Бидний давуу талууд
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 mx-auto rounded-full"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative flex h-full flex-col items-center rounded-2xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm px-6 py-8 sm:px-8 sm:py-10 text-center shadow-md transition-all duration-300 hover:shadow-2xl hover:border-blue-300 hover:scale-105 overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10 w-full">
                  {/* Icon */}
                  <div className={`mb-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${feature.bgColor} p-4 sm:p-5 md:p-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon
                      className={`h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-white bg-gradient-to-br ${feature.color} p-3 rounded-xl`}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="mb-4 text-lg sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-gray-900 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  {feature.description && (
                    <p className="text-sm sm:text-base leading-relaxed text-gray-600 group-hover:text-gray-700 transition-colors">
                      {feature.description}
                    </p>
                  )}
                </div>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
