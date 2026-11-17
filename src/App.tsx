import { useState } from 'react'
import { LUXURY_FLEET, type LuxuryVehicle } from './data/fleet'
import AnatomyStage from './components/AnatomyStage'
import FleetGrid from './components/FleetGrid'
import EngineeringMatrix from './components/EngineeringMatrix'
import BookingModal from './components/BookingModal'

export default function App() {
  const [selectedVehicle, setSelectedVehicle] = useState<LuxuryVehicle>(LUXURY_FLEET[0])
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingVehicle, setBookingVehicle] = useState<LuxuryVehicle>(LUXURY_FLEET[0])

  function handleInspectAnatomy(vehicle: LuxuryVehicle) {
    setSelectedVehicle(vehicle)
    const stageEl = document.getElementById('anatomy')
    stageEl?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleBookViewing(vehicle: LuxuryVehicle) {
    setBookingVehicle(vehicle)
    setBookingOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#f5f2eb] flex flex-col">
      {/* Strict 3-Zone Single-Row Top Bar */}
      <header className="sticky top-0 z-30 bg-[#0a0c10]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-8">
          <a
            href="#anatomy"
            className="font-ruqaa text-2xl sm:text-3xl font-bold text-[#f5f2eb] hover:text-[#d4af70] transition-colors whitespace-nowrap shrink-0"
          >
            القبطان للسيارات
          </a>

          <nav
            className="hidden md:flex items-center gap-7 text-sm text-[#a6a095]"
            aria-label="التنقل الرئيسي"
          >
            <a
              href="#anatomy"
              className="hover:text-[#f5f2eb] transition-colors whitespace-nowrap shrink-0"
            >
              تشريح السيارة
            </a>
            <a
              href="#fleet"
              className="hover:text-[#f5f2eb] transition-colors whitespace-nowrap shrink-0"
            >
              الأسطول الفاخر
            </a>
            <a
              href="#matrix"
              className="hover:text-[#f5f2eb] transition-colors whitespace-nowrap shrink-0"
            >
              المقارنة الهندسية
            </a>
            <a
              href="#concierge"
              className="hover:text-[#f5f2eb] transition-colors whitespace-nowrap shrink-0"
            >
              صالات العرض
            </a>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => handleBookViewing(selectedVehicle)}
              className="px-4 sm:px-5 py-2.5 rounded-lg bg-[#d4af70] text-[#0d0b07] hover:bg-[#e5c58e] text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0"
            >
              طلب معاينة خاصة
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <AnatomyStage
          fleet={LUXURY_FLEET}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={setSelectedVehicle}
        />

        <FleetGrid
          fleet={LUXURY_FLEET}
          selectedVehicleId={selectedVehicle.id}
          onInspectAnatomy={handleInspectAnatomy}
          onBookViewing={handleBookViewing}
        />

        <EngineeringMatrix
          fleet={LUXURY_FLEET}
          onInspectAnatomy={handleInspectAnatomy}
        />

        {/* Quiet Concierge Invitation Section */}
        <section
          id="concierge"
          className="py-16 px-4 sm:px-8 max-w-[1320px] mx-auto border-t border-white/10"
          aria-label="خدمة كبار الشخصيات وصالات القبطان"
        >
          <div className="bg-[#12161f] border border-[#d4af70]/30 rounded-2xl p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-sm text-[#d4af70] mb-2">الاستشارة الهندسية والمواصفات الخاصة</p>
              <h2 className="font-ruqaa text-3xl sm:text-4xl text-[#f5f2eb] text-balance">
                اقتنِ أيقونتك الهندسية بمواصفات مفصلة لك
              </h2>
              <p className="text-sm sm:text-base text-[#a6a095] mt-3 leading-relaxed">
                يوفر مستشارو القبطان للسيارات معاينة مغلقة لكل سيارة مع شرح ميكانيكي مباشر وخدمة تخصيص الألوان الداخلية والخارجية المعتمدة من المصانع الأوروبية.
              </p>
            </div>
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => handleBookViewing(selectedVehicle)}
                className="px-7 py-3.5 rounded-lg bg-[#d4af70] text-[#0d0b07] hover:bg-[#e5c58e] text-sm font-medium transition-colors whitespace-nowrap"
              >
                احجز موعدك في الصالة
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 px-4 sm:px-8">
        <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#a6a095]">
          <div className="flex items-center gap-3">
            <span className="font-ruqaa text-xl text-[#f5f2eb]">القبطان للسيارات</span>
            <span aria-hidden="true">·</span>
            <span>صالة العرض الهندسية للسيارات الفاخرة</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#anatomy" className="hover:text-[#f5f2eb] transition-colors">
              تشريح السيارة
            </a>
            <a href="#fleet" className="hover:text-[#f5f2eb] transition-colors">
              الأسطول
            </a>
            <a href="#matrix" className="hover:text-[#f5f2eb] transition-colors">
              المواصفات
            </a>
          </div>
        </div>
      </footer>

      <BookingModal
        isOpen={bookingOpen}
        fleet={LUXURY_FLEET}
        initialVehicle={bookingVehicle}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  )
}
