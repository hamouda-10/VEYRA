import { Layers } from 'lucide-react'
import { type LuxuryVehicle } from '../data/fleet'

interface EngineeringMatrixProps {
  fleet: LuxuryVehicle[]
  onInspectAnatomy: (vehicle: LuxuryVehicle) => void
}

export default function EngineeringMatrix({ fleet, onInspectAnatomy }: EngineeringMatrixProps) {
  return (
    <section
      id="matrix"
      className="py-16 px-4 sm:px-8 max-w-[1320px] mx-auto border-t border-white/10"
      aria-label="المقارنة الهندسية للسيارات الفاخرة"
    >
      <div className="mb-8">
        <p className="text-sm text-[#d4af70] mb-2">القراءة الهندسية المقارنة</p>
        <h2 className="font-ruqaa text-3xl sm:text-4xl text-[#f5f2eb] text-balance">
          جدول الأداء والمواصفات الميكانيكية
        </h2>
        <p className="text-sm sm:text-base text-[#a6a095] mt-2 max-w-2xl">
          مقارنة دقيقة بين منظومات الدفع والشاصيه والأرقام الهندسية لكل طراز في صالة القبطان.
        </p>
      </div>

      <div className="overflow-x-auto bg-[#12161f] border border-white/10 rounded-xl">
        <table className="w-full text-right border-collapse min-w-[780px]">
          <thead>
            <tr className="border-b border-white/10 text-xs text-[#a6a095]">
              <th className="py-4 px-5 font-medium">الطراز والعلامة</th>
              <th className="py-4 px-4 font-medium">منظومة المحرك</th>
              <th className="py-4 px-4 font-medium">القوة</th>
              <th className="py-4 px-4 font-medium">العزم</th>
              <th className="py-4 px-4 font-medium">٠–١٠٠ كم/س</th>
              <th className="py-4 px-4 font-medium">السرعة القصوى</th>
              <th className="py-4 px-4 font-medium">السعر</th>
              <th className="py-4 px-5 font-medium">التشريح</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm">
            {fleet.map((car) => (
              <tr key={car.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-4 px-5">
                  <span className="font-ruqaa text-lg text-[#f5f2eb] block">{car.name}</span>
                  <span className="text-xs text-[#a6a095]">{car.brandName}</span>
                </td>
                <td className="py-4 px-4 text-[#a6a095] max-w-[220px]">{car.engineSummary}</td>
                <td className="py-4 px-4 text-[#f5f2eb] font-medium tabular-nums whitespace-nowrap">
                  {car.horsepower}
                </td>
                <td className="py-4 px-4 text-[#f5f2eb] tabular-nums whitespace-nowrap">
                  {car.torque}
                </td>
                <td className="py-4 px-4 text-[#f5f2eb] tabular-nums whitespace-nowrap">
                  {car.acceleration}
                </td>
                <td className="py-4 px-4 text-[#f5f2eb] tabular-nums whitespace-nowrap">
                  {car.topSpeed}
                </td>
                <td className="py-4 px-4 text-[#d4af70] font-medium tabular-nums whitespace-nowrap">
                  {car.price}
                </td>
                <td className="py-4 px-5">
                  <button
                    type="button"
                    onClick={() => onInspectAnatomy(car)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181d28] border border-white/15 hover:border-[#d4af70] text-xs text-[#f5f2eb] whitespace-nowrap transition-colors"
                  >
                    <Layers size={13} className="text-[#d4af70]" />
                    <span>تشريح</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
