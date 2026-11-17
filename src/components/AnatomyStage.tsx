import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, Eye, Layers, Plus, Sparkles } from 'lucide-react'
import {
  ANATOMY_PART_LABELS,
  type AnatomyPartId,
  type LuxuryVehicle,
} from '../data/fleet'
import ResilientImage from './ResilientImage'

type StagePhase = 'overview' | 'entering' | 'detail' | 'returning'

interface AnatomyStageProps {
  fleet: LuxuryVehicle[]
  selectedVehicle: LuxuryVehicle
  onSelectVehicle: (vehicle: LuxuryVehicle) => void
}

export default function AnatomyStage({
  fleet,
  selectedVehicle,
  onSelectVehicle,
}: AnatomyStageProps) {
  const [phase, setPhase] = useState<StagePhase>('overview')
  const [activePart, setActivePart] = useState<AnatomyPartId>('engine')
  const [hoveredPart, setHoveredPart] = useState<AnatomyPartId | null>(null)
  const [xrayMode, setXrayMode] = useState(false)
  const [selectedPin, setSelectedPin] = useState<number>(0)
  const [detailVisible, setDetailVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const lockRef = useRef(false)
  const timerRef = useRef<number | undefined>(undefined)
  const revealRef = useRef<number | undefined>(undefined)
  const backBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => {
      mq.removeEventListener('change', sync)
      window.clearTimeout(timerRef.current)
      window.clearTimeout(revealRef.current)
    }
  }, [])

  // Reset to clean overview when switching between cars
  useEffect(() => {
    window.clearTimeout(timerRef.current)
    window.clearTimeout(revealRef.current)
    lockRef.current = false
    setPhase('overview')
    setDetailVisible(false)
    setHoveredPart(null)
    setSelectedPin(0)
  }, [selectedVehicle.id])

  const activeHotspot =
    selectedVehicle.hotspots.find((h) => h.partId === activePart) || selectedVehicle.hotspots[0]
  const currentAnatomy = selectedVehicle.anatomy[activePart]

  function enterPart(partId: AnatomyPartId) {
    if (lockRef.current && phase !== 'detail') return
    if (phase === 'detail') {
      setActivePart(partId)
      setSelectedPin(0)
      return
    }
    lockRef.current = true
    setActivePart(partId)
    setSelectedPin(0)
    setHoveredPart(null)
    setPhase('entering')

    revealRef.current = window.setTimeout(
      () => setDetailVisible(true),
      reducedMotion ? 0 : 280
    )
    timerRef.current = window.setTimeout(
      () => {
        setPhase('detail')
        setDetailVisible(true)
        lockRef.current = false
        window.setTimeout(() => backBtnRef.current?.focus({ preventScroll: true }), 0)
      },
      reducedMotion ? 0 : 900
    )
  }

  function returnToExterior() {
    if (phase !== 'detail' || lockRef.current) return
    lockRef.current = true
    setPhase('returning')
    revealRef.current = window.setTimeout(
      () => setDetailVisible(false),
      reducedMotion ? 0 : 120
    )
    timerRef.current = window.setTimeout(
      () => {
        setPhase('overview')
        setDetailVisible(false)
        lockRef.current = false
      },
      reducedMotion ? 0 : 850
    )
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'detail') {
        returnToExterior()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const planeStyle = {
    '--focus-x': `${activeHotspot.x}%`,
    '--focus-y': `${activeHotspot.y}%`,
  } as CSSProperties

  return (
    <section
      id="anatomy"
      className={`pt-8 pb-16 px-4 sm:px-8 max-w-[1320px] mx-auto anatomy-stage-${phase}`}
      aria-label="التشريح الهندسي التفاعلي للسيارة"
    >
      {/* Vehicle Selector Strip */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <p className="text-sm text-[#d4af70] mb-2">
            {selectedVehicle.brandName} · {selectedVehicle.category} · طراز {selectedVehicle.year}
          </p>
          <h1 className="font-ruqaa text-3xl sm:text-5xl text-[#f5f2eb] text-balance">
            {selectedVehicle.name}
          </h1>
          <p className="text-sm sm:text-base text-[#a6a095] mt-2 max-w-2xl">
            {selectedVehicle.edition} — اضغط على أي نقطة مضيئة على السيارة للدخول إلى التشريح الهندسي الكامل لكل منظومة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (phase === 'detail') returnToExterior()
              setXrayMode((prev) => !prev)
            }}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 border ${
              xrayMode && phase === 'overview'
                ? 'bg-[#d4af70] text-[#0d0b07] border-[#d4af70]'
                : 'bg-[#12161f] text-[#f5f2eb] border-white/15 hover:border-[#d4af70]/60'
            }`}
          >
            <Eye size={16} />
            <span>{xrayMode ? 'إظهار الهيكل الخارجي' : 'تشريح الأشعة السينية X-Ray'}</span>
          </button>
        </div>
      </div>

      {/* Flagship Model Switcher Tabs */}
      <div
        className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none"
        role="tablist"
        aria-label="اختيار السيارة للتشريح"
      >
        {fleet.map((car) => {
          const active = car.id === selectedVehicle.id
          return (
            <button
              key={car.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelectVehicle(car)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap shrink-0 border ${
                active
                  ? 'bg-[#181d28] text-[#d4af70] border-[#d4af70]/60 font-medium'
                  : 'bg-[#12161f]/60 text-[#a6a095] border-white/10 hover:text-[#f5f2eb] hover:border-white/25'
              }`}
            >
              <span className="font-ruqaa text-[17px] leading-relaxed">{car.name}</span>
            </button>
          )
        })}
      </div>

      {/* Main Anatomy Stage + Technical Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Framed 16:9 Interactive Media Plane */}
        <div className={phase === 'detail' ? 'xl:col-span-8' : 'xl:col-span-12'}>
          <div className="anatomy-frame shadow-2xl" style={planeStyle}>
            {/* Exterior & X-ray Layer */}
            <div className="anatomy-exterior-layer">
              <ResilientImage
                src={selectedVehicle.heroImage}
                alt={`${selectedVehicle.name} — العرض الهندسي`}
                fallbackTitle={selectedVehicle.name}
                className="w-full h-full object-cover select-none"
                draggable={false}
              />

              <div className={`anatomy-xray-layer ${xrayMode ? 'visible' : ''}`}>
                <ResilientImage
                  src={selectedVehicle.xrayImage}
                  alt={`تشريح الأشعة السينية الكامل لسيارة ${selectedVehicle.name}`}
                  fallbackTitle="تشريح الشاصيه الكامل"
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
              </div>
            </div>

            {/* Detail Cutaway Layer */}
            <div className={`anatomy-detail-layer ${detailVisible ? 'visible' : ''}`}>
              <ResilientImage
                src={currentAnatomy.cutawayImage}
                alt={`${currentAnatomy.title} — ${selectedVehicle.name}`}
                fallbackTitle={currentAnatomy.title}
                className="anatomy-detail-image select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />
            </div>

            {/* Overview Interactive Hotspots */}
            {phase === 'overview' &&
              selectedVehicle.hotspots.map((spot) => (
                <button
                  key={spot.partId}
                  type="button"
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  className={`anatomy-hotspot ${hoveredPart === spot.partId ? 'is-hovered' : ''}`}
                  onPointerEnter={() => setHoveredPart(spot.partId)}
                  onPointerLeave={() => setHoveredPart(null)}
                  onFocus={() => setHoveredPart(spot.partId)}
                  onBlur={() => setHoveredPart(null)}
                  onClick={() => enterPart(spot.partId)}
                  aria-label={spot.label}
                >
                  <span className="anatomy-hotspot-core">
                    <Plus size={15} strokeWidth={2} />
                  </span>
                  <span className="anatomy-hotspot-tooltip font-body">{spot.label}</span>
                </button>
              ))}

            {/* Detail Numbered Pins */}
            {phase === 'detail' &&
              currentAnatomy.points.map((pt, index) => (
                <button
                  key={pt.code}
                  type="button"
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className={`cutaway-pin ${selectedPin === index ? 'is-open' : ''}`}
                  onClick={() => setSelectedPin(index)}
                  aria-label={`${pt.code} — ${pt.label}`}
                  aria-expanded={selectedPin === index}
                >
                  <span className="cutaway-pin-badge tabular-nums">{pt.code}</span>
                </button>
              ))}

            {/* Back Button inside Detail Mode */}
            {phase !== 'overview' && (
              <button
                ref={backBtnRef}
                type="button"
                onClick={returnToExterior}
                disabled={phase === 'entering' || phase === 'returning'}
                className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#d4af70] text-[#0d0b07] hover:bg-[#e5c58e] text-sm font-medium shadow-lg transition-colors whitespace-nowrap"
              >
                <ArrowRight size={16} />
                <span>
                  {phase === 'returning' ? 'جارٍ العودة إلى الهيكل…' : 'عودة إلى هيكل السيارة'}
                </span>
                <kbd className="text-xs px-1.5 py-0.5 rounded bg-black/15 font-mono">Esc</kbd>
              </button>
            )}

            {/* Subtle Bottom Label in Overview (Desktop/Tablet) */}
            {phase === 'overview' && (
              <div className="hidden sm:flex absolute bottom-4 right-4 left-4 items-center justify-between gap-2 pointer-events-none">
                <div className="bg-[#0a0c10]/80 backdrop-blur-sm border border-white/10 rounded-lg px-3.5 py-2 text-xs text-[#f5f2eb]">
                  {xrayMode
                    ? 'وضع التشريح الشفاف X-Ray — يظهر الشاصيه والمحرك ونظام التعليق بالكامل'
                    : `${selectedVehicle.exteriorFinish} · ${selectedVehicle.wheelDesign}`}
                </div>
              </div>
            )}
          </div>

          {/* Direct 5-Part Dissection Quick Selector Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="أقسام تشريح السيارة">
            <span className="text-xs text-[#a6a095] ml-2 flex items-center gap-1.5">
              <Layers size={14} className="text-[#d4af70]" />
              تشريح أجزاء السيارة:
            </span>
            {ANATOMY_PART_LABELS.map((item) => {
              const isSelected = phase === 'detail' && activePart === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => enterPart(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'bg-[#d4af70] text-[#0d0b07] border-[#d4af70] font-medium'
                      : 'bg-[#12161f] text-[#f5f2eb] border-white/10 hover:border-[#d4af70]/50'
                  }`}
                >
                  {item.title}
                </button>
              )
            })}
          </div>
        </div>

        {/* Detail Engineering Breakdown Sidebar (Visible in Detail Mode) */}
        {phase === 'detail' && (
          <aside
            className="xl:col-span-4 bg-[#12161f] border border-white/10 rounded-xl p-6 space-y-5"
            aria-label="تفاصيل التشريح الهندسي"
          >
            <div>
              <p className="text-xs text-[#d4af70] mb-1">
                {selectedVehicle.name} · تشريح النظام
              </p>
              <h2 className="font-ruqaa text-2xl sm:text-3xl text-[#f5f2eb]">
                {currentAnatomy.title}
              </h2>
              <p className="text-sm text-[#a6a095] mt-2 leading-relaxed">
                {currentAnatomy.summary}
              </p>
            </div>

            {/* Key Engineering Numbers */}
            <div className="grid grid-cols-1 gap-2.5 py-3 border-y border-white/10">
              {currentAnatomy.specs.map((sp) => (
                <div key={sp.label} className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#a6a095]">{sp.label}</span>
                  <span className="text-[#f5f2eb] font-medium tabular-nums">{sp.value}</span>
                </div>
              ))}
            </div>

            {/* Interactive Component Breakdown List */}
            <div>
              <p className="text-xs text-[#a6a095] mb-3">مكونات الجزء المشروح (اضغط للتفاصيل):</p>
              <div className="space-y-2">
                {currentAnatomy.points.map((pt, idx) => {
                  const open = selectedPin === idx
                  return (
                    <button
                      key={pt.code}
                      type="button"
                      onClick={() => setSelectedPin(idx)}
                      aria-expanded={open}
                      className={`w-full text-right p-3.5 rounded-lg border transition-colors ${
                        open
                          ? 'bg-[#181d28] border-[#d4af70]/60'
                          : 'bg-[#0d1017] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2.5 text-sm font-medium text-[#f5f2eb]">
                          <span className="text-xs text-[#d4af70] tabular-nums">{pt.code}</span>
                          <span>{pt.label}</span>
                        </span>
                        <span className="text-xs text-[#d4af70]">
                          {open ? 'مفتوح' : 'عرض'}
                        </span>
                      </div>
                      {open && (
                        <p className="text-xs sm:text-sm text-[#a6a095] mt-2 leading-relaxed">
                          {pt.detail}
                        </p>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-[#d4af70] mb-1 flex items-center gap-1.5">
                <Sparkles size={13} />
                الأثر على تجربة القيادة
              </p>
              <p className="text-sm text-[#f5f2eb] leading-relaxed">{currentAnatomy.benefit}</p>
            </div>
          </aside>
        )}
      </div>

      {/* Vehicle Performance Summary Strip (Always Visible Below Anatomy Stage) */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-6 border-t border-white/10">
        <div>
          <p className="text-xs text-[#a6a095]">القوة الحصانية</p>
          <p className="text-lg sm:text-xl font-medium text-[#f5f2eb] mt-1 tabular-nums">
            {selectedVehicle.horsepower}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#a6a095]">عزم الدوران</p>
          <p className="text-lg sm:text-xl font-medium text-[#f5f2eb] mt-1 tabular-nums">
            {selectedVehicle.torque}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#a6a095]">التسارع ٠–١٠٠ كم/س</p>
          <p className="text-lg sm:text-xl font-medium text-[#f5f2eb] mt-1 tabular-nums">
            {selectedVehicle.acceleration}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#a6a095]">السرعة القصوى</p>
          <p className="text-lg sm:text-xl font-medium text-[#f5f2eb] mt-1 tabular-nums">
            {selectedVehicle.topSpeed}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs text-[#a6a095]">سعر صالة القبطان</p>
          <p className="text-lg sm:text-xl font-medium text-[#d4af70] mt-1 tabular-nums">
            {selectedVehicle.price}
          </p>
        </div>
      </div>
    </section>
  )
}
