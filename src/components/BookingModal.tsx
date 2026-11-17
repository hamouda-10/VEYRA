import { useEffect, useState, type FormEvent } from 'react'
import { Check, X } from 'lucide-react'
import { SHOWROOM_BRANCHES, type LuxuryVehicle } from '../data/fleet'

interface BookingModalProps {
  isOpen: boolean
  fleet: LuxuryVehicle[]
  initialVehicle: LuxuryVehicle
  onClose: () => void
}

export default function BookingModal({
  isOpen,
  fleet,
  initialVehicle,
  onClose,
}: BookingModalProps) {
  const [vehicleId, setVehicleId] = useState(initialVehicle.id)
  const [branch, setBranch] = useState(SHOWROOM_BRANCHES[0])
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('٢٠٢٦-١١-٢٥')
  const [notes, setNotes] = useState('')
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null)

  useEffect(() => {
    setVehicleId(initialVehicle.id)
    setConfirmedRef(null)
  }, [initialVehicle.id, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const chosenCar = fleet.find((v) => v.id === vehicleId) || initialVehicle

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!clientName.trim() || !phone.trim()) return
    const refNumber = `QBT-${Math.floor(10000 + Math.random() * 90000)}`
    setConfirmedRef(refNumber)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="bg-[#12161f] border border-[#d4af70]/40 rounded-2xl w-full max-w-lg p-6 sm:p-8 relative shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق نافذة الحجز"
          className="absolute top-4 left-4 w-10 h-10 rounded-lg flex items-center justify-center text-[#a6a095] hover:text-[#f5f2eb] hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        {confirmedRef ? (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#d4af70] text-[#0d0b07] flex items-center justify-center mx-auto">
              <Check size={22} />
            </div>
            <h3 id="booking-modal-title" className="font-ruqaa text-3xl text-[#f5f2eb]">
              تم تأكيد طلب المعاينة الخاصة
            </h3>
            <p className="text-sm text-[#a6a095] leading-relaxed">
              سيتواصل معكم مستشار كبار الشخصيات في صالة القبطان لتأكيد الموعد وتجهيز سيارة{' '}
              <strong className="text-[#f5f2eb]">{chosenCar.name}</strong> للمعاينة الهندسية.
            </p>
            <div className="bg-[#0a0c10] border border-white/10 rounded-xl p-4 text-right text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[#a6a095]">رقم الحجز</span>
                <span className="text-[#d4af70] font-mono tabular-nums">{confirmedRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a6a095]">السيارة المختارة</span>
                <span className="text-[#f5f2eb]">{chosenCar.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a6a095]">الصالة</span>
                <span className="text-[#f5f2eb]">{branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a6a095]">اسم العميل</span>
                <span className="text-[#f5f2eb]">{clientName}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-[#d4af70] text-[#0d0b07] font-medium hover:bg-[#e5c58e] transition-colors"
            >
              العودة إلى الصالة
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-xs text-[#d4af70] mb-1">صالة كبار الشخصيات — القبطان للسيارات</p>
              <h3 id="booking-modal-title" className="font-ruqaa text-3xl text-[#f5f2eb]">
                حجز معاينة خاصة
              </h3>
            </div>

            <div>
              <label htmlFor="booking-car" className="block text-xs text-[#a6a095] mb-1.5">
                السيارة المطلوبة
              </label>
              <select
                id="booking-car"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full rounded-lg bg-[#0a0c10] border border-white/15 px-3.5 py-2.5 text-sm text-[#f5f2eb]"
              >
                {fleet.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name} — {car.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="booking-branch" className="block text-xs text-[#a6a095] mb-1.5">
                فرع الصالة
              </label>
              <select
                id="booking-branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full rounded-lg bg-[#0a0c10] border border-white/15 px-3.5 py-2.5 text-sm text-[#f5f2eb]"
              >
                {SHOWROOM_BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-name" className="block text-xs text-[#a6a095] mb-1.5">
                  الاسم الكامل
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: خالد العتيبي"
                  className="w-full rounded-lg bg-[#0a0c10] border border-white/15 px-3.5 py-2.5 text-sm text-[#f5f2eb] placeholder:text-[#a6a095]/50"
                />
              </div>
              <div>
                <label htmlFor="booking-phone" className="block text-xs text-[#a6a095] mb-1.5">
                  رقم الجوال
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 5X XXX XXXX"
                  className="w-full rounded-lg bg-[#0a0c10] border border-white/15 px-3.5 py-2.5 text-sm text-[#f5f2eb] placeholder:text-[#a6a095]/50"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label htmlFor="booking-date" className="block text-xs text-[#a6a095] mb-1.5">
                التاريخ المفضل للمعاينة
              </label>
              <input
                id="booking-date"
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg bg-[#0a0c10] border border-white/15 px-3.5 py-2.5 text-sm text-[#f5f2eb]"
              />
            </div>

            <div>
              <label htmlFor="booking-notes" className="block text-xs text-[#a6a095] mb-1.5">
                تفضيلات التجهيز أو ملاحظات إضافية (اختياري)
              </label>
              <input
                id="booking-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="لون داخلي خاص، باقة كربون، استشارة فنية..."
                className="w-full rounded-lg bg-[#0a0c10] border border-white/15 px-3.5 py-2.5 text-sm text-[#f5f2eb] placeholder:text-[#a6a095]/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#d4af70] text-[#0d0b07] font-medium hover:bg-[#e5c58e] transition-colors mt-2"
            >
              تأكيد طلب المعاينة
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
