import { useState } from 'react'
import { ArrowUpLeft, Layers } from 'lucide-react'
import { BRAND_FILTERS, type BrandKey, type LuxuryVehicle } from '../data/fleet'
import ResilientImage from './ResilientImage'

interface FleetGridProps {
  fleet: LuxuryVehicle[]
  selectedVehicleId: string
  onInspectAnatomy: (vehicle: LuxuryVehicle) => void
  onBookViewing: (vehicle: LuxuryVehicle) => void
}

export default function FleetGrid({
  fleet,
  selectedVehicleId,
  onInspectAnatomy,
  onBookViewing,
}: FleetGridProps) {
  const [brandFilter, setBrandFilter] = useState<BrandKey | 'all'>('all')

  const visibleFleet =
    brandFilter === 'all' ? fleet : fleet.filter((item) => item.brandKey === brandFilter)

  return (
    <section
      id="fleet"
      className="py-16 px-4 sm:px-8 max-w-[1320px] mx-auto border-t border-white/10"
      aria-label="أسطول القبطان للسيارات الفاخرة"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-sm text-[#d4af70] mb-2">مجموعة القبطان الحصرية</p>
          <h2 className="font-ruqaa text-3xl sm:text-4xl text-[#f5f2eb] text-balance">
            أسطول النخبة من أرقى العلامات العالمية
          </h2>
          <p className="text-sm sm:text-base text-[#a6a095] mt-2 max-w-2xl">
            نخبة منتقاة حصرياً من بورش، برابوس جي كلاس، مرسيدس مايباخ، لامبورجيني، وبي إم دبليو — متاحة للمعاينة والتشريح الهندسي الكامل.
          </p>
        </div>

        {/* Functional Brand Filter Buttons */}
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="تصفية حسب العلامة التجارية"
        >
          {BRAND_FILTERS.map((f) => {
            const active = brandFilter === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setBrandFilter(f.key)}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 border ${
                  active
                    ? 'bg-[#d4af70] text-[#0d0b07] border-[#d4af70] font-medium'
                    : 'bg-[#12161f] text-[#a6a095] border-white/10 hover:text-[#f5f2eb] hover:border-white/25'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Uniform 16:9 Luxury Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {visibleFleet.map((car) => {
          const isCurrent = car.id === selectedVehicleId
          return (
            <article
              key={car.id}
              className={`bg-[#12161f] rounded-xl overflow-hidden border transition-transform duration-200 hover:-translate-y-0.5 flex flex-col ${
                isCurrent ? 'border-[#d4af70]/70' : 'border-white/10'
              }`}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-[#080a0e]">
                <ResilientImage
                  src={car.heroImage}
                  alt={car.name}
                  fallbackTitle={car.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                <div>
                  <div className="text-xs text-[#a6a095] flex items-center gap-2">
                    <span>{car.brandName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{car.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{car.year}</span>
                  </div>

                  <h3 className="font-ruqaa text-2xl text-[#f5f2eb] mt-2">{car.name}</h3>
                  <p className="text-sm text-[#a6a095] mt-1">{car.engineSummary}</p>
                </div>

                <div>
                  <div className="grid grid-cols-3 gap-3 py-3 border-y border-white/10 text-xs">
                    <div>
                      <span className="block text-[#a6a095]">القوة</span>
                      <span className="block text-[#f5f2eb] font-medium mt-0.5 tabular-nums">
                        {car.horsepower}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[#a6a095]">٠–١٠٠ كم/س</span>
                      <span className="block text-[#f5f2eb] font-medium mt-0.5 tabular-nums">
                        {car.acceleration}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[#a6a095]">السعر</span>
                      <span className="block text-[#d4af70] font-medium mt-0.5 tabular-nums">
                        {car.price}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onInspectAnatomy(car)}
                      className="flex-1 py-2.5 px-4 rounded-lg bg-[#d4af70] text-[#0d0b07] hover:bg-[#e5c58e] text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <Layers size={15} />
                      <span>تشريح السيارة</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onBookViewing(car)}
                      className="py-2.5 px-4 rounded-lg bg-[#181d28] text-[#f5f2eb] border border-white/15 hover:border-[#d4af70]/60 text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <span>معاينة</span>
                      <ArrowUpLeft size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
